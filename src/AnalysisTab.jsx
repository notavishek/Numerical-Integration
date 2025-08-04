// import { LineChart, Line, Legend, BarChart3 } from 'lucide-react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Area, AreaChart, ScatterChart, Scatter } from 'recharts';
import { Calculator, Settings, TrendingUp, Info, Download, Plus, BookOpen, Eye, Share2, HelpCircle, BarChart3, FileText } from 'lucide-react';
import { integrationMethods } from "./IntegrationMethods";





const AnalysisTab = ({ convergenceData, results, selectedMethods, exactValue, intervals }) => {
  console.log('Convergence Data:', convergenceData);

  const downloadResultsAsTXT = (filename) => {
    let content = `Numerical Integration Results\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Selected Methods: ${selectedMethods && selectedMethods.length > 0 ? selectedMethods.join(', ') : 'None'}\n`;
    content += `Number of Intervals: ${intervals}\n`;
    content += `\nRESULTS:\n`;
    content += `${'Method'.padEnd(20)} ${'Value'.padEnd(15)} ${'Abs Error'.padEnd(15)} ${'Rel Error (%)'.padEnd(15)} ${'Error Estimate'.padEnd(15)}\n`;
    content += `${'-'.repeat(80)}\n`;
    results.forEach(result => {
      content += `${result.method.padEnd(20)} `;
      content += `${result.value.toFixed(6).padEnd(15)} `;
      content += `${(result.error ? result.error.toFixed(6) : 'N/A').padEnd(15)} `;
      content += `${(result.relativeError ? result.relativeError.toFixed(4) : 'N/A').padEnd(15)} `;
      content += `${(result.errorEstimate ? `±${result.errorEstimate.toFixed(6)}` : 'N/A').padEnd(15)}\n`;
    });
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadConvergenceData = () => {
    let content = `Convergence Analysis Data\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Selected Methods: ${selectedMethods && selectedMethods.length > 0 ? selectedMethods.join(', ') : 'None'}\n`;
    content += `Number of Intervals: ${intervals}\n\n`;
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
    downloadResultsAsTXT('convergence-analysis');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `convergence-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Convergence Analysis */}
      {convergenceData?.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
          <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                <BarChart className="w-5 h-5 text-white" />
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
                formatter={(value, name) => [value.toFixed(4), 'f(x)']}
                labelFormatter={(x) => `x = ${x}`}
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
      )}

      {/* Error Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Error Analysis
            </h4>
          </div>
          
          {results.length > 0 ? (
            exactValue ? (
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
              <div className="space-y-4">
                {results.map(result => (
                  <div key={result.method} className="p-4 bg-gray-50/80 rounded-lg border border-gray-200/50">
                    <div className="font-medium" style={{ color: result.color }}>{result.method}</div>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Computed Value:</span>
                        <span className="font-mono">{result.value.toFixed(6)}</span>
                      </div>
                      {result.errorEstimate && (
                        <div className="flex justify-between text-purple-600">
                          <span>Error Estimate:</span>
                          <span className="font-mono">±{result.errorEstimate.toFixed(6)}</span>
                        </div>
                      )}
                      <div className="text-gray-600 text-xs italic">
                        No exact solution available for comparison
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="p-4 bg-yellow-50/80 rounded-lg border border-yellow-200/50 text-center">
              <p className="text-yellow-800 text-sm">
                <strong>Click "Calculate Integration" to see error analysis.</strong>
              </p>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
          <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Performance Metrics
          </h4>
          
          {results.length > 0 ? (
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
          ) : (
            <div className="p-4 bg-yellow-50/80 rounded-lg border border-yellow-200/50 text-center">
              <p className="text-yellow-800 text-sm">
                <strong>Click "Calculate Integration" to see performance metrics.</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AnalysisTab; 

