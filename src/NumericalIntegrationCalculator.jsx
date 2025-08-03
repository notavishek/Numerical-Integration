import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Eye, BarChart3, BookOpen } from 'lucide-react';
import { predefinedFunctions } from './Constants';
import ControlPanel from './ControlPanel';
import ResultsDisplay from './ResultsDisplay';
import VisualizationTab from './VisualizationTab';
import AnalysisTab from './AnalysisTab';
import TutorialTab from './TutorialTab';
import { integrationMethods } from './IntegrationMethods';
import { processCustomFunction } from './Utils';

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

export default function NumericalIntegrationCalculator() {
  // Main state variables
  const [activeTab, setActiveTab] = useState('calculator');
  const [selectedFunction, setSelectedFunction] = useState('x^2');
  const [customFunction, setCustomFunction] = useState('');
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(2);
  const [intervals, setIntervals] = useState(10);
  const [selectedMethods, setSelectedMethods] = useState(['Trapezoidal Rule']);
  const [tutorialSection, setTutorialSection] = useState('introduction');

  // Custom function processing state
  const [rawFunction, setRawFunction] = useState('');
  const [processedFunction, setProcessedFunction] = useState(null);
  const [functionError, setFunctionError] = useState('');

  // Calculation control state
  const [shouldCalculate, setShouldCalculate] = useState(true);
  const [calculationResults, setCalculationResults] = useState([]);
  const [convergenceData, setConvergenceData] = useState([]);

  // Get current function
  const currentFunc = useMemo(() => {
    if (customFunction && !functionError) {
      try {
        return new Function('x', `return ${customFunction}`);
      } catch (e) {
        return predefinedFunctions[selectedFunction].func;
      }
    }
    return predefinedFunctions[selectedFunction].func;
  }, [selectedFunction, customFunction, functionError]);

  // Generate function plot data
  const plotData = useMemo(() => {
    if (!currentFunc) return [];
    
    const data = [];
    const step = (upperLimit - lowerLimit) / 200;
    
    for (let x = lowerLimit; x <= upperLimit; x += step) {
      try {
        const y = currentFunc(x);
        if (isFinite(y) && !isNaN(y)) {
          data.push({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) });
        }
      } catch (e) {
        // Skip invalid points
      }
    }
    
    return data;
  }, [currentFunc, lowerLimit, upperLimit]);

  // Function to process custom function input
  const handleProcessFunction = () => {
    const result = processCustomFunction(rawFunction);
    setProcessedFunction(result.processed);
    setFunctionError(result.error);
    if (result.processed) {
      setCustomFunction(result.processed);
    } else {
      setCustomFunction('');
    }
    setShouldCalculate(true);
  };

  // Function to perform calculations when button is clicked
  const performCalculations = () => {
    try {
      if (selectedMethods.length === 0) {
        alert('Please select at least one integration method.');
        return;
      }

      const results = integrationMethods
        .filter(method => selectedMethods.includes(method.name))
        .map(method => {
          try {
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
          } catch (error) {
            return {
              method: method.name,
              value: NaN,
              color: method.color,
              error: null,
              errorEstimate: null,
              relativeError: null,
              calculationError: error.message
            };
          }
        });
      
      setCalculationResults(results);
      setShouldCalculate(false);
      
      // Generate convergence data
      setTimeout(() => generateConvergenceData(), 100);
      
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculationResults([]);
    }
  };

  // Generate convergence analysis data
  const generateConvergenceData = () => {
    if (calculationResults.length === 0) return;
    
    const data = [];
    for (let n = 2; n <= 50; n += 2) {
      const point = { intervals: n };
      
      selectedMethods?.forEach(methodName => {
        const method = integrationMethods?.find(m => m.name === methodName);
        if (method) {
          try {
            point[methodName] = method.integrate(currentFunc, lowerLimit, upperLimit, n);
          } catch (e) {
            // Skip if calculation fails
          }
        }
      });
      
      data.push(point);
    }
    console.log('Convergence Data:', data);
    setConvergenceData(data);
  };

  const toggleMethod = (methodName) => {
    setSelectedMethods(prev => 
      prev.includes(methodName) 
        ? prev.filter(m => m !== methodName)
        : [...prev, methodName]
    );
  };

  const handleParameterChange = () => {
    setShouldCalculate(true);
  };

  const exactValue = predefinedFunctions[selectedFunction] && !customFunction ? 
    predefinedFunctions[selectedFunction].exact(lowerLimit, upperLimit) : null;

  // Export handlers
  const handleDownloadTXT = () => {
    let content = `Numerical Integration Results\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Function: ${customFunction ? `Custom: ${rawFunction}` : predefinedFunctions[selectedFunction].display}\n`;
    content += `Integration Range: [${lowerLimit}, ${upperLimit}]\n`;
    content += `Number of Intervals: ${intervals}\n`;
    content += `Selected Methods: ${selectedMethods.join(', ')}\n\n`;
    
    if (exactValue) {
      content += `Exact Value: ${exactValue.toFixed(10)}\n\n`;
    }
    
    content += `RESULTS:\n`;
    content += `${'Method'.padEnd(20)} ${'Value'.padEnd(15)} ${'Abs Error'.padEnd(15)} ${'Rel Error (%)'.padEnd(15)} ${'Error Estimate'.padEnd(15)}\n`;
    content += `${'-'.repeat(80)}\n`;
    
    calculationResults.forEach(result => {
      content += `${result.method.padEnd(20)} `;
      content += `${result.value.toFixed(6).padEnd(15)} `;
      content += `${(result.error ? result.error.toFixed(6) : 'N/A').padEnd(15)} `;
      content += `${(result.relativeError ? result.relativeError.toFixed(4) : 'N/A').padEnd(15)} `;
      content += `${(result.errorEstimate ? `±${result.errorEstimate.toFixed(6)}` : 'N/A').padEnd(15)}\n`;
    });
    
    downloadResultsAsTXT(content);
  };

  const handleShare = () => {
    const shareText = `Numerical Integration Results:
Function: ${customFunction ? `Custom: ${rawFunction}` : predefinedFunctions[selectedFunction].display}
Limits: [${lowerLimit}, ${upperLimit}]
${calculationResults.map(r => `${r.method}: ${r.value.toFixed(6)}`).join('\n')}
${exactValue ? `Exact: ${exactValue.toFixed(6)}` : ''}`;
    
    shareResults(shareText);
  };

  const handleExportJSON = () => {
    const exportData = {
      function: customFunction ? `Custom: ${rawFunction}` : predefinedFunctions[selectedFunction].display,
      limits: { lower: lowerLimit, upper: upperLimit },
      intervals: intervals,
      methods: selectedMethods,
      results: calculationResults,
      exactValue: exactValue,
      timestamp: new Date().toISOString()
    };
    
    exportResultsAsJSON(exportData);
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
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1">
              <ControlPanel
                selectedFunction={selectedFunction}
                setSelectedFunction={setSelectedFunction}
                rawFunction={rawFunction}
                setRawFunction={setRawFunction}
                processedFunction={processedFunction}
                functionError={functionError}
                onProcessFunction={handleProcessFunction}
                lowerLimit={lowerLimit}
                setLowerLimit={setLowerLimit}
                upperLimit={upperLimit}
                setUpperLimit={setUpperLimit}
                intervals={intervals}
                setIntervals={setIntervals}
                selectedMethods={selectedMethods}
                onToggleMethod={toggleMethod}
                onCalculate={performCalculations}
                shouldCalculate={shouldCalculate}
                onParameterChange={handleParameterChange}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
              <ResultsDisplay
                results={calculationResults}
                rawFunction={rawFunction}
                selectedFunction={selectedFunction}
                customFunction={customFunction}
                lowerLimit={lowerLimit}
                upperLimit={upperLimit}
                intervals={intervals}
                selectedMethods={selectedMethods}
                exactValue={exactValue}
                onDownloadTXT={handleDownloadTXT}
                onShare={handleShare}
                onExportJSON={handleExportJSON}
              />
            </div>
          </div>
        )}

        {activeTab === 'visualization' && (
          <VisualizationTab
            plotData={plotData}
            results={calculationResults}
            lowerLimit={lowerLimit}
            upperLimit={upperLimit}
            selectedMethods={selectedMethods}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisTab
            convergenceData={convergenceData}
            results={calculationResults}
            selectedMethods={selectedMethods}
            exactValue={exactValue}
            intervals={intervals}
          />
        )}

        {activeTab === 'tutorial' && (
          <TutorialTab
            tutorialSection={tutorialSection}
            setTutorialSection={setTutorialSection}
          />
        )}
      </div>
    </div>
  );
}