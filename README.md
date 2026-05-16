# 📈 StockControl

StockControl is a premium, high-performance portfolio management dashboard designed for investors who want to track, analyze, and optimize their financial assets in one place. Built with a focus on modern aesthetics and data clarity, it provides a comprehensive overview of your investment journey.

---

## ✨ Key Features

### 📊 Modern Dashboard
*   **Real-time Performance**: Track your total invested value, current market value, and overall gain/loss (BRL & CAD).
*   **Asset Allocation**: Visual breakdown of your portfolio across Stocks, REITs, Cryptocurrencies, and ETFs using interactive charts.
*   **Position Tracking**: Detailed view of every held asset, including average cost, quantity, and current market performance.

### 💰 Passive Income (Dividends)
*   **Income Matrix**: Monthly breakdown of dividends received by asset in a clean, matrix-style table.
*   **Growth Visualization**: Historical dividend charts to track your journey towards financial independence.
*   **Yearly Filtering**: Focus on specific years to analyze your passive income trends.

### 📝 Transaction Management
*   **Trade History**: Full record of buy and sell operations.
*   **Atomic Trades**: Support for multi-asset transactions within a single trade record (e.g., rebalancing operations).
*   **Tax Integration**: Track brokerage fees and taxes per trade for accurate performance metrics.

### 🧪 Investment Simulation
*   **What-if Scenarios**: Simulate the impact of new purchases on your average cost and portfolio allocation before executing them.

---

## 🎨 Design Philosophy

StockControl features a **Premium Dark Mode** aesthetic designed for high-focus data analysis:
*   **Typography**: Using `Manrope` for maximum readability and a modern tech feel.
*   **Design System**: Fully controlled via CSS variables for consistency (`--primary`, `--surface-dark`, etc.).
*   **Interactive UI**: Smooth hover effects, glassmorphism-inspired cards, and responsive layouts.
*   **Visual Excellence**: Powered by Chart.js for beautiful, high-contrast data visualization.

---

## 🛠️ Technology Stack

*   **Core**: [Angular 21.2+](https://angular.dev/)
*   **State Management**: Reactive patterns with RxJS.
*   **Charts**: [ng2-charts](https://valor-software.com/ng2-charts/) & [Chart.js](https://www.chartjs.org/)
*   **Testing**: [Vitest](https://vitest.dev/)
*   **Styling**: Vanilla CSS with CSS Variables & modern layout techniques.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS version recommended)
*   npm

### Installation
1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```

### Development Server
Run the following command for a local dev server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

---

## 🏗️ Architecture

The project follows a **Feature-based Architecture**, ensuring high modularity and scalability:
*   `src/app/core/`: Global services, interceptors, and models.
*   `src/app/features/`: Independent business modules (Dashboard, Dividends, etc.).
*   `src/app/shared/`: Reusable UI components and pipes.

