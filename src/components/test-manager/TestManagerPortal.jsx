import React, { useState } from 'react';
import { BarChart3, Target, FileText, Play, Settings } from 'lucide-react';

// Temporary inline implementations until separate files are created
const useTestManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Testing suite for online shopping platform',
      status: 'active',
      testCases: 45,
      passRate: 87,
      lastRun: '2024-08-11',
      team: ['John Doe', 'Jane Smith']
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      description: 'Security and functionality testing',
      status: 'active',
      testCases: 72,
      passRate: 93,
      lastRun: '2024-08-10',
      team: ['Alice Johnson', 'Bob Wilson']
    }
  ]);

  const [testCases, setTestCases] = useState([
    {
      id: 1,
      title: 'User Login Functionality',
      project: 'E-commerce Platform',
      priority: 'High',
      status: 'passed',
      lastRun: '2024-08-11',
      steps: 5
    },
    {
      id: 2,
      title: 'Payment Processing',
      project: 'E-commerce Platform',
      priority: 'Critical',
      status: 'failed',
      lastRun: '2024-08-11',
      steps: 8
    },
    {
      id: 3,
      title: 'Account Balance Display',
      project: 'Mobile Banking App',
      priority: 'Medium',
      status: 'passed',
      lastRun: '2024-08-10',
      steps: 3
    }
  ]);

  const dashboardStats = {
    totalProjects: projects.length,
    totalTestCases: testCases.length,
    passedTests: testCases.filter(tc => tc.status === 'passed').length,
    failedTests: testCases.filter(tc => tc.status === 'failed').length,
    avgPassRate: Math.round(projects.reduce((acc, p) => acc + p.passRate, 0) / projects.length)
  };

  return {
    activeTab,
    setActiveTab,
    projects,
    setProjects,
    testCases,
    setTestCases,
    dashboardStats
  };
};

// Temporary inline components
const Dashboard = ({ dashboardStats, testCases, onOpenAIModal, onOpenTestRunModal, onSetActiveTab }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={() => onOpenAIModal('project')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          AI Generate
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-600">Total Projects</p>
          <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-600">Test Cases</p>
          <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalTestCases}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-600">Passed Tests</p>
          <p className="text-2xl font-bold text-gray-900">{dashboardStats.passedTests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-600">Avg Pass Rate</p>
          <p className="text-2xl font-bold text-gray-900">{dashboardStats.avgPassRate}%</p>
        </div>
      </div>
    </div>
  );
};

const AIGenerationModal = ({ isOpen, onClose, onGenerate }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">AI Generation</h3>
        <p>AI Generation modal placeholder</p>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const TestManagerPortal = () => {
  const {
    activeTab,
    setActiveTab,
    projects,
    setProjects,
    testCases,
    setTestCases,
    dashboardStats
  } = useTestManager();

  const [showAIModal, setShowAIModal] = useState(false);

  const openAIModal = (taskType) => {
    setShowAIModal(true);
  };

  const openTestRunModal = () => {
    console.log('Open test run modal');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            dashboardStats={dashboardStats}
            testCases={testCases}
            onOpenAIModal={openAIModal}
            onOpenTestRunModal={openTestRunModal}
            onSetActiveTab={setActiveTab}
          />
        );
      default:
        return <div className="text-center py-8">Page content for {activeTab} - To be implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Test Manager Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'projects', label: 'Projects', icon: Target },
              { id: 'testcases', label: 'Test Cases', icon: FileText },
              { id: 'testplans', label: 'Test Plans', icon: FileText },
              { id: 'testruns', label: 'Test Runs', icon: Play },
              { id: 'reports', label: 'Reports', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {renderContent()}
      </div>

      <AIGenerationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={() => {}}
      />
    </div>
  );
};

export default TestManagerPortal;
