import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

const TestExecutionModal = ({ show, onClose, testRun, testCases, onUpdateTestRun }) => {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [notes, setNotes] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (testRun && testCases) {
      // Initialize test results from test run data
      const results = (testRun.testCaseResults || []).map(result => {
        const testCase = testCases.find(tc => tc._id === result.testCaseId);
        return {
          ...result,
          testCase: testCase || { title: 'Unknown Test Case', _id: result.testCaseId }
        };
      });
      setTestResults(results);
      setCurrentTestIndex(0);
      setNotes('');
    }
  }, [testRun, testCases]);

  if (!show || !testRun) return null;

  const currentTest = testResults[currentTestIndex];
  const currentTestCase = currentTest?.testCase;

  const handleTestResult = (status) => {
    const updatedResults = [...testResults];
    updatedResults[currentTestIndex] = {
      ...updatedResults[currentTestIndex],
      status,
      executedDate: new Date().toISOString().split('T')[0],
      notes: notes.trim()
    };
    setTestResults(updatedResults);
    setNotes('');

    // Move to next test or finish
    if (currentTestIndex < testResults.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    } else {
      // All tests completed, update the test run
      completeTestRun(updatedResults);
    }
  };

  const completeTestRun = (finalResults) => {
    const passedTests = finalResults.filter(r => r.status === 'passed').length;
    const failedTests = finalResults.filter(r => r.status === 'failed').length;
    const skippedTests = finalResults.filter(r => r.status === 'skipped').length;

    const updatedTestRun = {
      ...testRun,
      status: 'completed',
      endDate: new Date().toISOString().split('T')[0],
      passedTests,
      failedTests,
      skippedTests,
      totalTests: finalResults.length,
      testCaseResults: finalResults.map(result => ({
        testCaseId: result.testCaseId,
        status: result.status,
        executedDate: result.executedDate,
        notes: result.notes || ''
      }))
    };

    console.log('Completing test run with data:', updatedTestRun);
    onUpdateTestRun(updatedTestRun);
    onClose();
  };

  const goToTest = (index) => {
    setCurrentTestIndex(index);
    const test = testResults[index];
    setNotes(test?.notes || '');
  };

  const skipAllRemaining = () => {
    const updatedResults = testResults.map((result, index) => {
      if (index >= currentTestIndex && result.status === 'pending') {
        return {
          ...result,
          status: 'skipped',
          executedDate: new Date().toISOString().split('T')[0],
          notes: 'Skipped during batch operation'
        };
      }
      return result;
    });
    
    completeTestRun(updatedResults);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'skipped':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Execute Test Run - Testara</h2>
              <p className="text-gray-600">{testRun.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Test {currentTestIndex + 1} of {testResults.length}
              </p>
              <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentTestIndex + 1) / testResults.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Test List Sidebar */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Test Cases</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <button
                    key={result.testCaseId}
                    onClick={() => goToTest(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      index === currentTestIndex
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.testCase?.title || 'Unknown Test'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Test {index + 1}
                        </p>
                      </div>
                      <div className="ml-2">
                        {getStatusIcon(result.status)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Execution Area */}
          <div className="flex-1 flex flex-col">
            {currentTestCase ? (
              <>
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {currentTestCase.title}
                    </h3>
                    <p className="text-gray-600">
                      {currentTestCase.description || 'No description available'}
                    </p>
                  </div>

                  {/* Test Steps */}
                  {currentTestCase.steps && currentTestCase.steps.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Test Steps</h4>
                      <div className="space-y-4">
                        {currentTestCase.steps.map((step, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Step {index + 1}:
                              </span>
                              <p className="text-sm text-gray-900 mt-1">{step.step}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Expected Result:
                              </span>
                              <p className="text-sm text-gray-600 mt-1">{step.expectedResult}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Add any observations, issues, or additional notes..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTestResult('passed')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Pass
                      </button>
                      <button
                        onClick={() => handleTestResult('failed')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Fail
                      </button>
                      <button
                        onClick={() => handleTestResult('skipped')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Skip
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      {currentTestIndex < testResults.length - 1 && (
                        <button
                          onClick={skipAllRemaining}
                          className="px-4 py-2 text-yellow-600 hover:text-yellow-800 border border-yellow-300 rounded-lg hover:bg-yellow-50"
                        >
                          Skip Remaining
                        </button>
                      )}
                      
                      {currentTestIndex > 0 && (
                        <button
                          onClick={() => {
                            setCurrentTestIndex(currentTestIndex - 1);
                            const prevTest = testResults[currentTestIndex - 1];
                            setNotes(prevTest?.notes || '');
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Previous
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          // Save current progress and close
                          const currentResults = [...testResults];
                          if (currentTestIndex < currentResults.length) {
                            // Update current test if it has been modified
                            const currentTest = currentResults[currentTestIndex];
                            if (currentTest.status !== 'pending' || notes.trim()) {
                              currentResults[currentTestIndex] = {
                                ...currentTest,
                                notes: notes.trim()
                              };
                            }
                          }
                          
                          // Mark test run as in_progress if any tests have been executed
                          const hasExecutedTests = currentResults.some(r => r.status !== 'pending');
                          if (hasExecutedTests) {
                            const partialTestRun = {
                              ...testRun,
                              status: 'in_progress',
                              passedTests: currentResults.filter(r => r.status === 'passed').length,
                              failedTests: currentResults.filter(r => r.status === 'failed').length,
                              skippedTests: currentResults.filter(r => r.status === 'skipped').length,
                              testCaseResults: currentResults
                            };
                            onUpdateTestRun(partialTestRun);
                          }
                          
                          onClose();
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Save & Exit
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Cases</h3>
                  <p className="text-gray-600">This test run has no test cases to execute.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestExecutionModal;
