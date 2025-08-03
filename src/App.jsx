import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Area, AreaChart, ScatterChart, Scatter } from 'recharts';
import { Calculator, Settings, TrendingUp, Info, Download, Plus, BookOpen, Eye, Share2, HelpCircle, BarChart3, FileText } from 'lucide-react';

// Base class for integration algorithms
class IntegrationMethod {
  constructor(name, description, color) {
    this.name = name;
    this.description = description;
    this.color = color;
  }

  integrate(func, a, b, n) {
    throw new Error('integrate method must be implemented');
  }

  getVisualizationData(func, a, b, n) {
    return [];
  }

  getErrorEstimate(func, a, b, n) {
    return null;
  }
}

// Trapezoidal Rule Implementation
class TrapezoidalRule extends IntegrationMethod {
  constructor() {
    super('Trapezoidal Rule', 'Approximates area using trapezoids', '#3b82f6');
  }

  integrate(func, a, b, n) {
    const h = (b - a) / n;
    let sum = (func(a) + func(b)) / 2;
    
    for (let i = 1; i < n; i++) {
      sum += func(a + i * h);
    }
    
    return sum * h;
  }

  getErrorEstimate(func, a, b, n) {
    const h = (b - a) / n;
    const secondDerivApprox = this.estimateSecondDerivative(func, a, b);
    return Math.abs((Math.pow(b - a, 3) * secondDerivApprox) / (12 * n * n));
  }

  estimateSecondDerivative(func, a, b) {
    const h = (b - a) / 1000;
    let maxSecondDeriv = 0;
    
    for (let x = a + h; x < b - h; x += h) {
      const secondDeriv = Math.abs((func(x + h) - 2 * func(x) + func(x - h)) / (h * h));
      maxSecondDeriv = Math.max(maxSecondDeriv, secondDeriv);
    }
    
    return maxSecondDeriv;
  }
}

// Simpson's Rule Implementation
class SimpsonsRule extends IntegrationMethod {
  constructor() {
    super("Simpson's Rule", 'Uses quadratic polynomials for better accuracy', '#ef4444');
  }

  integrate(func, a, b, n) {
    if (n % 2 !== 0) n++;
    
    const h = (b - a) / n;
    let sum = func(a) + func(b);
    
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * func(x);
    }
    
    return (sum * h) / 3;
  }

  getErrorEstimate(func, a, b, n) {
    const h = (b - a) / n;
    const fourthDerivApprox = this.estimateFourthDerivative(func, a, b);
    return Math.abs((Math.pow(b - a, 5) * fourthDerivApprox) / (180 * Math.pow(n, 4)));
  }

  estimateFourthDerivative(func, a, b) {
    const h = (b - a) / 1000;
    let maxFourthDeriv = 0;
    
    for (let x = a + 2*h; x < b - 2*h; x += h) {
      const fourthDeriv = Math.abs((func(x + 2*h) - 4*func(x + h) + 6*func(x) - 4*func(x - h) + func(x - 2*h)) / Math.pow(h, 4));
      maxFourthDeriv = Math.max(maxFourthDeriv, fourthDeriv);
    }
    
    return maxFourthDeriv;
  }
}

// Midpoint Rule Implementation
class MidpointRule extends IntegrationMethod {
  constructor() {
    super('Midpoint Rule', 'Uses rectangle with height at midpoint', '#10b981');
  }

  integrate(func, a, b, n) {
    const h = (b - a) / n;
    let sum = 0;
    
    for (let i = 0; i < n; i++) {
      const midpoint = a + (i + 0.5) * h;
      sum += func(midpoint);
    }
    
    return sum * h;
  }

  getErrorEstimate(func, a, b, n) {
    const h = (b - a) / n;
    const secondDerivApprox = this.estimateSecondDerivative(func, a, b);
    return Math.abs((Math.pow(b - a, 3) * secondDerivApprox) / (24 * n * n));
  }

  estimateSecondDerivative(func, a, b) {
    const h = (b - a) / 1000;
    let maxSecondDeriv = 0;
    
    for (let x = a + h; x < b - h; x += h) {
      const secondDeriv = Math.abs((func(x + h) - 2 * func(x) + func(x - h)) / (h * h));
      maxSecondDeriv = Math.max(maxSecondDeriv, secondDeriv);
    }
    
    return maxSecondDeriv;
  }
}

// Monte Carlo Integration Implementation
class MonteCarloIntegration extends IntegrationMethod {
  constructor() {
    super('Monte Carlo', 'Uses random sampling for integration', '#f59e0b');
  }

