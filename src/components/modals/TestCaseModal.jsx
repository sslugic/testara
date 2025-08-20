import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const TestCaseModal = ({
  show,
  onClose,
  testCaseForm,
  setTestCaseForm,
  projects,
  editingItem,
  onSubmit,
  addTestStep,
  updateTestStep,
  removeTestStep
}) => {
  if (!show) return null;

  const leftAlignStyle = { textAlign: 'left' };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={leftAlignStyle}>
        <h3 className="text-lg font-semibold mb-4" style={leftAlignStyle}>
          {editingItem ? 'Edit Test Case' : 'Create New Test Case'}
        </h3>
        
        <div className="space-y-4" style={leftAlignStyle}>
          <div style={leftAlignStyle}>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Test Case Title</label>
            <input
              type="text"
              value={testCaseForm.title}
              onChange={(e) => setTestCaseForm({...testCaseForm, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test case title"
              style={leftAlignStyle}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={leftAlignStyle}>
            <div style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Project</label>
              <select
                value={testCaseForm.project}
                onChange={(e) => setTestCaseForm({...testCaseForm, project: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={leftAlignStyle}
              >
                {(projects || []).map(project => (
                  <option key={project._id} value={project.name} style={leftAlignStyle}>{project.name}</option>
                ))}
              </select>
            </div>

            <div style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Priority</label>
              <select
                value={testCaseForm.priority}
                onChange={(e) => setTestCaseForm({...testCaseForm, priority: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={leftAlignStyle}
              >
                <option value="Low" style={leftAlignStyle}>Low</option>
                <option value="Medium" style={leftAlignStyle}>Medium</option>
                <option value="High" style={leftAlignStyle}>High</option>
                <option value="Critical" style={leftAlignStyle}>Critical</option>
              </select>
            </div>
          </div>

          <div style={leftAlignStyle}>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Description</label>
            <textarea
              value={testCaseForm.description}
              onChange={(e) => setTestCaseForm({...testCaseForm, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the test case"
              rows="3"
              style={leftAlignStyle}
            />
          </div>

          {/* Test Steps Section */}
          <div style={leftAlignStyle}>
            <div className="flex justify-between items-center mb-3" style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700" style={leftAlignStyle}>Test Steps</label>
              <button
                type="button"
                onClick={addTestStep}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                style={leftAlignStyle}
              >
                <Plus className="w-3 h-3" />
                Add Step
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto" style={leftAlignStyle}>
              {(testCaseForm.steps || []).map((step, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50" style={leftAlignStyle}>
                  <div className="flex justify-between items-center mb-2" style={leftAlignStyle}>
                    <span className="text-sm font-medium text-gray-700" style={leftAlignStyle}>Step {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTestStep(index)}
                      className="text-red-600 hover:text-red-800"
                      style={leftAlignStyle}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2" style={leftAlignStyle}>
                    <div style={leftAlignStyle}>
                      <label className="block text-xs font-medium text-gray-600 mb-1" style={leftAlignStyle}>Action</label>
                      <input
                        type="text"
                        value={step.step || ''}
                        onChange={(e) => updateTestStep(index, 'step', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe the action to perform"
                        style={leftAlignStyle}
                      />
                    </div>
                    <div style={leftAlignStyle}>
                      <label className="block text-xs font-medium text-gray-600 mb-1" style={leftAlignStyle}>Expected Result</label>
                      <input
                        type="text"
                        value={step.expectedResult || ''}
                        onChange={(e) => updateTestStep(index, 'expectedResult', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe the expected outcome"
                        style={leftAlignStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(!testCaseForm.steps || testCaseForm.steps.length === 0) && (
                <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg" style={leftAlignStyle}>
                  <p className="text-sm" style={leftAlignStyle}>No test steps added yet</p>
                  <p className="text-xs text-gray-400" style={leftAlignStyle}>Click "Add Step" to create your first test step</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6" style={leftAlignStyle}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            style={leftAlignStyle}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            style={leftAlignStyle}
          >
            {editingItem ? 'Update Test Case' : 'Create Test Case'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCaseModal;
