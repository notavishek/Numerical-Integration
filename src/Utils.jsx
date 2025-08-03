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

// Download functions
export const downloadChartAsImage = async (chartId, format = 'png') => {
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
              link.download = `integration-results-${Date.now()}.${format}`;
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
export const downloadChartAsImageAlt = async (chartId, format = 'png') => {
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
        link.download = `function-plot-${Date.now()}.${format}`;
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
export const downloadChartAsPNG = async (chartId) => {
  try {
    await downloadChartAsImage(chartId, 'png');
  } catch (error) {
    console.warn('Primary method failed, trying alternative:', error);
    await downloadChartAsImageAlt(chartId, 'png');
  }
};
