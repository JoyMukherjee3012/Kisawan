import { createFileRoute } from "@tanstack/react-router";
import { GrowingGuide } from "@/components/dashboard/GrowingGuide";

export const Route = createFileRoute("/_authenticated/growing-guide/$crop")({
  component: GrowingGuideRoute,
  head: () => ({
    meta: [
      { title: "Growing Guide — Kisawan" },
    ],
  }),
});

function GrowingGuideRoute() {
  const { crop } = Route.useParams();
  return (
    <div className="mx-auto max-w-5xl px-4 pt-4 pb-20">
      <GrowingGuide crop={crop} />
    </div>
  );
}
