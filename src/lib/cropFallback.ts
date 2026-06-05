export function getFallbackDashboardData(soilType: string) {
  let topCrops: any[] = [];
  const t = soilType.toLowerCase();

  if (t.includes("clay loam") || t.includes("silty clay")) {
    topCrops = [
      { crop: "Rice", score: 95, reason: "Excellent moisture retention." },
      { crop: "Potato", score: 90, reason: "Good organic matter support." },
      { crop: "Mustard", score: 88, reason: "Thrives with residual moisture." },
      { crop: "Tomato", score: 85, reason: "Rich nutrient availability." },
      { crop: "Onion", score: 82, reason: "Firm soil structure." },
    ];
  } else if (t.includes("sandy loam") || t.includes("sandy")) {
    topCrops = [
      { crop: "Groundnut", score: 94, reason: "Loose soil allows peg penetration." },
      { crop: "Maize", score: 91, reason: "Well-drained soil prevents waterlogging." },
      { crop: "Pulses", score: 89, reason: "Deep root system performs well." },
      { crop: "Watermelon", score: 86, reason: "Sandy soils heat up quickly." },
      { crop: "Vegetables", score: 83, reason: "Good aeration prevents root rot." },
    ];
  } else {
    topCrops = [
      { crop: "Wheat", score: 92, reason: "Perfect balance of moisture and aeration." },
      { crop: "Maize", score: 90, reason: "Highly adaptable to balanced loamy soils." },
      { crop: "Cotton", score: 88, reason: "Excellent root penetration." },
      { crop: "Soybean", score: 85, reason: "Good drainage prevents diseases." },
      { crop: "Vegetables", score: 84, reason: "Balanced nutrients support growth." },
    ];
  }

  return {
    topCrops,
    soilSummary: `The ${soilType} soil is moderately fertile with typical water retention.`,
    irrigation: {
      needed: "Yes",
      amount: "Moderate",
      time: "Morning or Evening",
      method: "Drip or Sprinkler",
      reason: "Standard irrigation required based on generic soil profile."
    },
    fertilizer: {
      status: "Moderate",
      concerns: "General nutrient maintenance",
      organic: "Apply well-rotted Farm Yard Manure (FYM) or compost.",
      chemical: "Apply balanced NPK based on specific crop requirements."
    },
    alerts: []
  };
}

