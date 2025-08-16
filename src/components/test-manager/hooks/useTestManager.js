import { useState } from 'react';

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

  const [testPlans, setTestPlans] = useState([
    {
      id: 1,
      name: 'Q4 Testing Plan',
      description: 'Comprehensive testing for Q4 release',
      projectId: 1,
      testCases: [1, 2],
      status: 'active',
      createdDate: '2024-08-01',
      strategy: {
        objectives: ['Ensure system stability', 'Validate core functionality', 'Performance benchmarking'],
        scope: 'Full regression testing of core features and new functionality',
        approach: 'Risk-based testing with automated regression suite',
        resources: 'QA team of 3 members, automated testing tools',
        timeline: '2 weeks testing phase',
        deliverables: ['Test execution report', 'Defect analysis', 'Performance metrics']
      }
    }
  ]);

  const [testRuns, setTestRuns] = useState([
    {
      id: 1,
      name: 'Q4 Testing Plan - Run #1',
      testPlanId: 1,
      status: 'completed',
      startDate: '2024-08-01',
      endDate: '2024-08-15',
      executedBy: 'John Doe',
      testCaseResults: [
        { testCaseId: 1, status: 'passed', executedDate: '2024-08-10', notes: 'All validations passed' },
        { testCaseId: 2, status: 'failed', executedDate: '2024-08-11', notes: 'Payment gateway timeout' }
      ],
      totalTests: 2,
      passedTests: 1,
      failedTests: 1,
      skippedTests: 0
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
    testPlans,
    setTestPlans,
    testRuns,
    setTestRuns,
    dashboardStats
  };
};

export default useTestManager;
