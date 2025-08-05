
// IntegrationMethods.js - Integration algorithms
import React from 'react';

// Base class for integration algorithms
export class IntegrationMethod {
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
export class TrapezoidalRule extends IntegrationMethod {
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
      try {
        const secondDeriv = Math.abs((func(x + h) - 2 * func(x) + func(x - h)) / (h * h));
        if (isFinite(secondDeriv)) {
          maxSecondDeriv = Math.max(maxSecondDeriv, secondDeriv);
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    
    return maxSecondDeriv;
  }
}

// Simpson's Rule Implementation
export class SimpsonsRule1By3 extends IntegrationMethod {
  constructor() {
    super("Simpson's 1/3", 'Uses quadratic polynomials for better accuracy', '#ef4444');
  }

  integrate(func, a, b, n) {
    if (n % 2 === 0) {
      // Even number of intervals - use regular Simpson's 1/3 rule
      return this.simpsonRule(func, a, b, n);
    } else {
      // Odd number of intervals - use hybrid approach
      const h = (b - a) / n;
      const splitPoint = b - h; // Last point before final interval
      // Apply Simpson's rule for first n-1 intervals
      const simpsonPart = this.simpsonRule(func, a, splitPoint, n-1);
      // Apply trapezoidal rule for the last interval
      const trapPart = (h/2) * (func(splitPoint) + func(b));
      return simpsonPart + trapPart;
    }
  }

  // Helper method for pure Simpson's 1/3 rule calculation
  simpsonRule(func, a, b, n) {
    const h = (b - a) / n;
    let sum = func(a) + func(b);
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * func(x);
    }
    return (sum * h) / 3;
  }

  getErrorEstimate(func, a, b, n) {
    if (n % 2 === 0) {
      // Regular Simpson's error for even intervals
      const h = (b - a) / n;
      const fourthDerivApprox = this.estimateFourthDerivative(func, a, b);
      return Math.abs((Math.pow(b - a, 5) * fourthDerivApprox) / (180 * Math.pow(n, 4)));
    } else {
      // Hybrid error estimate for odd intervals
      const h = (b - a) / n;
      const splitPoint = b - h;
      // Error for Simpson's part (n-1 intervals)
      const simpsonError = this.estimateFourthDerivative(func, a, splitPoint) *
        Math.pow(splitPoint - a, 5) / (180 * Math.pow(n-1, 4));
      // Error for trapezoidal part (single interval)
      const trapError = this.estimateSecondDerivative(func, splitPoint, b) *
        Math.pow(h, 2) / 12;
      return Math.abs(simpsonError) + Math.abs(trapError);
    }
  }

  estimateSecondDerivative(func, a, b) {
    const h = (b - a) / 100;
    let maxSecondDeriv = 0;
    for (let x = a + h; x < b - h; x += h) {
      try {
        const secondDeriv = Math.abs((func(x + h) - 2 * func(x) + func(x - h)) / (h * h));
        if (isFinite(secondDeriv)) {
          maxSecondDeriv = Math.max(maxSecondDeriv, secondDeriv);
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    return maxSecondDeriv;
  }

  estimateFourthDerivative(func, a, b) {
    const h = (b - a) / 1000;
    let maxFourthDeriv = 0;
    
    for (let x = a + 2*h; x < b - 2*h; x += h) {
      try {
        const fourthDeriv = Math.abs((func(x + 2*h) - 4*func(x + h) + 6*func(x) - 4*func(x - h) + func(x - 2*h)) / Math.pow(h, 4));
        if (isFinite(fourthDeriv)) {
          maxFourthDeriv = Math.max(maxFourthDeriv, fourthDeriv);
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    
    return maxFourthDeriv;
  }
}

// Midpoint Rule Implementation
export class MidpointRule extends IntegrationMethod {
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
      try {
        const secondDeriv = Math.abs((func(x + h) - 2 * func(x) + func(x - h)) / (h * h));
        if (isFinite(secondDeriv)) {
          maxSecondDeriv = Math.max(maxSecondDeriv, secondDeriv);
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    
    return maxSecondDeriv;
  }
}

// Monte Carlo Integration Implementation
export class MonteCarloIntegration extends IntegrationMethod {
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

// Simpson's 3/8 Rule Implementation
export class SimpsonsRule3By8 extends IntegrationMethod {
  constructor() {
    super("Simpson's 3/8", 'Uses cubic polynomials, best for intervals multiple of 3', '#a21caf');
  }

  integrate(func, a, b, n) {
    if (n < 3) throw new Error("Simpson's 3/8 rule requires at least 3 intervals.");
    let remainder = n % 3;
    let total = 0;
    let h = (b - a) / n;

    // Apply 3/8 rule to the largest multiple of 3
    let mainN = n - remainder;
    if (mainN >= 3) {
      let sum = func(a) + func(a + mainN * h);
      for (let i = 1; i < mainN; i++) {
        let x = a + i * h;
        if (i % 3 === 0) {
          sum += 2 * func(x);
        } else {
          sum += 3 * func(x);
        }
      }
      total += (3 * h / 8) * sum;
    }

    // For remainder intervals, use trapezoidal rule
    if (remainder > 0) {
      let remA = a + mainN * h;
      let remB = b;
      let remSum = (func(remA) + func(remB)) / 2;
      for (let i = 1; i < remainder; i++) {
        remSum += func(remA + i * h);
      }
      total += remSum * h;
    }

    return total;
  }
}
// Registry for all available methods
export const integrationMethods = [
  new TrapezoidalRule(),
  new SimpsonsRule1By3(),
  new SimpsonsRule3By8(),
  // new MidpointRule(),
  new MonteCarloIntegration()
];