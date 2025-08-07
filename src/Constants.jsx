// Predefined functions for easy testing
export const predefinedFunctions = {
  'x^2': { 
    func: (x) => x * x, 
    display: 'x²',
    exact: (a, b) => (Math.pow(b, 3) - Math.pow(a, 3)) / 3,
    description: 'Simple quadratic function - good for testing'
  },
  'sin(x)': { 
    func: (x) => Math.sin(x), 
    display: 'sin(x)',
    exact: (a, b) => -Math.cos(b) + Math.cos(a),
    description: 'Trigonometric function with smooth oscillations'
  },
  'e^x': { 
    func: (x) => Math.exp(x), 
    display: 'eˣ',
    exact: (a, b) => Math.exp(b) - Math.exp(a),
    description: 'Exponential growth function'
  },
  '1/x': { 
    func: (x) => 1/x, 
    display: '1/x',
    exact: (a, b) => Math.log(b) - Math.log(a),
    description: 'Rational function - challenging near x=0'
  },
  'x^3': { 
    func: (x) => x * x * x, 
    display: 'x³',
    exact: (a, b) => (Math.pow(b, 4) - Math.pow(a, 4)) / 4,
    description: 'Cubic function - tests higher-order accuracy'
  }
  ,
  'x^4 - 2x^2 + 3': {
    func: (x) => Math.pow(x,4) - 2*Math.pow(x,2) + 3,
    display: 'x⁴ - 2x² + 3',
    exact: (a, b) => (Math.pow(b,5)-Math.pow(a,5))/5 - 2*(Math.pow(b,3)-Math.pow(a,3))/3 + 3*(b-a),
    description: 'Quartic polynomial - common in beam bending and statics'
  },
  'x*sin(x)': {
    func: (x) => x*Math.sin(x),
    display: 'x·sin(x)',
    exact: (a, b) => -b*Math.cos(b) + Math.sin(b) + a*Math.cos(a) - Math.sin(a),
    description: 'Product of linear and sine - vibration, AC circuits'
  },
  'x^2*e^x': {
    func: (x) => x*x*Math.exp(x),
    display: 'x²·eˣ',
    exact: (a, b) => {
      // ∫x²eˣ dx = eˣ(x² - 2x + 2) + C
      const F = x => Math.exp(x)*(x*x - 2*x + 2);
      return F(b) - F(a);
    },
    description: 'Quadratic times exponential - heat transfer, population models'
  },
  '1/(1+x^2)': {
    func: (x) => 1/(1+x*x),
    display: '1/(1+x²)',
    exact: (a, b) => Math.atan(b) - Math.atan(a),
    description: 'Lorentzian - resonance, probability'
  },
  'sqrt(1-x^2)': {
    func: (x) => Math.sqrt(1-x*x),
    display: '√(1-x²)',
    exact: (a, b) => 0.5*(b*Math.sqrt(1-b*b)+Math.asin(b)) - 0.5*(a*Math.sqrt(1-a*a)+Math.asin(a)),
    description: 'Semicircle - geometry, statics'
  },
  'ln(x)': {
    func: (x) => Math.log(x),
    display: 'ln(x)',
    exact: (a, b) => b*Math.log(b) - b - (a*Math.log(a) - a),
    description: 'Natural logarithm - thermodynamics, entropy'
  },
  'exp(-x)': {
    func: (x) => Math.exp(-x),
    display: 'e^{-x}',
    exact: (a, b) => -Math.exp(-b) + Math.exp(-a),
    description: 'Exponential decay - RC circuits, radioactive decay'
  }
};

// Tutorial content
export const tutorialContent = {
  introduction: {
    title: "Introduction to Numerical Integration",
    content: `Numerical integration is used when we cannot find the exact analytical solution to a definite integral.
These methods approximate the area under a curve using geometric shapes.

The general problem: Calculate ∫ᵇₐ f(x) dx

Why use numerical methods?
• Complex functions without analytical antiderivatives
• Real-world data points rather than mathematical functions
• Quick approximations for engineering calculations`
  },
  methods: {
    title: "Integration Methods Explained",
    content: `TRAPEZOIDAL RULE:
• Divides area into trapezoids
• Connects function points with straight lines
• Error: O(h²) where h = (b-a)/n
• Formula: h/2 * [f(a) + 2∑f(xᵢ) + f(b)]

SIMPSON'S RULE:
• Uses parabolic arcs instead of straight lines
• Much more accurate than trapezoidal
• Error: O(h⁴) - converges much faster
• Requires even number of intervals

MIDPOINT RULE:
• Uses rectangles with height at interval midpoint
• Often more accurate than trapezoidal for smooth functions
• Error: O(h²) but opposite sign to trapezoidal

MONTE CARLO:
• Uses random sampling
• Especially useful for multi-dimensional integrals
• Error decreases as 1/√n
• Less sensitive to function smoothness`
  },
  usage: {
    title: "How to Use This Calculator",
    content: `STEP 1: Choose Your Function
• Select from predefined functions or enter custom
• Custom functions use JavaScript syntax (e.g., Math.sin(x), x*x + 2*x)

STEP 2: Set Integration Limits
• Lower limit (a) and upper limit (b)
• Make sure the function is defined in this interval

STEP 3: Choose Methods
• Select one or more integration methods to compare
• More methods = better comparison but slower computation

STEP 4: Adjust Intervals
• More intervals = higher accuracy but more computation
• Watch the convergence analysis to see diminishing returns

STEP 5: Calculate and Analyze Results
• Click "Calculate Integration" to see results
• Compare numerical results with exact values (when available)
• Check error estimates and convergence behavior
• Export results for further analysis`
  },
  examples: {
    title: "Real-World Applications",
    content: `PHYSICS & ENGINEERING:
• Work done by variable force: W = ∫F(x)dx
• Center of mass calculations
• Electrical circuit analysis (RMS values)
• Heat transfer calculations

ECONOMICS & FINANCE:
• Consumer and producer surplus
• Present value of continuous cash flows
• Risk calculations in portfolio theory

BIOLOGY & MEDICINE:
• Drug concentration over time
• Population growth models
• Bioavailability calculations

EXAMPLE: Projectile Motion
If velocity v(t) = 50 - 9.8t, the distance traveled from t=0 to t=3 is:
∫₀³ (50 - 9.8t) dt = 50t - 4.9t²|₀³ = 150 - 44.1 = 105.9 meters`
  }
};