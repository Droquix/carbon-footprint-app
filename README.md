# Carbon Footprint Tracker

A React + TypeScript + Vite web application built to help users **understand** their carbon impact, **track** daily activity carbon emissions, and **reduce** their environmental footprint through **personalized insights**.

---

## 📋 Problem Statement Alignment

This application is designed around three core environmental objectives:

1. **Understand**: Helping users identify the carbon intensity of their daily choices by displaying detailed CO2 calculations alongside reputable citations.
2. **Track**: Providing an active log of activities across categories (Transport, Food, Energy, and Shopping) with automatic persistence.
3. **Reduce**: Surfacing **personalized insights** that highlight the relative impact of their categories and recommend specific next actions.

---

## 🏛️ Architectural Decisions

- **Framework**: **React 19** combined with **Vite 8** and **TypeScript 6** to ensure high-performance HMR, strong compilation type safety, and clean bundler compilation.
- **Styling**: **Tailwind CSS** with custom glassmorphism components, structured grid systems, and a slate-dark modern color scheme.
- **Component Boundary**: Strictly separates presentation from logic. All components under `src/components/` are completely stateless UI elements that receive data and callbacks via props only.
- **Hooks-Based Business Logic**: Hooks (`useFootprint`, `useInsights`) coordinate state changes, filter logs, and compute emissions.
- **Graceful Storage**: The storage utility wrapper abstracts `localStorage` calls and actively checks storage availability on initialization. This ensures that the application operates safely in **private browsing** mode or restricted security sandboxes without throwing runtime exceptions.
- **Testing Philosophy**: Utilizes **Vitest** and **React Testing Library** for test execution. Unit tests cover all border-cases and input sanitization, while integration tests verify real user DOM actions, ensuring logic is decoupled from implementation details.

---

## 📊 Data Sources & Citations

Emission factors represent real carbon footprints with direct citations:

| Category      | Item        | Emission Factor | Unit                   | Sourced Citation                                                    |
| :------------ | :---------- | :-------------- | :--------------------- | :------------------------------------------------------------------ |
| **Transport** | Car         | `0.170`         | kg CO2e / km           | UK DEFRA 2023 Conversion Factors (Medium petrol passenger car)      |
|               | Bus         | `0.096`         | kg CO2e / passenger-km | UK DEFRA 2023 Conversion Factors (Public transport local bus)       |
|               | Flight      | `0.150`         | kg CO2e / passenger-km | UK DEFRA 2023 Conversion Factors (Short-haul passenger flight)      |
|               | Bike        | `0.000`         | kg CO2e / km           | US EPA Greenhouse Gas Emissions Guidelines                          |
| **Food**      | Beef        | `59.600`        | kg CO2e / kg           | Poore & Nemecek (2018), _Science_ (Beef herd footprint)             |
|               | Chicken     | `6.100`         | kg CO2e / kg           | Poore & Nemecek (2018), _Science_ (Poultry footprint)               |
|               | Vegetables  | `0.400`         | kg CO2e / kg           | Poore & Nemecek (2018), _Science_ (Root/leafy vegetables)           |
|               | Dairy       | `21.200`        | kg CO2e / kg           | Poore & Nemecek (2018), _Science_ (Representative cheese footprint) |
| **Energy**    | Electricity | `0.371`         | kg CO2e / kWh          | US EPA eGRID 2022 National Average Grid Emission Factor             |
|               | Natural Gas | `1.930`         | kg CO2e / m³           | US EPA Greenhouse Gas Emission Factors Hub (2023)                   |
| **Shopping**  | Clothing    | `15.000`        | kg CO2e / item         | European Commission Product Environmental Footprint (PEF)           |
|               | Electronics | `300.000`       | kg CO2e / item         | Dell/Apple Product Life Cycle LCA Carbon Reports (Laptop average)   |

---

## 🚀 How to Run Locally

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 How to Run Tests

The test suite runs under Vitest and covers unit calculations, storage state mocks, custom hooks behavior, and browser-like user interactions.

- **Run all tests once** (CI Mode):
  ```bash
  npm run test
  ```
- **Run linter**:
  ```bash
  npm run lint
  ```
- **Auto-format code**:
  ```bash
  npm run format
  ```
- **Build production bundle**:
  ```bash
  npm run build
  ```

---

## ♿ Accessibility Approach

- **Landmarks & Semantics**: Constructed with standard landmark tags (`<main>`, `<nav>`, `<section>`, `<header>`, `<footer>`) to facilitate screen-reader navigation.
- **Form Association**: Every single select or text input field contains a `<label htmlFor>` attribute explicitly mapped to the element's `id`.
- **Keyboard Navigation & Interactivity**: Exclusively uses standard `<button>` elements for click actions to ensure focus indexing. No custom `div` click listeners are used.
- **Multi-Modal Information**: Visual indicators (such as carbon difference ratings) always display text markers alongside color-coding, ensuring that status information is never conveyed by color alone.
- **Button Labels**: Generic icons or controls have descriptive `aria-label` fields.

---

## ⚠️ Assumptions & Limitations

- **7-Day Scope**: Carbon calculations on the Insights card focus on active logs from the last 7 days.
- **Indian Average Baseline**: The comparison benchmark uses the Indian national average carbon footprint of **1.9 tons/year per capita** (1,900 kg/year). The app extrapolates the user's weekly logged data into an annual estimate for comparison.
- **Persistence Boundary**: Data is saved directly in browser cookies/localStorage. In private windows, data is managed in-memory and will clear upon page refreshes.
