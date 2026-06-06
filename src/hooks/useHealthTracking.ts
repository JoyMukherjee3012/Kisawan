import { useState, useEffect, useRef, useCallback } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export interface HealthData {
  steps: number;
  distanceKm: number;
  activeMinutes: number;
  calories: number;
  lastUpdated: number;
  location?: { lat: number; lng: number } | null;
}

export interface WellnessLog {
  sleepHours: number;
  waterLiters: number;
  weightKg: number;
  heightCm: number;
  mood: number; // 1-10
  energy: number; // 1-10
  stress: number; // 1-10
}

export function useHealthTracking(historyDays: number = 7) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<HealthData>({
    steps: 0,
    distanceKm: 0,
    activeMinutes: 0,
    calories: 0,
    lastUpdated: Date.now(),
    location: null,
  });

  const [history, setHistory] = useState<{ day: string; date: string; score: number; steps: number; sleep: number; water: number; waterLiters: number; sleepHours: number }[]>([]);

  const [wellnessLog, setWellnessLog] = useState<WellnessLog>({
    sleepHours: 0,
    waterLiters: 0,
    weightKg: 70, // default avg
    heightCm: 170, // default avg
    mood: 5,
    energy: 5,
    stress: 5,
  });

  const dataRef = useRef(data);
  dataRef.current = data;

  const wellnessRef = useRef(wellnessLog);
  wellnessRef.current = wellnessLog;

  const lastAccelRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const lastStepTimeRef = useRef(0);
  const motionEventReceivedRef = useRef(false);

  // Load today's data on mount if user is logged in
  useEffect(() => {
    async function loadTodayData() {
      if (!user) return;
      const today = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", user.uid, "health_data", today);
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const d = snap.data();
          setData((prev) => ({
            ...prev,
            steps: d.steps || 0,
            distanceKm: d.distanceKm || 0,
            activeMinutes: d.activeMinutes || 0,
            calories: d.calories || 0,
            location: d.location || null,
          }));
          if (d.wellness) {
            setWellnessLog((prev) => ({ ...prev, ...d.wellness }));
          }
        }
        
        // Load history
        const q = query(collection(db, "users", user.uid, "health_data"), orderBy("updatedAt", "desc"), limit(historyDays));
        const querySnapshot = await getDocs(q);
        const historyData: any[] = [];
        querySnapshot.forEach((docSnap) => {
          const d = docSnap.data();
          // Calculate score for past days based on same logic
          let score = 0;
          score += Math.min(30, ((d.steps || 0) / 10000) * 30);
          score += Math.min(20, ((d.activeMinutes || 0) / 60) * 20);
          score += Math.min(20, ((d.wellness?.sleepHours || 0) / 8) * 20);
          score += Math.min(20, ((d.wellness?.waterLiters || 0) / 3) * 20);
          const bmi = (d.wellness?.weightKg || 70) / Math.pow((d.wellness?.heightCm || 170) / 100, 2);
          if (bmi >= 18.5 && bmi <= 25) score += 10;
          else if (bmi > 25 && bmi < 30) score += 5;

          const dateStr = docSnap.id; // YYYY-MM-DD
          const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });

          historyData.push({
            day: dayName,
            date: dateStr,
            score: Math.round(score),
            steps: d.steps || 0,
            sleep: d.wellness?.sleepHours || 0,
            water: d.wellness?.waterLiters || 0,
            waterLiters: d.wellness?.waterLiters || 0,
            sleepHours: d.wellness?.sleepHours || 0,
          });
        });
        setHistory(historyData.reverse());
        
      } catch (e) {
        console.error("Failed to load health data", e);
      }
    }
    loadTodayData();
  }, [user, historyDays]);

  // Sync to Firebase periodically when connected
  useEffect(() => {
    if (!isConnected || !user) return;
    const interval = setInterval(async () => {
      const today = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", user.uid, "health_data", today);
      try {
        await setDoc(
          docRef,
          {
            ...dataRef.current,
            wellness: wellnessRef.current,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.error("Failed to sync health data", e);
      }
    }, 15000); // Sync every 15s

    return () => clearInterval(interval);
  }, [isConnected, user]);

  const processStep = () => {
    const now = Date.now();
    setData((prev) => {
      const newSteps = prev.steps + 1;
      return {
        ...prev,
        steps: newSteps,
        distanceKm: parseFloat(((newSteps * 0.76) / 1000).toFixed(2)),
        calories: Math.floor(newSteps * 0.04), // ~0.04 kcal per step
        lastUpdated: now,
      };
    });
  };

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    motionEventReceivedRef.current = true;
    const acc = event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    const currentMag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    
    if (lastAccelRef.current) {
      const lastMag = Math.sqrt(
        lastAccelRef.current.x ** 2 +
        lastAccelRef.current.y ** 2 +
        lastAccelRef.current.z ** 2
      );
      
      const delta = Math.abs(currentMag - lastMag);
      const now = Date.now();
      
      if (delta > 1.5 && now - lastStepTimeRef.current > 300) {
        lastStepTimeRef.current = now;
        processStep();
      }
    }
    
    lastAccelRef.current = { x: acc.x, y: acc.y, z: acc.z };
  }, []);

  // Calculate active minutes (if steps increased by at least 15 in the last minute)
  useEffect(() => {
    if (!isConnected) return;
    let prevSteps = data.steps;
    
    const activeInterval = setInterval(() => {
      const currentSteps = dataRef.current.steps;
      if (currentSteps - prevSteps > 15) {
        setData((prev) => ({ ...prev, activeMinutes: prev.activeMinutes + 1 }));
      }
      prevSteps = currentSteps;
    }, 60000); // Every 1 min
    
    return () => clearInterval(activeInterval);
  }, [isConnected, data.steps]);



  const requestPermissions = async () => {
    setError(null);
    
    // Geolocation Snapshot
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setData((prev) => ({
            ...prev,
            location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          }));
        },
        () => console.warn("Location permission denied"),
        { timeout: 10000 }
      );
    }

    // Motion Sensors
    let motionGranted = false;
    if (
      typeof (DeviceMotionEvent as any) !== "undefined" &&
      typeof (DeviceMotionEvent as any).requestPermission === "function"
    ) {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        if (permissionState === "granted") motionGranted = true;
        else setError("Motion sensor permission denied.");
      } catch (err) {
        setError("Error requesting motion permission. Ensure HTTPS.");
      }
    } else {
      motionGranted = true;
    }

    if (motionGranted) {
      window.addEventListener("devicemotion", handleMotion);
      setIsConnected(true);
      
      setTimeout(() => {
        if (!motionEventReceivedRef.current) {
          setIsDemoMode(true);
        }
      }, 3000);
    }
  };

  // Demo Mode Generator
  useEffect(() => {
    if (!isDemoMode || !isConnected) return;
    
    const demoInterval = setInterval(() => {
      processStep();
      processStep(); // 2 steps per second
    }, 1000);
    
    return () => clearInterval(demoInterval);
  }, [isDemoMode, isConnected]);

  const disconnectPhone = () => {
    setIsConnected(false);
    setIsDemoMode(false);
    window.removeEventListener("devicemotion", handleMotion);
  };

  const updateWellnessLog = (updates: Partial<WellnessLog>) => {
    setWellnessLog((prev) => ({ ...prev, ...updates }));
    // Force sync immediately
    if (user) {
      const today = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", user.uid, "health_data", today);
      setDoc(docRef, { wellness: { ...wellnessRef.current, ...updates } }, { merge: true });
    }
  };

  return {
    data,
    history,
    wellnessLog,
    isConnected,
    isDemoMode,
    error,
    requestPermissions,
    disconnectPhone,
    updateWellnessLog,
  };
}
