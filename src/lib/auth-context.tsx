import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updateProfile,
  onAuthStateChanged,
  type User as FbUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export type Profile = {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  email?: string | null;
};

type AuthContextValue = {
  user: FbUser | null;
  profile: Profile | null;
  loading: boolean;
  emailVerified: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (input: {
    email: string;
    password: string;
    fullName: string;
    dateOfBirth: string;
  }) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  resendVerification: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password";
    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in.";
    case "auth/weak-password":
      return "Password is too weak (min 6 characters).";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return (e as { message?: string })?.message ?? "Something went wrong";
  }
}

async function loadProfile(uid: string): Promise<Profile | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const d = snap.data() as Record<string, unknown>;
    return {
      id: uid,
      full_name: (d.fullName as string) ?? (d.full_name as string) ?? "",
      date_of_birth: (d.dob as string) ?? (d.date_of_birth as string) ?? null,
      email: (d.email as string) ?? null,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FbUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Ensure a Firestore user doc exists (covers Google sign-in)
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid,
            fullName: u.displayName ?? "",
            email: u.email ?? "",
            dob: null,
            createdAt: serverTimestamp(),
          });
        }
        setProfile(await loadProfile(u.uid));
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    emailVerified: !!user?.emailVerified,
    async signIn(email, password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { error: null };
      } catch (e) {
        return { error: mapError(e) };
      }
    },
    async signUp({ email, password, fullName, dateOfBirth }) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName });
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          fullName,
          email,
          dob: dateOfBirth,
          createdAt: serverTimestamp(),
        });
        try {
          await sendEmailVerification(cred.user, {
            url: `${window.location.origin}/login`,
          });
        } catch {
          // non-fatal
        }
        setProfile({ id: cred.user.uid, full_name: fullName, date_of_birth: dateOfBirth, email });
        return { error: null };
      } catch (e) {
        return { error: mapError(e) };
      }
    },
    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider);
        return { error: null };
      } catch (e) {
        return { error: mapError(e) };
      }
    },
    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email, {
          url: `${window.location.origin}/login`,
        });
        return { error: null };
      } catch (e) {
        return { error: mapError(e) };
      }
    },
    async resendVerification() {
      try {
        if (!auth.currentUser) return { error: "Not signed in" };
        await sendEmailVerification(auth.currentUser, {
          url: `${window.location.origin}/login`,
        });
        return { error: null };
      } catch (e) {
        return { error: mapError(e) };
      }
    },
    async signOut() {
      await fbSignOut(auth);
    },
    async refreshProfile() {
      if (user) setProfile(await loadProfile(user.uid));
    },
    async reloadUser() {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function ageFromDob(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}
