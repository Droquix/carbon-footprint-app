export interface Activity {
  id: string;
  type: string;
  amount: number;
  timestamp: number;
}

interface EmissionFactor {
  value: number;
  unit: string;
  citation: string;
}

export interface TransportFactors {
  car: EmissionFactor;
  bus: EmissionFactor;
  flight: EmissionFactor;
  bike: EmissionFactor;
}

export interface FoodFactors {
  beef: EmissionFactor;
  chicken: EmissionFactor;
  vegetables: EmissionFactor;
  dairy: EmissionFactor;
}

export interface EnergyFactors {
  electricity: EmissionFactor;
  naturalGas: EmissionFactor;
}

export interface ShoppingFactors {
  clothing: EmissionFactor;
  electronics: EmissionFactor;
}

export interface EmissionsData {
  transport: TransportFactors;
  food: FoodFactors;
  energy: EnergyFactors;
  shopping: ShoppingFactors;
}

export interface CategorySelectorProps {
  category: "transport" | "food" | "energy" | "shopping";
  onSelectCategory: (
    category: "transport" | "food" | "energy" | "shopping"
  ) => void;
}

export interface ActivityTypeSelectorProps {
  activityType: string;
  onChangeActivityType: (type: string) => void;
  typesOptions: { value: string; label: string }[];
}

export interface QuantityInputProps {
  amountInput: string;
  onChangeAmountInput: (amount: string) => void;
  unitLabel: string;
}

export interface ActivityFormProps {
  onLogActivity: (type: string, amount: number) => void;
}

export interface AverageComparisonProps {
  totalWeeklyCO2: number;
  statusLabel: string;
  statusTextDesc: string;
  barColorClass: string;
  textColorClass: string;
  ratingLabelText: string;
  indianWeeklyAverageKg: number;
  percentageOfAverage: number;
}

export interface RecommendationCardProps {
  headline: string;
  saving: string;
  topRecommendation: string;
}

export interface RecommendationDetails {
  headline: string;
  saving: string;
  action: string;
}

export interface InsightsCardProps {
  insights: {
    totalWeeklyCO2: number;
    highestImpactCategory:
      | "transport"
      | "food"
      | "energy"
      | "shopping"
      | "none";
    topRecommendation: string;
    recommendation: RecommendationDetails;
    comparisonToIndianAverage: {
      userAnnualEstimateKg: number;
      indianAverageAnnualKg: number;
      differencePercentage: number;
      comparisonText: string;
    };
  };
}

export interface HistoryEntryProps {
  activity: Activity;
  categoryLabel: string;
  co2: number;
  impactPill: { classes: string; label: string };
  typeLabel: string;
  unit: string;
}

export interface HistoryListProps {
  activities: Activity[];
  onClearActivities: () => void;
}

export interface CategoryBreakdownProps {
  percentages: {
    transport: number;
    food: number;
    energy: number;
    shopping: number;
  };
}
