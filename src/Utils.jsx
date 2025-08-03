// Function to process custom function input
export const processCustomFunction = (rawFunction) => {
  try {
    if (!rawFunction.trim()) {
      return { processed: null, error: '' };
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
    
    // Handle logarithms with a careful approach to avoid conflicts
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

    // Test with a range of values, being careful with domain issues
    const testPoints = [0.1, 1, 2, 3, 5];
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
      throw new Error(`Function does not produce valid numeric results. Check your syntax and domain.`);
    }

    return { processed, error: '' };
  } catch (e) {
    return { processed: null, error: e.message || 'Invalid function syntax' };
  }
};

// Export functions
export const exportResultsAsJSON = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `integration-results-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadResultsAsTXT = (content) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `integration-results-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export const shareResults = (shareText) => {
  if (navigator.share) {
    navigator.share({ title: 'Integration Results', text: shareText });
  } else {
    navigator.clipboard.writeText(shareText);
    alert('Results copied to clipboard!');
  }
};