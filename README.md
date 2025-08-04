# 🧮 Numerical Integration Calculator

<div align="center">

![Numerical Integration Calculator](https://img.shields.io/badge/Numerical-Integration-blue?style=for-the-badge&logo=mathematics)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A comprehensive, interactive web application for visualizing and comparing numerical integration methods**

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🛠️ Installation](#installation) • [🤝 Contributing](#contributing)

---

### ✨ Key Features at a Glance

🎯 **Multiple Integration Methods** • 📊 **Interactive Visualizations** • 📈 **Convergence Analysis** • 📥 **Export Capabilities**

</div>

## 🌟 Overview

The **Numerical Integration Calculator** is a modern, feature-rich web application designed for students, educators, engineers, and researchers who need to approximate definite integrals using various numerical methods. With its intuitive interface and powerful visualization capabilities, it makes complex mathematical concepts accessible and engaging.

### 🎨 Beautiful Interface

<div align="center">

```
┌─────────────────────────────────────────────────────────────────┐
│  🧮 Numerical Integration Calculator                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Calculator  │  👁️ Visualization  │  📈 Analysis  │  📚 Tutorial  │
│                                                                 │
│  ┌─────────────┐    ┌─────────────────────────────────────────┐ │
│  │ Parameters  │    │         Interactive Charts              │ │
│  │             │    │                                         │ │
│  │ Function: x² │    │    ╭─╮                                 │ │
│  │ Range: [0,2]│    │   ╱   ╲     Area = ∫f(x)dx             │ │
│  │ Methods: ✓  │    │  ╱     ╲                               │ │
│  │ Intervals:10│    │ ╱       ╲                              │ │
│  └─────────────┘    └─────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

</div>

## 🚀 Features

### 🔢 **Integration Methods**
- **🔺 Trapezoidal Rule**: Basic method using trapezoids
- **🌊 Simpson's Rule**: Higher accuracy with parabolic approximations  
- **📏 Midpoint Rule**: Rectangle approximation at interval midpoints
- **🎲 Monte Carlo**: Random sampling for complex functions
- **➕ Extensible Architecture**: Easy to add new methods

### 📊 **Visualization & Analysis**
- **Interactive Function Plots**: Real-time visualization of functions
- **Method Comparison**: Side-by-side visual comparison
- **Convergence Analysis**: See how accuracy improves with more intervals
- **Error Estimation**: Theoretical and actual error calculations
- **Performance Metrics**: Computational efficiency analysis

### 💾 **Export Capabilities**
- **📸 PNG/JPG Export**: High-quality chart downloads
- **📄 TXT Reports**: Formatted numerical results
- **📋 JSON Data**: Complete calculation data
- **🔗 Share Results**: Copy to clipboard or native sharing

### 🎓 **Educational Features**
- **Built-in Tutorial**: Complete guide to numerical integration
- **Real-world Examples**: Physics, engineering, and finance applications  
- **Method Theory**: Mathematical background and error analysis
- **Interactive Learning**: Hands-on exploration of concepts

## 🛠️ Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/numerical-integration-calculator.git

# Navigate to project directory
cd numerical-integration-calculator

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Open browser to http://localhost:5173
```

### 🏗️ Build for Production

```bash
# Create production build
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## 🎯 Usage

### Basic Usage

1. **🔧 Configure Parameters**
   - Select a predefined function or enter custom function
   - Set integration limits (lower and upper bounds)
   - Choose number of intervals
   - Select integration methods to compare

2. **📊 Visualize Results**
   - View interactive function plots
   - Compare method approximations
   - Analyze convergence behavior

3. **📈 Analyze Performance**
   - Review error calculations
   - Compare computational efficiency
   - Export results for further analysis

### Advanced Features

#### Custom Functions
```javascript
// Examples of custom functions
x*x + 2*x + 1          // Polynomial
Math.sin(x) + Math.cos(x)   // Trigonometric
Math.exp(-x*x)         // Gaussian
x*Math.log(x)          // Logarithmic
```

#### Adding New Integration Methods

```javascript
class NewIntegrationMethod extends IntegrationMethod {
  constructor() {
    super('Method Name', 'Description', '#color');
  }

  integrate(func, a, b, n) {
    // Implementation here
    return result;
  }

  getErrorEstimate(func, a, b, n) {
    // Error estimation
    return estimate;
  }
}

// Add to registry
integrationMethods.push(new NewIntegrationMethod());
```

## 📁 Project Structure

```
numerical-integration-calculator/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── Calculator.jsx          # Main calculator interface
│   │   ├── Visualization.jsx       # Chart components
│   │   ├── Analysis.jsx           # Error and convergence analysis
│   │   └── Tutorial.jsx           # Educational content
│   ├── 📁 methods/
│   │   ├── IntegrationMethod.js    # Base class
│   │   ├── TrapezoidalRule.js     # Trapezoidal implementation
│   │   ├── SimpsonsRule.js        # Simpson's implementation
│   │   ├── MidpointRule.js        # Midpoint implementation
│   │   └── MonteCarloMethod.js    # Monte Carlo implementation
│   ├── 📁 utils/
│   │   ├── exportUtils.js         # Export functionality
│   │   ├── chartUtils.js          # Chart helper functions
│   │   └── mathUtils.js           # Mathematical utilities
│   └── App.jsx                    # Main application component
├── 📁 public/
├── 📄 package.json
├── 📄 vite.config.js
└── 📄 README.md
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
The project maintains high test coverage for:
- ✅ Integration method implementations
- ✅ Mathematical accuracy
- ✅ Error estimation algorithms
- ✅ Export functionality
- ✅ User interface components


## 🤝 Contributions

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports
- Use the [issue tracker](https://github.com/yourusername/numerical-integration-calculator/issues)
- Provide detailed reproduction steps
- Include browser and system information

### 💡 Feature Requests
- Check existing [issues](https://github.com/yourusername/numerical-integration-calculator/issues) first
- Describe the feature and its benefits
- Consider implementation complexity

### 🔧 Development
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 Code Style
- Follow **ESLint** configuration
- Use **Prettier** for formatting
- Write **JSDoc** comments for functions
- Include **tests** for new features

---

### 👥 Contributors

- **Minhazul Islam Rahat**
- **Avishek Das**
- **Niloy Barua**
- **Uday Barua**


### 🐛 Bug Reports
- Use the [issue tracker](https://github.com/yourusername/numerical-integration-calculator/issues)
- Provide detailed reproduction steps
- Include browser and system information

### 💡 Feature Requests
- Check existing [issues](https://github.com/yourusername/numerical-integration-calculator/issues) first
- Describe the feature and its benefits
- Consider implementation complexity

### 🔧 Development
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 Code Style
- Follow **ESLint** configuration
- Use **Prettier** for formatting
- Write **JSDoc** comments for functions
- Include **tests** for new features

## 📚 Mathematical Background

### Integration Methods Overview

| Method | Error Order | Best For | Notes |
|--------|-------------|----------|-------|
| 🔺 Trapezoidal | O(h²) | General functions | Simple, reliable |
| 🌊 Simpson's | O(h⁴) | Smooth functions | Excellent accuracy |
| 📏 Midpoint | O(h²) | Oscillating functions | Often better than trapezoidal |
| 🎲 Monte Carlo | O(1/√n) | High dimensions | Less sensitive to smoothness |

### Error Analysis
The application provides both **theoretical error estimates** based on mathematical bounds and **actual errors** when exact solutions are available.

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| 🌍 Chrome | 90+ | ✅ Fully Supported |
| 🦊 Firefox | 88+ | ✅ Fully Supported |
| 🧭 Safari | 14+ | ✅ Fully Supported |
| 📘 Edge | 90+ | ✅ Fully Supported |

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Numerical Integration Calculator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **Recharts** for beautiful chart components
- **Tailwind CSS** for rapid UI development
- **Lucide React** for elegant icons
- **Vite** for lightning-fast development
- **Mathematical community** for integration method research