  integrate(func, a, b, n) {
    let sum = 0;
    const samples = [];
    
    for (let i = 0; i < n; i++) {
      const x = a + Math.random() * (b - a);
      const y = func(x);
      sum += y;
      samples.push({ x, y });
    }
    
    this.lastSamples = samples;
    return (sum / n) * (b - a);
  }

  getVisualizationData(func, a, b, n) {
    return this.lastSamples || [];
  }

  getErrorEstimate(func, a, b, n) {
    if (!this.lastSamples) return null;
    
    const mean = this.lastSamples.reduce((sum, sample) => sum + sample.y, 0) / n;
    const variance = this.lastSamples.reduce((sum, sample) => sum + Math.pow(sample.y - mean, 2), 0) / (n - 1);
    const standardError = Math.sqrt(variance / n) * (b - a);
    
    return 1.96 * standardError;
  }
}

// Registry for all available methods
const integrationMethods = [
  new TrapezoidalRule(),
  new SimpsonsRule(),
  new MidpointRule(),
  new MonteCarloIntegration()
];

// Predefined functions for easy testing
const predefinedFunctions = {
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
};

// Tutorial content
const tutorialContent = {
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

STEP 5: Analyze Results
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

export default function NumericalIntegrationCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [selectedFunction, setSelectedFunction] = useState('x^2');
  const [customFunction, setCustomFunction] = useState('');
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(2);
  const [intervals, setIntervals] = useState(10);
  const [selectedMethods, setSelectedMethods] = useState(['Trapezoidal Rule']);
  const [convergenceData, setConvergenceData] = useState([]);
  const [visualizationMode, setVisualizationMode] = useState('function');
  const [tutorialSection, setTutorialSection] = useState('introduction');

  // Add these state variables at the beginning of your component
  const [rawFunction, setRawFunction] = useState('');
  const [processedFunction, setProcessedFunction] = useState(null);
  const [functionError, setFunctionError] = useState('');

  // Get current function
  const currentFunc = useMemo(() => {
    if (customFunction) {
      try {
        return new Function('x', `return ${customFunction}`);
      } catch (e) {
        return predefinedFunctions[selectedFunction].func;
      }
    }
    return predefinedFunctions[selectedFunction].func;
  }, [selectedFunction, customFunction]);

  // Calculate results for all selected methods
  const results = useMemo(() => {
    return integrationMethods
      .filter(method => selectedMethods.includes(method.name))
      .map(method => {
        const value = method.integrate(currentFunc, lowerLimit, upperLimit, intervals);
        const exactValue = predefinedFunctions[selectedFunction] && !customFunction ? 
          predefinedFunctions[selectedFunction].exact(lowerLimit, upperLimit) : null;
        
        return {
          method: method.name,
          value: value,
          color: method.color,
          error: exactValue ? Math.abs(value - exactValue) : null,
          errorEstimate: method.getErrorEstimate(currentFunc, lowerLimit, upperLimit, intervals),
          relativeError: exactValue ? Math.abs((value - exactValue) / exactValue) * 100 : null
        };
      });
  }, [currentFunc, lowerLimit, upperLimit, intervals, selectedMethods, selectedFunction, customFunction]);

  // Generate function plot data
  const plotData = useMemo(() => {
    const data = [];
    const step = (upperLimit - lowerLimit) / 200;
    
    for (let x = lowerLimit; x <= upperLimit; x += step) {
      try {
        const y = currentFunc(x);
        if (isFinite(y)) {
          data.push({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) });
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    
    return data;
  }, [currentFunc, lowerLimit, upperLimit]);

  // Generate method-specific visualization data
  const methodVisualizationData = useMemo(() => {
    if (selectedMethods.length === 0) return [];
    
    const method = integrationMethods.find(m => m.name === selectedMethods[0]);
    if (!method) return [];
    
    return method.getVisualizationData(currentFunc, lowerLimit, upperLimit, Math.min(intervals, 20));
  }, [currentFunc, lowerLimit, upperLimit, intervals, selectedMethods]);

  // Generate convergence analysis
  useEffect(() => {
    const data = [];
    for (let n = 2; n <= 50; n += 2) {
      const point = { intervals: n };
      
      selectedMethods.forEach(methodName => {
        const method = integrationMethods.find(m => m.name === methodName);
        if (method) {
          point[methodName] = method.integrate(currentFunc, lowerLimit, upperLimit, n);
        }
      });
      
      data.push(point);
    }
    
    setConvergenceData(data);
  }, [currentFunc, lowerLimit, upperLimit, selectedMethods]);

  const toggleMethod = (methodName) => {
    setSelectedMethods(prev => 
      prev.includes(methodName) 
        ? prev.filter(m => m !== methodName)
        : [...prev, methodName]
    );
  };

  const exactValue = predefinedFunctions[selectedFunction] && !customFunction ? 
    predefinedFunctions[selectedFunction].exact(lowerLimit, upperLimit) : null;

  const exportResults = () => {
    const exportData = {
      function: customFunction || predefinedFunctions[selectedFunction].display,
      limits: { lower: lowerLimit, upper: upperLimit },
      intervals: intervals,
      methods: selectedMethods,
      results: results,
      exactValue: exactValue,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download functions
  const downloadChartAsImage = async (chartId, filename, format = 'png') => {
    try {
      const chartContainer = document.querySelector(`#${chartId}`);
      if (!chartContainer) {
        console.error('Chart container not found');
        return;
      }

      // Find the SVG element
      const svgElement = chartContainer.querySelector('svg');
      if (!svgElement) {
        console.error('SVG element not found');
        return;
      }

      // Get the bounding box of the entire chart container
      const containerRect = chartContainer.getBoundingClientRect();
      const svgRect = svgElement.getBoundingClientRect();
      
      // Use container dimensions if available, otherwise SVG dimensions
      const width = Math.max(containerRect.width, svgRect.width, 800);
      const height = Math.max(containerRect.height, svgRect.height, 400);

      // Clone the SVG element
      const svgClone = svgElement.cloneNode(true);
      
      // Ensure the SVG has proper attributes
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      svgClone.setAttribute('width', width);
      svgClone.setAttribute('height', height);
      
      // Set viewBox to ensure proper scaling
      const viewBox = svgClone.getAttribute('viewBox') || `0 0 ${width} ${height}`;
      svgClone.setAttribute('viewBox', viewBox);

      // Add white background
      const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      backgroundRect.setAttribute('x', '0');
      backgroundRect.setAttribute('y', '0');
      backgroundRect.setAttribute('width', '100%');
      backgroundRect.setAttribute('height', '100%');
      backgroundRect.setAttribute('fill', 'white');
      svgClone.insertBefore(backgroundRect, svgClone.firstChild);

      // Convert SVG to string
      const svgString = new XMLSerializer().serializeToString(svgClone);
      
      // Create a data URL
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

      // Create canvas with higher resolution
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const pixelRatio = 2; // Higher resolution for better quality
      
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      // Scale the context
      ctx.scale(pixelRatio, pixelRatio);
      
      // Create image
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Clear canvas with white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            
            // Draw the SVG image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}-${Date.now()}.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                resolve();
              } else {
                reject(new Error('Failed to create blob'));
              }
            }, `image/${format}`, 0.95);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        // Set crossOrigin before setting src
        img.crossOrigin = 'anonymous';
        img.src = svgDataUrl;
      });
      
    } catch (error) {
      console.error('Error downloading chart:', error);
    }
  };

  // Alternative download method for better compatibility
  const downloadChartAsImageAlt = async (chartId, filename, format = 'png') => {
    try {
      const chartContainer = document.querySelector(`#${chartId}`);
      if (!chartContainer) {
        console.error('Chart container not found');
        return;
      }

      // Create a larger canvas to ensure we capture everything
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Get container dimensions
      const rect = chartContainer.getBoundingClientRect();
      const width = Math.max(rect.width, 800);
      const height = Math.max(rect.height, 400);
      
      // Set canvas size with high DPI
      const pixelRatio = window.devicePixelRatio || 2;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      ctx.scale(pixelRatio, pixelRatio);
      
      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      
      // Find all SVG elements in the container
      const svgElements = chartContainer.querySelectorAll('svg');
      
      for (let svgElement of svgElements) {
        try {
          // Clone SVG to avoid modifying original
          const svgClone = svgElement.cloneNode(true);
          
          // Set proper namespace and dimensions
          svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          svgClone.setAttribute('width', width);
          svgClone.setAttribute('height', height);
          
          // Get computed styles and apply them inline
          const computedStyle = window.getComputedStyle(svgElement);
          for (let property of computedStyle) {
            svgClone.style[property] = computedStyle[property];
          }
          
          // Convert SVG to data URL
          const svgData = new XMLSerializer().serializeToString(svgClone);
          const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
          
          // Create image and draw to canvas
          const img = new Image();
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, width, height);
              resolve();
            };
            img.onerror = reject;
            img.src = svgDataUrl;
          });
          
        } catch (error) {
          console.warn('Error processing SVG element:', error);
        }
      }
      
      // Download the canvas
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}-${Date.now()}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, `image/${format}`, 0.95);
      
    } catch (error) {
      console.error('Error in alternative download method:', error);
    }
  };

  // Main download functions with fallback
  const downloadChartAsPNG = async (chartId, filename) => {
    try {
      await downloadChartAsImage(chartId, filename, 'png');
    } catch (error) {
      console.warn('Primary method failed, trying alternative:', error);
      await downloadChartAsImageAlt(chartId, filename, 'png');
    }
  };

  const downloadChartAsJPG = async (chartId, filename) => {
    try {
      await downloadChartAsImage(chartId, filename, 'jpeg');
    } catch (error) {
      console.warn('Primary method failed, trying alternative:', error);
      await downloadChartAsImageAlt(chartId, filename, 'jpeg');
    }
  };

  const downloadResultsAsTXT = (data, filename) => {
    let content = `Numerical Integration Results\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Function: ${customFunction || predefinedFunctions[selectedFunction].display}\n`;
    content += `Integration Range: [${lowerLimit}, ${upperLimit}]\n`;
    content += `Number of Intervals: ${intervals}\n`;
    content += `Selected Methods: ${selectedMethods.join(', ')}\n\n`;
    
    if (exactValue) {
      content += `Exact Value: ${exactValue.toFixed(10)}\n\n`;
    }
    
    content += `RESULTS:\n`;
    content += `${'Method'.padEnd(20)} ${'Value'.padEnd(15)} ${'Abs Error'.padEnd(15)} ${'Rel Error (%)'.padEnd(15)} ${'Error Estimate'.padEnd(15)}\n`;
    content += `${'-'.repeat(80)}\n`;
    
    results.forEach(result => {
      content += `${result.method.padEnd(20)} `;
      content += `${result.value.toFixed(6).padEnd(15)} `;
      content += `${(result.error ? result.error.toFixed(6) : 'N/A').padEnd(15)} `;
      content += `${(result.relativeError ? result.relativeError.toFixed(4) : 'N/A').padEnd(15)} `;
      content += `${(result.errorEstimate ? `±${result.errorEstimate.toFixed(6)}` : 'N/A').padEnd(15)}\n`;
    });
    
    if (typeof data === 'string') {
      content += `\n${data}`;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `Numerical Integration Results:
Function: ${customFunction || predefinedFunctions[selectedFunction].display}
Limits: [${lowerLimit}, ${upperLimit}]
${results.map(r => `${r.method}: ${r.value.toFixed(6)}`).join('\n')}
${exactValue ? `Exact: ${exactValue.toFixed(6)}` : ''}`;
    
    if (navigator.share) {
      navigator.share({ title: 'Integration Results', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  const downloadConvergenceData = () => {
    let content = `Convergence Analysis Data\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Function: ${customFunction || predefinedFunctions[selectedFunction].display}\n`;
    content += `Integration Range: [${lowerLimit}, ${upperLimit}]\n\n`;
    
    content += `${'Intervals'.padEnd(12)} `;
    selectedMethods.forEach(method => {
      content += `${method.padEnd(15)} `;
    });
    if (exactValue) content += `${'Exact Value'.padEnd(15)}`;
    content += `\n`;
    
    content += `${'-'.repeat(12 + selectedMethods.length * 15 + (exactValue ? 15 : 0))}\n`;
    
    convergenceData.forEach(point => {
      content += `${point.intervals.toString().padEnd(12)} `;
      selectedMethods.forEach(method => {
        const value = point[method] ? point[method].toFixed(6) : 'N/A';
        content += `${value.padEnd(15)} `;
      });
      if (exactValue) content += `${exactValue.toFixed(6).padEnd(15)}`;
      content += `\n`;
    });
    
    downloadResultsAsTXT(content, 'convergence-analysis');
  };

  const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
          : 'bg-white/70 text-gray-600 hover:bg-white/90 hover:text-gray-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderCalculatorTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Control Panel */}
      <div className="lg:col-span-1">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Parameters</h2>
          </div>

          {/* Function Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Function</label>
            <select 
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
            >
              {Object.entries(predefinedFunctions).map(([key, func]) => (
                <option key={key} value={key}>{func.display}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">{predefinedFunctions[selectedFunction].description}</p>
          </div>

          {/* Custom Function */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Function (optional)</label>
            <div className="relative">
              <input
                type="text"
                value={rawFunction}
                onChange={(e) => setRawFunction(e.target.value)}
                placeholder="e.g., e^(-x^2) or ln(x^2 + 1)"
                className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
              />
              <button
                onClick={processFunction}
                className="absolute right-2 top-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
              >
                Calculate
              </button>
            </div>
            {functionError && (
              <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                {functionError}
              </div>
            )}
            {processedFunction && !functionError && (
              <div className="mt-2 text-green-600 text-sm bg-green-50 p-2 rounded-lg">
                Function validated: {processedFunction}
              </div>
            )}
          </div>

          {/* Integration Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lower Limit (a)</label>
              <input
                type="number"
                value={lowerLimit}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value < upperLimit) {
                    setLowerLimit(value);
                  }
                }}
                className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upper Limit (b)</label>
              <input
                type="number"
                value={upperLimit}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > lowerLimit) {
                    setUpperLimit(value);
                  }
                }}
                className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
              />
            </div>
          </div>
          {/* Show validation error */}
          {lowerLimit >= upperLimit && (
            <div className="col-span-2 mt-2 text-red-600 text-sm font-semibold">
              Lower limit must be less than upper limit.
            </div>
          )}

          {/* Number of Intervals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Intervals: {intervals}
            </label>
            <input
              type="range"
              min="2"
              max="100"
              value={intervals}
              onChange={(e) => setIntervals(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Integration Methods</label>
            <div className="space-y-2">
              {integrationMethods.map(method => (
                <label key={method.name} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMethods.includes(method.name)}
                    onChange={() => toggleMethod(method.name)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium" style={{ color: method.color }}>
                      {method.name}
                    </div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Results</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => downloadResultsAsTXT('', 'integration-results')}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                title="Download Results as TXT"
              >
                <Download className="w-4 h-4" />
                <span className="text-xs">TXT</span>
              </button>
              <button 
                onClick={shareResults} 
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Share Results"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={exportResults} 
                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
                title="Export as JSON"
              >
                <Download className="w-4 h-4" />
                <span className="text-xs">JSON</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {exactValue && (
              <div className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm p-4 rounded-lg border border-green-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                <div className="text-sm text-green-700 font-medium">Exact Value (Analytical)</div>
                <div className="text-2xl font-bold text-green-800">{exactValue.toFixed(6)}</div>
                <div className="text-xs text-green-600 mt-1">Used for error calculation</div>
              </div>
            )}
            
            {results.map((result, index) => (
              <div key={result.method} className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm p-4 rounded-lg border border-white/40 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105">
                <div className="text-sm font-medium" style={{ color: result.color }}>{result.method}</div>
                <div className="text-2xl font-bold" style={{ color: result.color }}>
                  {result.value.toFixed(6)}
                </div>
                {result.error && (
                  <div className="text-sm mt-1 space-y-1">
                    <div className="text-red-500 bg-red-50/80 backdrop-blur-sm px-2 py-1 rounded border border-red-200/50">
                      Actual Error: {result.error.toFixed(6)}
                    </div>
                    <div className="text-orange-600 bg-orange-50/80 backdrop-blur-sm px-2 py-1 rounded border border-orange-200/50">
                      Relative Error: {result.relativeError.toFixed(4)}%
                    </div>
                  </div>
                )}
                {result.errorEstimate && (
                  <div className="text-sm text-purple-600 bg-purple-50/80 backdrop-blur-sm px-2 py-1 rounded mt-1 border border-purple-200/50">
                    Error Estimate: ±{result.errorEstimate.toFixed(6)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Summary */}
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/50">
            <h4 className="font-semibold text-blue-800 mb-2">Quick Summary</h4>
            <div className="text-sm text-blue-700">
              <p>Function: {customFunction || predefinedFunctions[selectedFunction].display}</p>
              <p>Integration Range: [{lowerLimit}, {upperLimit}]</p>
              <p>Intervals: {intervals}</p>
              <p>Selected Methods: {selectedMethods.join(', ')}</p>
              {exactValue && <p>Exact Value: {exactValue.toFixed(6)}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVisualizationTab = () => (
    <div className="space-y-6">
      {/* Visualization Controls */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Graphical Visualization</h3>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {/* <button
                onClick={() => setVisualizationMode('function')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  visualizationMode === 'function' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`
              >
                Function Plot
              </button> */}
              {/* <button
                onClick={() => setVisualizationMode('method')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  visualizationMode === 'method' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Method Approximation
              </button> */}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => downloadChartAsPNG('main-visualization', `${visualizationMode}-plot`)}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                title="Download Chart as PNG"
              >
                <Download className="w-3 h-3" />
                <span className="text-xs">PNG</span>
              </button>
              {/* <button
                onClick={() => downloadChartAsJPG('main-visualization', `${visualizationMode}-plot`)}
                className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1"
                title="Download Chart as JPG"
              >
                <Download className="w-3 h-3" />
                <span className="text-xs">JPG</span>
              </button> */}
            </div>
          </div>
        </div>

        <div id="main-visualization">

        <ResponsiveContainer width="100%" height={400}>
          {visualizationMode === 'function' ? (
            <AreaChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value.toFixed(4), 'f(x)']}
                labelFormatter={(x) => `x = ${x}`}
                contentStyle={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="y" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          ) : (
            selectedMethods.includes('Monte Carlo') ? (
              <ScatterChart data={methodVisualizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="x" />
                <YAxis dataKey="y" />
                <Tooltip 
                  formatter={(value, name) => [value.toFixed(4), 'Sample Point']}
                  labelFormatter={(x) => `x = ${x}`}
                />
                <Scatter dataKey="y" fill="#f59e0b" />
              </ScatterChart>
            ) : (
              <AreaChart data={plotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="y" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            )
          )}
        </ResponsiveContainer>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
          <h4 className="font-semibold text-gray-800 mb-2">Visualization Guide</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Function Plot:</strong> Shows the original function f(x) and the area being integrated (shaded region).
            </div>
            <div>
              <strong>Method Approximation:</strong> Shows how each numerical method approximates the integral.
            </div>
          </div>
        </div>
      </div>

      {/* Method Comparison Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Results Comparison
            </h4>
            <div className="flex gap-1">
              <button
                onClick={() => downloadChartAsPNG('results-comparison', 'results-comparison')}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                title="Download Chart as PNG"
              >
                <Download className="w-3 h-3" />
                <span className="text-xs">PNG</span>
              </button>
              {/* <button
                onClick={() => downloadChartAsJPG('results-comparison', 'results-comparison')}
                className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1"
                title="Download Chart as JPG"
              >
                <Download className="w-3 h-3" />
                <span className="text-xs">JPG</span>
              </button> */}
              <button
                onClick={() => downloadResultsAsTXT('', 'results-comparison')}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                title="Download Data as TXT"
              >
                <Download className="w-3 h-3" />
                <span className="text-xs">TXT</span>
              </button>
            </div>
          </div>
          <div id="results-comparison">
            <ResponsiveContainer width="100%" height={250}>
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
          <h4 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Method Information
          </h4>
          <div className="space-y-3">
            {integrationMethods.filter(method => selectedMethods.includes(method.name)).map(method => (
              <div key={method.name} className="p-3 bg-gray-50/80 rounded-lg border border-gray-200/50">
                <div className="font-medium" style={{ color: method.color }}>{method.name}</div>
                <div className="text-sm text-gray-600 mt-1">{method.description}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {method.name === 'Trapezoidal Rule' && 'Error: O(h²) - Good for smooth functions'}
                  {method.name === "Simpson's Rule" && 'Error: O(h⁴) - Excellent accuracy for polynomials'}
                  {method.name === 'Midpoint Rule' && 'Error: O(h²) - Often better than trapezoidal'}
                  {method.name === 'Monte Carlo' && 'Error: O(1/√n) - Great for high dimensions'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      {/* Convergence Analysis */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Convergence Analysis</h3>
          </div>
          <div className="flex gap-1">
            {/* <button
              onClick={() => downloadChartAsPNG('convergence-analysis', 'convergence-analysis')}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
              title="Download Chart as PNG"
            >
              <Download className="w-3 h-3" />
              <span className="text-xs">PNG</span>
            </button>
            <button
              onClick={() => downloadChartAsJPG('convergence-analysis', 'convergence-analysis')}
              className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1"
              title="Download Chart as JPG"
            >
              <Download className="w-3 h-3" />
              <span className="text-xs">JPG</span>
            </button> */}
            <button
              onClick={downloadConvergenceData}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
              title="Download Data as TXT"
            >
              <Download className="w-3 h-3" />
              <span className="text-xs">TXT</span>
            </button>
          </div>
        </div>
        
        <div id="convergence-analysis">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={convergenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="intervals" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Legend />
            {selectedMethods.map((methodName, index) => {
              const method = integrationMethods.find(m => m.name === methodName);
              return (
                <Line 
                  key={methodName}
                  type="monotone" 
                  dataKey={methodName} 
                  stroke={method.color}
                  strokeWidth={3}
                  dot={{ fill: method.color, r: 4 }}
                />
              );
            })}
            {exactValue && (
              <Line 
                type="monotone" 
                dataKey={() => exactValue} 
                stroke="#000000" 
                strokeWidth={2}
                strokeDasharray="8 4"
                name="Exact Value"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
          <h4 className="font-semibold text-gray-800 mb-2">Convergence Insights</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>• <strong>Faster convergence</strong> means the method reaches accurate results with fewer intervals</p>
            <p>• <strong>Simpson's Rule</strong> typically converges much faster than Trapezoidal or Midpoint</p>
            <p>• <strong>Monte Carlo</strong> convergence depends on function smoothness and random seed</p>
            <p>• Look for <strong>diminishing returns</strong> - when adding more intervals doesn't improve accuracy significantly</p>
          </div>
        </div>
      </div>

      {/* Error Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Error Analysis
            </h4>
            <button
              onClick={() => {
                const errorData = results.map(r => `${r.method}: Abs Error = ${r.error ? r.error.toFixed(6) : 'N/A'}, Rel Error = ${r.relativeError ? r.relativeError.toFixed(4) + '%' : 'N/A'}`).join('\n');
                downloadResultsAsTXT(errorData, 'error-analysis');
              }}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
              title="Download Error Analysis as TXT"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">TXT</span>
            </button>
          </div>
          
          {exactValue ? (
            <div className="space-y-4">
              {results.map(result => (
                <div key={result.method} className="p-4 bg-gray-50/80 rounded-lg border border-gray-200/50">
                  <div className="font-medium" style={{ color: result.color }}>{result.method}</div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Computed Value:</span>
                      <span className="font-mono">{result.value.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exact Value:</span>
                      <span className="font-mono">{exactValue.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Absolute Error:</span>
                      <span className="font-mono">{result.error.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Relative Error:</span>
                      <span className="font-mono">{result.relativeError.toFixed(4)}%</span>
                    </div>
                    {result.errorEstimate && (
                      <div className="flex justify-between text-purple-600">
                        <span>Error Estimate:</span>
                        <span className="font-mono">±{result.errorEstimate.toFixed(6)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50/80 rounded-lg border border-yellow-200/50">
              <p className="text-yellow-800 text-sm">
                <strong>No exact solution available</strong> for this function or custom input.
                Error estimates are provided where possible based on theoretical bounds.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Performance Metrics
            </h4>
            <button
              onClick={() => {
                const performanceData = `Performance Metrics\nIntervals: ${intervals}\nFunction Evaluations:\n${selectedMethods.map(method => 
                  `${method}: ${method === 'Trapezoidal Rule' ? intervals + 1 : 
                               method === "Simpson's Rule" ? (intervals % 2 === 0 ? intervals + 1 : intervals + 2) :
                               method === 'Midpoint Rule' ? intervals : intervals}`
                ).join('\n')}`;
                downloadResultsAsTXT(performanceData, 'performance-metrics');
              }}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
              title="Download Performance Metrics as TXT"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">TXT</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/80 rounded-lg border border-blue-200/50">
              <div className="font-medium text-blue-800 mb-2">Computational Efficiency</div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Intervals used:</strong> {intervals}</p>
                <p>• <strong>Function evaluations:</strong></p>
                <ul className="ml-4 space-y-1">
                  {selectedMethods.includes('Trapezoidal Rule') && <li>Trapezoidal: {intervals + 1}</li>}
                  {selectedMethods.includes("Simpson's Rule") && <li>Simpson's: {intervals % 2 === 0 ? intervals + 1 : intervals + 2}</li>}
                  {selectedMethods.includes('Midpoint Rule') && <li>Midpoint: {intervals}</li>}
                  {selectedMethods.includes('Monte Carlo') && <li>Monte Carlo: {intervals}</li>}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-green-50/80 rounded-lg border border-green-200/50">
              <div className="font-medium text-green-800 mb-2">Accuracy Rating</div>
              <div className="text-sm text-green-700 space-y-2">
                {results.map(result => (
                  <div key={result.method} className="flex justify-between items-center">
                    <span>{result.method}:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => {
                        const accuracy = result.relativeError ? 
                          (result.relativeError < 0.001 ? 5 : 
                           result.relativeError < 0.01 ? 4 :
                           result.relativeError < 0.1 ? 3 :
                           result.relativeError < 1 ? 2 : 1) : 3;
                        return (
                          <span 
                            key={i} 
                            className={`w-3 h-3 rounded-full ml-1 ${
                              i < accuracy ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTutorialTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-4">
          <h3 className="font-semibold mb-4 text-gray-800">Tutorial Sections</h3>
          <div className="space-y-2">
            {Object.entries(tutorialContent).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setTutorialSection(key)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  tutorialSection === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-3">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {tutorialContent[tutorialSection].title}
          </h2>
          <div className="prose prose-lg max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {tutorialContent[tutorialSection].content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  // Replace the existing custom function input section with this:
  // Replace the existing custom function input section with this:
  const processFunction = () => {
    try {
      if (!rawFunction) {
        setProcessedFunction(null);
        setFunctionError('');
        setCustomFunction('');
        return;
      }

      // First, standardize the input
      let processed = rawFunction
        .toLowerCase()
        // Remove all spaces first
        .replace(/\s+/g, '')
        // Constants
        .replace(/\be\b/g, 'Math.E')
        .replace(/\bpi\b/g, 'Math.PI')
        // Handle exponentials first (before logarithms to avoid conflicts)
        .replace(/e\s*\^/g, 'Math.exp')
        .replace(/\^/g, '**');
      
      // Handle logarithms with a more careful approach
      // First replace 'ln' with a temporary placeholder to avoid conflicts
      processed = processed.replace(/\bln\b/g, 'NATURAL_LOG');
      // Then replace 'log' with base-10 log
      processed = processed.replace(/\blog\b/g, 'Math.log10');
      // Finally replace the placeholder with natural log
      processed = processed.replace(/NATURAL_LOG/g, 'Math.log');
      
      // Continue with other functions
      processed = processed
        // Trigonometric functions
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\bcsc\b/g, '(1/Math.sin)')
        .replace(/\bsec\b/g, '(1/Math.cos)')
        .replace(/\bcot\b/g, '(1/Math.tan)')
        // Inverse trigonometric functions
        .replace(/\basin\b/g, 'Math.asin')
        .replace(/\barcsin\b/g, 'Math.asin')
        .replace(/\bacos\b/g, 'Math.acos')
        .replace(/\barccos\b/g, 'Math.acos')
        .replace(/\batan\b/g, 'Math.atan')
        .replace(/\barctan\b/g, 'Math.atan')
        // Hyperbolic functions
        .replace(/\bsinh\b/g, 'Math.sinh')
        .replace(/\bcosh\b/g, 'Math.cosh')
        .replace(/\btanh\b/g, 'Math.tanh')
        // Square root and absolute value
        .replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\babs\b/g, 'Math.abs')
        // Add multiplication operator between number and variable
        .replace(/(\d)([x])/g, '$1*$2')
        .replace(/([x])(\d)/g, '$1*$2')
        // Handle multiplication between closing parenthesis and variable/opening parenthesis
        .replace(/\)([x])/g, ')*$1')
        .replace(/\)(\()/g, ')*$1')
        .replace(/([x])\(/g, '$1*(');

      // Test the processed function
      const testFunc = new Function('x', `
        try {
          return ${processed};
        } catch (error) {
          throw new Error('Invalid function evaluation: ' + error.message);
        }
      `);

      // Test with a range of values, being more careful with domain issues
      const testPoints = [0.1, 1, 2, 3, 5];  // Use safer test points
      let hasValidPoints = false;
      
      for (let x of testPoints) {
        try {
          const testVal = testFunc(x);
          if (typeof testVal === 'number' && isFinite(testVal) && !isNaN(testVal)) {
            hasValidPoints = true;
          }
        } catch (e) {
          // Continue testing other points
        }
      }
      
      if (!hasValidPoints) {
        throw new Error(`Function does not produce valid numeric results. Processed: ${processed}`);
      }

      setProcessedFunction(processed);
      setFunctionError('');
      setCustomFunction(processed);
    } catch (e) {
      setFunctionError(e.message || 'Invalid function syntax');
      setProcessedFunction(null);
      setCustomFunction('');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-ping"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-purple-50/90 backdrop-blur-sm"></div>
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="math-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10,50 Q30,20 50,50 Q70,80 90,50" stroke="#4f46e5" strokeWidth="1" fill="none"/>
                <path d="M20,80 Q40,50 60,80 Q80,110 100,80" stroke="#7c3aed" strokeWidth="1" fill="none"/>
                <circle cx="25" cy="25" r="2" fill="#06b6d4"/>
                <circle cx="75" cy="75" r="2" fill="#8b5cf6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#math-pattern)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Numerical Integration Calculator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Visualize and compare different numerical integration methods</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <TabButton 
            id="calculator" 
            icon={Calculator} 
            label="Calculator" 
            active={activeTab === 'calculator'} 
            onClick={() => setActiveTab('calculator')} 
          />
          <TabButton 
            id="visualization" 
            icon={Eye} 
            label="Visualization" 
            active={activeTab === 'visualization'} 
            onClick={() => setActiveTab('visualization')} 
          />
          <TabButton 
            id="analysis" 
            icon={BarChart3} 
            label="Analysis" 
            active={activeTab === 'analysis'} 
            onClick={() => setActiveTab('analysis')} 
          />
          <TabButton 
            id="tutorial" 
            icon={BookOpen} 
            label="Tutorial" 
            active={activeTab === 'tutorial'} 
            onClick={() => setActiveTab('tutorial')} 
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'calculator' && renderCalculatorTab()}
        {activeTab === 'visualization' && renderVisualizationTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'tutorial' && renderTutorialTab()}
      </div>
    </div>
  );
}