import React from 'react';
import { Target, FileText, CheckCircle, XCircle, Play, Bot } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const Dashboard = ({ 
  dashboardStats = {}, 
  projects = [], 
  testCases = [], 
  testRuns = [],
  testPlans = [],
  setActiveTab, 
  handleCreateProject, 
  handleCreateTestCase, 
  handleRunTest,
  setShowAIModal,
  setAiTask,
  calculateProjectPassRate,
  calculateProjectTestCaseCount,
  onGenerateTestData
}) => {
  // Provide default values to prevent undefined errors
  const stats = {
    totalProjects: 0,
    totalTestCases: 0,
    passedTests: 0,
    failedTests: 0,
    avgPassRate: 0,
    ...dashboardStats
  };

  // Check if we should show the generate button - show if no data OR for testing
  const showGenerateButton = projects.length === 0 && testCases.length === 0;
  
  // Debug logging
  console.log('Dashboard render:', {
    projectsLength: projects.length,
    testCasesLength: testCases.length,
    showGenerateButton,
    localStorage: {
      projects: localStorage.getItem('testara_projects') ? JSON.parse(localStorage.getItem('testara_projects')).length : 0,
      testCases: localStorage.getItem('testara_testCases') ? JSON.parse(localStorage.getItem('testara_testCases')).length : 0
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex gap-2">
          {showGenerateButton && (
            <button
              onClick={() => {
                console.log('Generate Test Data button clicked from Dashboard');
                if (onGenerateTestData) {
                  onGenerateTestData();
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Generate Test Data
            </button>
          )}
          {/* Debug button - remove this after testing */}
          {projects.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all data and regenerate?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Reset Data
            </button>
          )}
          <button
            onClick={() => { 
              setShowAIModal(true); 
              setAiTask('project'); 
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            AI Generate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProjects}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Test Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTestCases}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passed Tests</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.passedTests}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Tests</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.failedTests}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <button 
              onClick={() => setActiveTab('projects')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 4).map(project => {
              const calculatedPassRate = calculateProjectPassRate ? calculateProjectPassRate(project._id) : 0;
              const calculatedTestCaseCount = calculateProjectTestCaseCount ? calculateProjectTestCaseCount(project._id) : 0;
              const projectTestRuns = testRuns.filter(tr => tr.projectId === project._id);
              const lastTestRun = projectTestRuns.length > 0 ? 
                projectTestRuns.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0] : null;
              
              return (
                <div key={project._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{calculatedTestCaseCount} test cases</p>
                    <p className="text-sm text-green-600">{calculatedPassRate}% pass rate</p>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No projects created yet</p>
                <button
                  onClick={handleCreateProject}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Create your first project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Test Results Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Passed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.passedTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Failed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.failedTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {testCases.filter(tc => tc.status === 'pending').length}
              </span>
            </div>
            
            {/* Pass Rate Chart */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Overall Pass Rate</span>
                <span className="text-lg font-bold text-gray-900">{stats.avgPassRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.avgPassRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Test Cases */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Test Cases</h3>
          <button 
            onClick={() => setActiveTab('testcases')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Case</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testCases.slice(0, 5).map(testCase => (
                <tr key={testCase._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{testCase.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{testCase.project}</td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={testCase.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={testCase.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleRunTest(testCase)}
                      title="Run Test"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {testCases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No test cases created yet</p>
              <button
                onClick={handleCreateTestCase}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Create your first test case
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
