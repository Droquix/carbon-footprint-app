export interface Activity {
  id: string;
  type: string;
  amount: number;
  timestamp: number;
}

export interface EmissionFactor {
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
