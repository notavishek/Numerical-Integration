import React from 'react';
import { Settings } from 'lucide-react';
import { predefinedFunctions } from './Constants';
import { integrationMethods } from './IntegrationMethods';

const ControlPanel = ({
  selectedFunction,
  setSelectedFunction,
  rawFunction,
  setRawFunction,
  processedFunction,
  functionError,
  onProcessFunction,
  lowerLimit,
  setLowerLimit,
  upperLimit,
  setUpperLimit,
  intervals,
  setIntervals,
  selectedMethods,
  onToggleMethod,
  onCalculate,
  shouldCalculate,
  onParameterChange
}) => {
  return (
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
          onChange={(e) => {
            setSelectedFunction(e.target.value);
            setRawFunction('');
            onParameterChange();
          }}
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
            placeholder="e.g., ln(x^2 + 1) or sin(x)*cos(x)"
            className="w-full p-3 pr-20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
          />
          <button
            onClick={onProcessFunction}
            className="absolute right-2 top-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
          >
            Parse
          </button>
        </div>
        {functionError && (
          <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
            <strong>Error:</strong> {functionError}
          </div>
        )}
        {processedFunction && !functionError && (
          <div className="mt-2 text-green-600 text-sm bg-green-50 p-2 rounded-lg border border-green-200">
            <strong>✓ Processed:</strong> {processedFunction}
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
                onParameterChange();
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
                onParameterChange();
              }
            }}
            className="w-full p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
          />
        </div>
      </div>
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
          onChange={(e) => {
            setIntervals(Number(e.target.value));
            onParameterChange();
          }}
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
                onChange={() => {
                  onToggleMethod(method.name);
                  onParameterChange();
                }}
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

      {/* Calculate Button */}
      <div className="pt-4">
        <button
          onClick={onCalculate}
          disabled={selectedMethods.length === 0 || (processedFunction === null && rawFunction !== '' && functionError !== '') || lowerLimit >= upperLimit}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            selectedMethods.length === 0 || (processedFunction === null && rawFunction !== '' && functionError !== '') || lowerLimit >= upperLimit
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {shouldCalculate ? 'Calculate Integration' : 'Recalculate'}
        </button>
      </div>
    </div>
  );
};
export default ControlPanel;