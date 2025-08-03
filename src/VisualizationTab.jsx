import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { integrationMethods } from './IntegrationMethods';

const VisualizationTab = ({ plotData, results, lowerLimit, upperLimit, selectedMethods }) => {
  return (
    <div className="space-y-6">
      {/* Function Plot */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Function Visualization</h3>
        </div>

        <div id="main-visualization">
          <ResponsiveContainer width="100%" height={400}>
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
          </ResponsiveContainer>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
          <h4 className="font-semibold text-gray-800 mb-2">Visualization Guide</h4>
          <div className="text-sm text-gray-700">
            <p>This shows your function f(x) over the integration interval [{lowerLimit}, {upperLimit}]. The shaded area represents the definite integral you're calculating.</p>
          </div>
        </div>
      </div>

      {/* Results Comparison */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-6">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Results Comparison
            </h4>
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
      )}
    </div>
  );
};
export default VisualizationTab;  