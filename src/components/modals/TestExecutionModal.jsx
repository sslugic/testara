import React from 'react';
import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';

const TestExecutionModal = ({
  show,
  onClose,
  executingTestRun,
  testCases,
  handleUpdateTestResult
}) => {
  if (!show || !executingTestRun) return null;

  const leftAlignStyle = { textAlign: 'left' };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={leftAlignStyle}>
        <div className="flex justify-between items-center mb-4" style={leftAlignStyle}>
          <h3 className="text-lg font-semibold" style={leftAlignStyle}>
            Execute Test Run: {executingTestRun.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            style={leftAlignStyle}
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6" style={leftAlignStyle}>
          <div className="grid grid-cols-4 gap-4 text-center" style={leftAlignStyle}>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-lg font-bold text-blue-600">{executingTestRun.totalTests}</p>
              <p className="text-xs text-blue-600">Total</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-lg font-bold text-green-600">{executingTestRun.passedTests}</p>
              <p className="text-xs text-green-600">Passed</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-lg font-bold text-red-600">{executingTestRun.failedTests}</p>
              <p className="text-xs text-red-600">Failed</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-lg font-bold text-yellow-600">{executingTestRun.skippedTests}</p>
              <p className="text-xs text-yellow-600">Skipped</p>
            </div>
          </div>
        </div>

        <div className="space-y-4" style={leftAlignStyle}>
          {executingTestRun.testCaseResults.map((result, index) => {
            const testCase = (testCases || []).find(tc => tc._id === result.testCaseId);
            if (!testCase) return null;

            return (
              <div key={result.testCaseId} className="border rounded-lg p-4 bg-gray-50" style={leftAlignStyle}>
                <div className="flex justify-between items-start mb-3" style={leftAlignStyle}>
                  <div style={leftAlignStyle}>
                    <h4 className="font-medium text-gray-900" style={leftAlignStyle}>
                      {index + 1}. {testCase.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1" style={leftAlignStyle}>
                      {testCase.description}
                    </p>
                  </div>
                  <div className="flex gap-2" style={leftAlignStyle}>
                    <StatusBadge status={result.status} />
                    <PriorityBadge priority={testCase.priority} />
                  </div>
                </div>

                {testCase.steps && Array.isArray(testCase.steps) && testCase.steps.length > 0 && (
                  <div className="mb-3" style={leftAlignStyle}>
                    <p className="text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Test Steps:</p>
                    <div className="space-y-2" style={leftAlignStyle}>
                      {testCase.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="bg-white p-2 rounded border-l-4 border-blue-200" style={leftAlignStyle}>
                          <p className="text-sm" style={leftAlignStyle}>
                            <span className="font-medium" style={leftAlignStyle}>Step {stepIndex + 1}:</span> {step.step}
                          </p>
                          <p className="text-xs text-gray-600 mt-1" style={leftAlignStyle}>
                            <span className="font-medium" style={leftAlignStyle}>Expected:</span> {step.expectedResult}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!testCase.steps || !Array.isArray(testCase.steps) || testCase.steps.length === 0) && (
                  <div className="mb-3 text-center py-3 text-gray-500 bg-yellow-50 rounded border" style={leftAlignStyle}>
                    <p className="text-sm" style={leftAlignStyle}>No test steps defined for this test case</p>
                  </div>
                )}

                {result.notes && (
                  <div className="mb-3" style={leftAlignStyle}>
                    <p className="text-sm font-medium text-gray-700" style={leftAlignStyle}>Notes:</p>
                    <p className="text-sm text-gray-600 bg-white p-2 rounded border" style={leftAlignStyle}>
                      {result.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center" style={leftAlignStyle}>
                  <div className="flex gap-2" style={leftAlignStyle}>
                    <button
                      onClick={() => handleUpdateTestResult(result.testCaseId, 'passed')}
                      className={`px-3 py-1 rounded text-sm ${
                        result.status === 'passed' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      style={leftAlignStyle}
                    >
                      Pass
                    </button>
                    <button
                      onClick={() => handleUpdateTestResult(result.testCaseId, 'failed')}
                      className={`px-3 py-1 rounded text-sm ${
                        result.status === 'failed' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                      style={leftAlignStyle}
                    >
                      Fail
                    </button>
                    <button
                      onClick={() => handleUpdateTestResult(result.testCaseId, 'skipped')}
                      className={`px-3 py-1 rounded text-sm ${
                        result.status === 'skipped' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                      style={leftAlignStyle}
                    >
                      Skip
                    </button>
                  </div>
                  <div className="flex-1 ml-4" style={leftAlignStyle}>
                    <input
                      type="text"
                      value={result.notes}
                      onChange={(e) => handleUpdateTestResult(result.testCaseId, result.status, e.target.value)}
                      placeholder="Add notes (optional)"
                      className="w-full px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={leftAlignStyle}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end mt-6" style={leftAlignStyle}>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            style={leftAlignStyle}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestExecutionModal;