export function getFallbackRecommendedCrops(soilType: string) {
  let topCrops: any[] = [];
  const t = soilType.toLowerCase();

  if (t.includes("clay loam") || t.includes("silty clay")) {
    topCrops = [
      { name: "Rice", suitability: 95, season: "Monsoon", waterRequirement: "High", difficulty: "Medium", reason: "Excellent moisture retention.", profitability: "High", category: "Grain" },
      { name: "Potato", suitability: 90, season: "Winter", waterRequirement: "Medium", difficulty: "Medium", reason: "Good organic matter.", profitability: "High", category: "Vegetable" },
      { name: "Mustard", suitability: 88, season: "Winter", waterRequirement: "Low", difficulty: "Easy", reason: "Thrives with residual moisture.", profitability: "Medium", category: "Cash Crop" },
      { name: "Tomato", suitability: 85, season: "Year-round", waterRequirement: "Medium", difficulty: "Medium", reason: "Rich nutrient availability.", profitability: "High", category: "Vegetable" },
      { name: "Onion", suitability: 82, season: "Winter", waterRequirement: "Medium", difficulty: "Easy", reason: "Firm soil structure.", profitability: "High", category: "Vegetable" },
    ];
  } else if (t.includes("sandy loam") || t.includes("sandy")) {
    topCrops = [
      { name: "Groundnut", suitability: 94, season: "Monsoon", waterRequirement: "Low", difficulty: "Easy", reason: "Loose soil allows peg penetration.", profitability: "High", category: "Cash Crop" },
      { name: "Maize", suitability: 91, season: "Monsoon", waterRequirement: "Medium", difficulty: "Easy", reason: "Well-drained soil.", profitability: "Medium", category: "Grain" },
      { name: "Pulses", suitability: 89, season: "Year-round", waterRequirement: "Low", difficulty: "Easy", reason: "Deep root system performs well.", profitability: "High", category: "Grain" },
      { name: "Watermelon", suitability: 86, season: "Summer", waterRequirement: "Medium", difficulty: "Medium", reason: "Sandy soils heat up quickly.", profitability: "High", category: "Fruit" },
      { name: "Cucumber", suitability: 83, season: "Year-round", waterRequirement: "Medium", difficulty: "Easy", reason: "Good aeration prevents root rot.", profitability: "Medium", category: "Vegetable" },
    ];
  } else {
    topCrops = [
      { name: "Wheat", suitability: 92, season: "Winter", waterRequirement: "Medium", difficulty: "Medium", reason: "Perfect balance of moisture and aeration.", profitability: "High", category: "Grain" },
      { name: "Maize", suitability: 90, season: "Monsoon", waterRequirement: "Medium", difficulty: "Easy", reason: "Highly adaptable to balanced loamy soils.", profitability: "Medium", category: "Grain" },
      { name: "Cotton", suitability: 88, season: "Summer", waterRequirement: "Medium", difficulty: "Hard", reason: "Excellent root penetration.", profitability: "High", category: "Cash Crop" },
      { name: "Soybean", suitability: 85, season: "Monsoon", waterRequirement: "Medium", difficulty: "Medium", reason: "Good drainage prevents diseases.", profitability: "Medium", category: "Cash Crop" },
      { name: "Cabbage", suitability: 84, season: "Winter", waterRequirement: "High", difficulty: "Medium", reason: "Balanced nutrients support growth.", profitability: "Medium", category: "Vegetable" },
    ];
  }

  const genericAdditional = [
    { name: "Millet", suitability: 80, season: "Summer", waterRequirement: "Low", difficulty: "Easy", reason: "Highly resilient to environmental stress.", profitability: "Medium", category: "Grain" },
    { name: "Sorghum", suitability: 79, season: "Summer", waterRequirement: "Low", difficulty: "Easy", reason: "Deep roots extract moisture efficiently.", profitability: "Medium", category: "Grain" },
    { name: "Sunflower", suitability: 78, season: "Summer", waterRequirement: "Low", difficulty: "Medium", reason: "Adaptable to various soil types.", profitability: "High", category: "Cash Crop" },
    { name: "Chickpea", suitability: 77, season: "Winter", waterRequirement: "Low", difficulty: "Medium", reason: "Fixes nitrogen and requires minimal irrigation.", profitability: "High", category: "Grain" },
    { name: "Lentil", suitability: 76, season: "Winter", waterRequirement: "Low", difficulty: "Easy", reason: "Grows well on residual moisture.", profitability: "Medium", category: "Grain" },
    { name: "Sesame", suitability: 75, season: "Summer", waterRequirement: "Low", difficulty: "Easy", reason: "Heat tolerant and fast growing.", profitability: "High", category: "Cash Crop" },
    { name: "Chili", suitability: 74, season: "Year-round", waterRequirement: "Medium", difficulty: "Hard", reason: "High market value cash crop.", profitability: "High", category: "Vegetable" },
    { name: "Garlic", suitability: 73, season: "Winter", waterRequirement: "Medium", difficulty: "Medium", reason: "Profitable bulb crop.", profitability: "High", category: "Vegetable" },
    { name: "Ginger", suitability: 72, season: "Monsoon", waterRequirement: "Medium", difficulty: "Hard", reason: "High value spice crop.", profitability: "High", category: "Cash Crop" },
    { name: "Turmeric", suitability: 71, season: "Monsoon", waterRequirement: "Medium", difficulty: "Medium", reason: "Thrives in well-drained soils.", profitability: "High", category: "Cash Crop" },
  ];

  const topCropNames = new Set(topCrops.map(c => c.name));
  const additionalCrops = genericAdditional.filter(c => !topCropNames.has(c.name));

  return {
    farmingPlan: {
      currentSeason: topCrops[0].season,
      bestCrop: topCrops[0].name,
      alternativeCrops: `${topCrops[1].name}, ${topCrops[2].name}, ${topCrops[3].name}`,
      expectedWaterNeed: topCrops[0].waterRequirement,
      expectedProfitability: topCrops[0].profitability
    },
    topCrops,
    additionalCrops
  };
}

