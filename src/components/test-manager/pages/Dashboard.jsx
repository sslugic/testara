import React from 'react';
import { Target, FileText, CheckCircle, BarChart3, XCircle, Bot, Zap, Play } from 'lucide-react';
import StatusBadge from '../components/UI/StatusBadge';
import PriorityBadge from '../components/UI/PriorityBadge';

const Dashboard = ({ 
  dashboardStats, 
  testCases, 
  onOpenAIModal, 
  onOpenTestRunModal, 
  onSetActiveTab 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={() => onOpenAIModal('project')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Bot className="w-4 h-4" />
          AI Generate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProjects}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Test Cases</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalTestCases}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Passed Tests</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.passedTests}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Pass Rate</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.avgPassRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Test Results</h3>
        <div className="space-y-3">
          {testCases.slice(0, 5).map(testCase => (
            <div key={testCase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {testCase.status === 'passed' ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> : 
                  <XCircle className="w-5 h-5 text-red-600" />
                }
                <div>
                  <p className="font-medium">{testCase.title}</p>
                  <p className="text-sm text-gray-600">{testCase.project}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={testCase.priority} />
                <StatusBadge status={testCase.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Create Test Plan</h3>
          <p className="text-blue-100 mb-4">Generate comprehensive test plans with AI assistance</p>
          <button 
            onClick={() => onOpenAIModal('testplan')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Generate Plan
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Run Tests</h3>
          <p className="text-green-100 mb-4">Execute automated test suites and view results</p>
          <button 
            onClick={onOpenTestRunModal}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Testing
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">View Reports</h3>
          <p className="text-purple-100 mb-4">Access detailed analytics and test reports</p>
          <button 
            onClick={() => onSetActiveTab('reports')}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
