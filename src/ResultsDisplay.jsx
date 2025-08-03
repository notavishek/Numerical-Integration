import { TrendingUp, Download, Share2, Calculator } from 'lucide-react';
import { predefinedFunctions } from './Constants';

const ResultsDisplay = ({
  results,
  rawFunction,
  selectedFunction,
  customFunction,
  lowerLimit,
  upperLimit,
  intervals,
  selectedMethods,
  exactValue,
  onDownloadTXT,
  onShare,
  onExportJSON
}) => {
  return (
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
            onClick={onDownloadTXT}
            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
            title="Download Results as TXT"
            disabled={results.length === 0}
          >
            <Download className="w-4 h-4" />
            <span className="text-xs">TXT</span>
          </button>
          <button 
            onClick={onShare} 
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            title="Share Results"
            disabled={results.length === 0}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onExportJSON} 
            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
            title="Export as JSON"
            disabled={results.length === 0}
          >
            <Download className="w-4 h-4" />
            <span className="text-xs">JSON</span>
          </button>
        </div>
      </div>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {results.map((result, index) => (
            <div key={result.method} className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm p-4 rounded-lg border border-white/40 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105">
              <div className="text-sm font-medium" style={{ color: result.color }}>{result.method}</div>
              {result.calculationError ? (
                <div className="text-red-600 text-sm mt-1">
                  Error: {result.calculationError}
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50/50 p-6 rounded-lg border border-yellow-200/50 text-center">
          <Calculator className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-yellow-800 font-medium text-lg">Ready to Calculate</p>
          <p className="text-yellow-600 text-sm mt-1">Configure parameters and click "Calculate Integration" to see results</p>
        </div>
      )}

      {/* Quick Summary */}
      {results.length > 0 && (
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200/50">
          <h4 className="font-semibold text-blue-800 mb-2">Quick Summary</h4>
          <div className="text-sm text-blue-700">
            <p>Function: {customFunction ? `Custom: ${rawFunction}` : predefinedFunctions[selectedFunction].display}</p>
            <p>Integration Range: [{lowerLimit}, {upperLimit}]</p>
            <p>Intervals: {intervals}</p>
            <p>Selected Methods: {selectedMethods.join(', ')}</p>
            {exactValue && <p>Exact Value: {exactValue.toFixed(6)}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
export default ResultsDisplay;  