export function getFallbackGrowingGuide(cropName: string) {
  return {
    summary: `${cropName} is a resilient and profitable crop when managed with proper agronomic practices. This guide outlines standard cultivation techniques.`,
    totalDuration: "90-120 Days",
    estimatedCostPerAcre: "₹15,000 - ₹25,000",
    idealWaterRequirement: "450-600 mm",
    imageUrl: `https://placehold.co/800x600/0a111a/10b981?text=${encodeURIComponent(cropName)}`,
    recommendedChemicals: [
      { name: "NPK 19:19:19", type: "Fertilizer", purpose: "Balanced basal nutrition for root establishment" },
      { name: "Urea (46% N)", type: "Fertilizer", purpose: "Nitrogen top-dressing for vegetative growth" },
      { name: "Chlorpyrifos 20% EC", type: "Insecticide", purpose: "Control of soil insects and termites" },
      { name: "Imidacloprid 17.8% SL", type: "Insecticide", purpose: "Systemic control of sucking pests (aphids, jassids)" },
      { name: "Mancozeb 75% WP", type: "Fungicide", purpose: "Broad-spectrum contact fungicide for leaf spots" },
      { name: "Carbendazim 50% WP", type: "Fungicide", purpose: "Systemic disease control and seed treatment" }
    ],
    phases: [
      {
        phaseName: "1. Land Preparation",
        duration: "Days 0-10",
        action: "Plough the field 2-3 times to achieve a fine tilth. Apply basal dose of organic manure before sowing the seeds at recommended spacing.",
        waterNeed: "Medium"
      },
      {
        phaseName: "2. Sowing & Germination",
        duration: "Days 11-20",
        action: "Sow seeds at optimum depth and spacing. Ensure light irrigation immediately after sowing to facilitate uniform germination.",
        waterNeed: "Low"
      },
      {
        phaseName: "3. Early Vegetative Growth",
        duration: "Days 21-45",
        action: "Maintain weed-free environment through manual weeding or herbicides. Monitor for early signs of pest attacks.",
        waterNeed: "High"
      },
      {
        phaseName: "4. Late Vegetative & Branching",
        duration: "Days 46-65",
        action: "Promote healthy canopy development. Inter-cultivation operations should be completed. Maintain optimal soil moisture.",
        waterNeed: "High"
      },
      {
        phaseName: "5. Flowering & Fruiting",
        duration: "Days 66-90",
        action: "Critical stage for irrigation. Ensure adequate soil moisture without waterlogging. Apply micronutrients if deficiency symptoms appear.",
        waterNeed: "High"
      },
      {
        phaseName: "6. Maturation & Harvesting",
        duration: "Days 91-120",
        action: "Reduce irrigation as the crop matures. Harvest when grains/fruits reach optimal physiological maturity to prevent post-harvest losses.",
        waterNeed: "Low"
      }
    ],
    costBreakdown: [
      { item: "Seeds & Treatment", cost: "₹2,500" },
      { item: "Land Preparation", cost: "₹3,000" },
      { item: "Fertilizers & Manure", cost: "₹5,000" },
      { item: "Irrigation & Labor", cost: "₹6,000" },
      { item: "Harvesting", cost: "₹3,500" }
    ],
    commonDiseases: ["Root Rot", "Leaf Spot", "Aphids", "Stem Borer"]
  };
}
