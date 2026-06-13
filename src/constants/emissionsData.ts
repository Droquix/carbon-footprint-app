import type { EmissionsData } from "../types";

export const EMISSIONS_DATA: EmissionsData = {
  transport: {
    // Average medium petrol passenger car
    car: {
      value: 0.17,
      unit: "kg CO2e/km",
      citation:
        "UK DEFRA 2023 Greenhouse Gas Conversion Factors for average passenger car",
    },
    // Average local bus per passenger-kilometer
    bus: {
      value: 0.096,
      unit: "kg CO2e/km",
      citation:
        "UK DEFRA 2023 Greenhouse Gas Conversion Factors for local public bus",
    },
    // Average short-haul flight per passenger-kilometer
    flight: {
      value: 0.15,
      unit: "kg CO2e/km",
      citation:
        "UK DEFRA 2023 Greenhouse Gas Conversion Factors for short-haul passenger flight",
    },
    // Bicycle has zero direct emissions
    bike: {
      value: 0.0,
      unit: "kg CO2e/km",
      citation:
        "US EPA Greenhouse Gas Emissions (Zero direct tailpipe emissions)",
    },
  },
  food: {
    // Beef from beef herd (excluding dairy herd)
    beef: {
      value: 59.6,
      unit: "kg CO2e/kg",
      citation:
        "Poore & Nemecek (2018), Science. Land-use, processing, and transportation footprint.",
    },
    // Poultry/Chicken meat
    chicken: {
      value: 6.1,
      unit: "kg CO2e/kg",
      citation:
        "Poore & Nemecek (2018), Science. Land-use, feed production, and processing footprint.",
    },
    // Average root/leafy vegetables
    vegetables: {
      value: 0.4,
      unit: "kg CO2e/kg",
      citation:
        "Poore & Nemecek (2018), Science. Land-use and direct agricultural emissions.",
    },
    // Dairy products represented by cheese
    dairy: {
      value: 21.2,
      unit: "kg CO2e/kg",
      citation:
        "Poore & Nemecek (2018), Science. Milk production, curdling, and cheese aging footprint.",
    },
  },
  energy: {
    // US national average grid electricity
    electricity: {
      value: 0.371,
      unit: "kg CO2e/kWh",
      citation:
        "US EPA eGRID 2022 national average grid electricity emission factor",
    },
    // Natural gas per cubic meter
    naturalGas: {
      value: 1.93,
      unit: "kg CO2e/m³",
      citation:
        "US EPA Greenhouse Gas Emission Factors Hub (2023) for natural gas combustion",
    },
  },
  shopping: {
    // Average textile/clothing garment
    clothing: {
      value: 15.0,
      unit: "kg CO2e/item",
      citation:
        "European Commission Product Environmental Footprint (PEF) average apparel item",
    },
    // Average electronic laptop device
    electronics: {
      value: 300.0,
      unit: "kg CO2e/item",
      citation:
        "Dell/Apple Product Life Cycle Carbon Footprint reports average laptop lifecycle emissions",
    },
  },
};
