import { createFileRoute } from "@tanstack/react-router";
import { RecommendedCropsDashboard } from "@/components/dashboard/RecommendedCropsDashboard";

export const Route = createFileRoute("/_authenticated/recommended-crops")({
  component: RecommendedCropsRoute,
  head: () => ({
    meta: [
      { title: "Recommended Crops — Kisawan" },
      { name: "description", content: "AI recommended crops based on live weather and soil telemetry." },
    ],
  }),
});

function RecommendedCropsRoute() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-4 pb-20">
      <RecommendedCropsDashboard />
    </div>
  );
}
