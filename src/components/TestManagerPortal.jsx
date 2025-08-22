import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Play, 
  FileText, 
  Target, 
  Bot,
  Zap,
  Eye,
  Edit,
  Trash2,
  Download,
  Settings
} from 'lucide-react';

// Import new components
import Dashboard from './Dashboard';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import TestCaseModal from './modals/TestCaseModal';
import TestExecutionModal from './modals/TestExecutionModal';
import SettingsModal from './modals/SettingsModal';

const TestManagerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [projects, setProjects] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [testPlans, setTestPlans] = useState([]);
  const [testRuns, setTestRuns] = useState([]);

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTask, setAiTask] = useState('project');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [showTestPlanModal, setShowTestPlanModal] = useState(false);
  const [showTestRunModal, setShowTestRunModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewModalData, setViewModalData] = useState(null);
  const [viewModalType, setViewModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'active',
    team: ['']
  });

  const [testCaseForm, setTestCaseForm] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'Medium',
    category: 'Functional',
    steps: []
  });

  const [testPlanForm, setTestPlanForm] = useState({
    name: '',
    description: '',
    projectId: '',
    testCases: [],
    strategy: {
      objectives: [''],
      scope: '',
      approach: '',
      resources: '',
      timeline: '',
      deliverables: ['']
    }
  });

  const [testRunForm, setTestRunForm] = useState({
    name: '',
    description: '',
    testPlanId: '',
    projectId: '',
    executedBy: 'Current User',
    testCaseResults: []
  });

  const [showTestExecutionModal, setShowTestExecutionModal] = useState(false);
  const [executingTestRun, setExecutingTestRun] = useState(null);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Test Manager',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Tester',
      status: 'active'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      role: 'Developer',
      status: 'inactive'
    }
  ]);

  useEffect(() => {
    loadAllData();
  }, []);

  const generateMockData = () => {
    console.log('Starting mock data generation...');
    
    // Generate 8 projects
    const mockProjects = [
      {
        _id: 'proj_1',
        name: 'E-Commerce Platform',
        description: 'Main e-commerce website testing project',
        status: 'active',
        team: ['Alice Johnson', 'Bob Smith', 'Carol Davis']
      },
      {
        _id: 'proj_2',
        name: 'Mobile Banking App',
        description: 'Mobile banking application testing',
        status: 'active',
        team: ['David Wilson', 'Eva Brown', 'Frank Miller']
      },
      {
        _id: 'proj_3',
        name: 'Customer Portal',
        description: 'Customer self-service portal',
        status: 'active',
        team: ['Grace Lee', 'Henry Garcia', 'Ivy Rodriguez']
      },
      {
        _id: 'proj_4',
        name: 'Admin Dashboard',
        description: 'Administrative dashboard and reporting',
        status: 'active',
        team: ['Jack Taylor', 'Kate Anderson', 'Leo Martinez']
      },
      {
        _id: 'proj_5',
        name: 'API Gateway',
        description: 'Backend API testing and validation',
        status: 'active',
        team: ['Maya Patel', 'Noah Thompson', 'Olivia White']
      },
      {
        _id: 'proj_6',
        name: 'Social Media Integration',
        description: 'Social media platform integrations',
        status: 'completed',
        team: ['Paul Harris', 'Quinn Clark', 'Ruby Lewis']
      },
      {
        _id: 'proj_7',
        name: 'Payment Gateway',
        description: 'Payment processing system',
        status: 'active',
        team: ['Sam Walker', 'Tina Hall', 'Uma Young']
      },
      {
        _id: 'proj_8',
        name: 'Notification System',
        description: 'Email and SMS notification service',
        status: 'active',
        team: ['Victor King', 'Wendy Scott', 'Xavier Green']
      }
    ];

    // Generate 35 test cases
    const testCaseTemplates = [
      { title: 'User Registration', description: 'Test user account creation process', category: 'Functional' },
      { title: 'User Login', description: 'Test user authentication and login', category: 'Functional' },
      { title: 'Password Reset', description: 'Test password recovery functionality', category: 'Functional' },
      { title: 'Profile Update', description: 'Test user profile modification', category: 'Functional' },
      { title: 'Product Search', description: 'Test product search functionality', category: 'Functional' },
      { title: 'Shopping Cart Add', description: 'Test adding items to cart', category: 'Functional' },
      { title: 'Shopping Cart Remove', description: 'Test removing items from cart', category: 'Functional' },
      { title: 'Checkout Process', description: 'Test complete checkout workflow', category: 'Functional' },
      { title: 'Payment Processing', description: 'Test payment gateway integration', category: 'Functional' },
      { title: 'Order Confirmation', description: 'Test order confirmation email', category: 'Functional' },
      { title: 'Load Testing Homepage', description: 'Test homepage under high load', category: 'Performance' },
      { title: 'SQL Injection Security', description: 'Test for SQL injection vulnerabilities', category: 'Security' },
      { title: 'Cross-Site Scripting', description: 'Test XSS vulnerability protection', category: 'Security' },
      { title: 'Mobile Responsiveness', description: 'Test mobile device compatibility', category: 'UI/UX' },
      { title: 'Browser Compatibility', description: 'Test across different browsers', category: 'Compatibility' },
      { title: 'API Authentication', description: 'Test API key authentication', category: 'API' },
      { title: 'API Rate Limiting', description: 'Test API rate limiting functionality', category: 'API' },
      { title: 'Database Backup', description: 'Test automated database backup', category: 'System' },
      { title: 'Error Handling', description: 'Test application error handling', category: 'Functional' },
      { title: 'Session Management', description: 'Test user session handling', category: 'Functional' },
      { title: 'File Upload', description: 'Test file upload functionality', category: 'Functional' },
      { title: 'Email Notifications', description: 'Test email notification system', category: 'Integration' },
      { title: 'SMS Notifications', description: 'Test SMS notification delivery', category: 'Integration' },
      { title: 'Social Media Login', description: 'Test OAuth social media login', category: 'Integration' },
      { title: 'Inventory Management', description: 'Test inventory tracking system', category: 'Functional' },
      { title: 'Reporting Dashboard', description: 'Test admin reporting features', category: 'Functional' },
      { title: 'User Permissions', description: 'Test role-based access control', category: 'Security' },
      { title: 'Data Export', description: 'Test data export functionality', category: 'Functional' },
      { title: 'Data Import', description: 'Test bulk data import process', category: 'Functional' },
      { title: 'Currency Conversion', description: 'Test multi-currency support', category: 'Functional' },
      { title: 'Language Localization', description: 'Test multi-language support', category: 'Localization' },
      { title: 'Cache Performance', description: 'Test caching mechanism efficiency', category: 'Performance' },
      { title: 'Memory Usage', description: 'Test application memory consumption', category: 'Performance' },
      { title: 'Network Connectivity', description: 'Test offline/online behavior', category: 'Network' },
      { title: 'Third-party Integration', description: 'Test external service integration', category: 'Integration' }
    ];

    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const statuses = ['pending', 'passed', 'failed'];

    const mockTestCases = testCaseTemplates.map((template, index) => {
      const projectIndex = index % mockProjects.length;
      const project = mockProjects[projectIndex];
      
      return {
        _id: `tc_${index + 1}`,
        title: template.title,
        description: template.description,
        project: project.name,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        category: template.category,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastRun: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        steps: [
          {
            step: `Navigate to ${template.title.toLowerCase()} page`,
            expectedResult: `${template.title} page loads successfully`
          },
          {
            step: `Perform ${template.title.toLowerCase()} action`,
            expectedResult: `${template.title} completes successfully`
          },
          {
            step: `Verify ${template.title.toLowerCase()} result`,
            expectedResult: `Expected ${template.title.toLowerCase()} outcome is displayed`
          }
        ]
      };
    });

    // Generate test plans
    const mockTestPlans = [
      {
        _id: 'tp_1',
        name: 'E-Commerce Regression Test Plan',
        description: 'Comprehensive regression testing for e-commerce platform',
        projectId: 'proj_1',
        status: 'active',
        createdDate: '2024-01-15',
        testCases: mockTestCases.filter(tc => tc.project === 'E-Commerce Platform').slice(0, 4).map(tc => tc._id),
        strategy: {
          objectives: ['Test core e-commerce functionality', 'Ensure payment processing works'],
          scope: 'Full e-commerce workflow testing',
          approach: 'Manual and automated testing combination',
          resources: 'QA team with e-commerce domain knowledge',
          timeline: '3 weeks',
          deliverables: ['Test execution report', 'Bug report', 'Performance metrics']
        }
      },
      {
        _id: 'tp_2',
        name: 'Mobile Banking Security Test Plan',
        description: 'Security focused testing for mobile banking app',
        projectId: 'proj_2',
        status: 'active',
        createdDate: '2024-01-20',
        testCases: mockTestCases.filter(tc => tc.project === 'Mobile Banking App').slice(0, 3).map(tc => tc._id),
        strategy: {
          objectives: ['Validate security measures', 'Test authentication flows'],
          scope: 'Security and authentication testing',
          approach: 'Security-first testing methodology',
          resources: 'Security testing specialists',
          timeline: '2 weeks',
          deliverables: ['Security assessment report', 'Vulnerability analysis']
        }
      }
    ];

    // Generate test runs
    const mockTestRuns = [
      {
        _id: 'tr_1',
        name: 'E-Commerce Sprint 1 Test Run',
        description: 'Testing for sprint 1 e-commerce features',
        projectId: 'proj_1',
        testPlanId: 'tp_1',
        status: 'completed',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        executedBy: 'Alice Johnson',
        totalTests: 4,
        passedTests: 3,
        failedTests: 1,
        skippedTests: 0,
        testCaseResults: mockTestCases.filter(tc => tc.project === 'E-Commerce Platform').slice(0, 4).map((tc, idx) => ({
          testCaseId: tc._id,
          status: idx === 1 ? 'failed' : 'passed',
          executedDate: '2024-02-03',
          notes: idx === 1 ? 'Payment gateway timeout issue' : 'Test completed successfully'
        }))
      },
      {
        _id: 'tr_2',
        name: 'Mobile Banking Security Run',
        description: 'Security testing execution for mobile banking',
        projectId: 'proj_2',
        testPlanId: 'tp_2',
        status: 'in_progress',
        startDate: '2024-02-10',
        endDate: null,
        executedBy: 'David Wilson',
        totalTests: 3,
        passedTests: 2,
        failedTests: 0,
        skippedTests: 0,
        testCaseResults: mockTestCases.filter(tc => tc.project === 'Mobile Banking App').slice(0, 3).map((tc, idx) => ({
          testCaseId: tc._id,
          status: idx < 2 ? 'passed' : 'pending',
          executedDate: idx < 2 ? '2024-02-12' : null,
          notes: idx < 2 ? 'Security test passed' : ''
        }))
      }
    ];

    console.log('Generated data:', {
      projects: mockProjects.length,
      testCases: mockTestCases.length,
      testPlans: mockTestPlans.length,
      testRuns: mockTestRuns.length
    });

    // Save to localStorage for persistence
    try {
      localStorage.setItem('testara_projects', JSON.stringify(mockProjects));
      localStorage.setItem('testara_testCases', JSON.stringify(mockTestCases));
      localStorage.setItem('testara_testPlans', JSON.stringify(mockTestPlans));
      localStorage.setItem('testara_testRuns', JSON.stringify(mockTestRuns));
      console.log('Mock data saved to localStorage successfully');
      
      // Verify localStorage save
      console.log('localStorage verification:', {
        projects: localStorage.getItem('testara_projects') ? JSON.parse(localStorage.getItem('testara_projects')).length : 0,
        testCases: localStorage.getItem('testara_testCases') ? JSON.parse(localStorage.getItem('testara_testCases')).length : 0
      });
      
    } catch (error) {
      console.error('Failed to save mock data to localStorage:', error);
    }

    // Update component state
    setProjects(mockProjects);
    setTestCases(mockTestCases);
    setTestPlans(mockTestPlans);
    setTestRuns(mockTestRuns);
    setError(null);
    setLoading(false);
    
    console.log('Mock data generation complete, state updated');
  };

  const loadAllData = async () => {
    setLoading(true);
    
    try {
      const [projectsData, testCasesData, testPlansData, testRunsData] = await Promise.all([
        ApiService.getProjects(),
        ApiService.getTestCases(),
        ApiService.getTestPlans(),
        ApiService.getTestRuns()
      ]);

      // Check if we have any real data from API
      const hasApiData = (projectsData && projectsData.length > 0) || 
                        (testCasesData && testCasesData.length > 0);

      if (hasApiData) {
        console.log('Loading data from API...');
        setProjects(projectsData || []);
        setTestCases(testCasesData || []);
        setTestPlans(testPlansData || []);
        setTestRuns(testRunsData || []);
        setError(null);
      } else {
        // No API data, check localStorage
        console.log('No API data found, checking localStorage...');
        
        const storedProjects = localStorage.getItem('testara_projects');
        const storedTestCases = localStorage.getItem('testara_testCases');
        const storedTestPlans = localStorage.getItem('testara_testPlans');
        const storedTestRuns = localStorage.getItem('testara_testRuns');

        const hasStoredData = storedProjects && storedTestCases && 
                             JSON.parse(storedProjects).length > 0 && 
                             JSON.parse(storedTestCases).length > 0;

        if (hasStoredData) {
          console.log('Loading data from localStorage...');
          setProjects(JSON.parse(storedProjects));
          setTestCases(JSON.parse(storedTestCases));
          setTestPlans(storedTestPlans ? JSON.parse(storedTestPlans) : []);
          setTestRuns(storedTestRuns ? JSON.parse(storedTestRuns) : []);
          setError(null);
        } else {
          console.log('No data found anywhere, generating mock data...');
          generateMockData();
          return; // generateMockData sets loading to false
        }
      }
    } catch (err) {
      console.error('Error loading data from API:', err);
      
      // API failed, try localStorage as fallback
      try {
        const storedProjects = localStorage.getItem('testara_projects');
        const storedTestCases = localStorage.getItem('testara_testCases');
        
        const hasStoredData = storedProjects && storedTestCases && 
                             JSON.parse(storedProjects).length > 0 && 
                             JSON.parse(storedTestCases).length > 0;
        
        if (hasStoredData) {
          console.log('API failed, loading from localStorage...');
          setProjects(JSON.parse(storedProjects));
          setTestCases(JSON.parse(storedTestCases));
          setTestPlans(JSON.parse(localStorage.getItem('testara_testPlans') || '[]'));
          setTestRuns(JSON.parse(localStorage.getItem('testara_testRuns') || '[]'));
          setError(null);
        } else {
          console.log('API and localStorage both empty, generating mock data...');
          generateMockData();
          return; // generateMockData sets loading to false
        }
      } catch (localStorageError) {
        console.error('localStorage also failed:', localStorageError);
        console.log('All data sources failed, generating mock data...');
        generateMockData();
        return; // generateMockData sets loading to false
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectPassRate = (projectId) => {
    // Get all test runs for this project
    const projectTestRuns = (testRuns || []).filter(tr => tr.projectId === projectId);
    
    if (projectTestRuns.length === 0) return 0;
    
    // Calculate average pass rate across all test runs for this project
    const totalPassRates = projectTestRuns.reduce((acc, testRun) => {
      if (testRun.totalTests > 0) {
        const passRate = (testRun.passedTests / testRun.totalTests) * 100;
        return acc + passRate;
      }
      return acc;
    }, 0);
    
    return Math.round(totalPassRates / projectTestRuns.length);
  };

  const calculateProjectTestCaseCount = (projectId) => {
    // Get project name first
    const project = (projects || []).find(p => p._id === projectId);
    if (!project) return 0;
    
    // Count test cases that belong to this project
    return (testCases || []).filter(tc => tc.project === project.name).length;
  };

  const dashboardStats = {
    totalProjects: (projects || []).length,
    totalTestCases: (testCases || []).length,
    passedTests: (testCases || []).filter(tc => tc.status === 'passed').length,
    failedTests: (testCases || []).filter(tc => tc.status === 'failed').length,
    avgPassRate: (projects || []).length > 0 ? 
      Math.round((projects || []).reduce((acc, p) => acc + calculateProjectPassRate(p._id), 0) / (projects || []).length) : 0
  };

  const handleCreateProject = () => {
    console.log('Create project clicked'); // Debug log
    setProjectForm({
      name: '',
      description: '',
      status: 'active',
      team: ['']
    });
    setShowProjectModal(true);
  };

  const handleCreateTestCase = () => {
    console.log('Create test case clicked');
    setTestCaseForm({
      title: '',
      description: '',
      project: (projects || []).length > 0 ? (projects || [])[0].name : '',
      priority: 'Medium',
      category: 'Functional',
      steps: []
    });
    setShowTestCaseModal(true);
  };

  const handleCreateTestPlan = () => {
    console.log('Create test plan clicked');
    setTestPlanForm({
      name: '',
      description: '',
      projectId: (projects || []).length > 0 ? (projects || [])[0]._id : '',
      testCases: [],
      strategy: {
        objectives: [''],
        scope: '',
        approach: '',
        resources: '',
        timeline: '',
        deliverables: ['']
      }
    });
    setShowTestPlanModal(true);
  };

  const handleCreateTestRun = () => {
    console.log('Create test run clicked');
    setTestRunForm({
      name: '',
      description: '',
      testPlanId: (testPlans || []).length > 0 ? (testPlans || [])[0]._id : '',
      projectId: (projects || []).length > 0 ? (projects || [])[0]._id : '',
      executedBy: 'Current User',
      testCaseResults: []
    });
    setShowTestRunModal(true);
  };

  const handleExportReport = () => {
    console.log('Export report clicked'); // Debug log
    const reportData = {
      dashboardStats,
      projects,
      testCases,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-manager-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Add view/edit/delete handlers
  const handleViewItem = (item, type) => {
    console.log('View item clicked:', type, item);
    setViewModalData(item);
    setViewModalType(type);
    setShowViewModal(true);
  };

  const handleEditItem = (item, type) => {
    console.log('Edit item clicked:', type, item);
    setEditingItem(item);
    
    if (type === 'project') {
      setProjectForm({
        name: item.name,
        description: item.description,
        status: item.status,
        team: item.team || ['']
      });
      setShowProjectModal(true);
    } else if (type === 'testcase') {
      setTestCaseForm({
        title: item.title,
        description: item.description || '',
        project: item.project,
        priority: item.priority,
        category: item.category || 'Functional',
        steps: item.steps || []
      });
      setShowTestCaseModal(true);
    } else if (type === 'testplan') {
      setTestPlanForm({
        name: item.name,
        description: item.description,
        projectId: item.projectId,
        testCases: item.testCases || [],
        strategy: item.strategy || {
          objectives: [''],
          scope: '',
          approach: '',
          resources: '',
          timeline: '',
          deliverables: ['']
        }
      });
      setShowTestPlanModal(true);
    } else if (type === 'testrun') {
      setTestRunForm({
        name: item.name,
        description: item.description || '',
        testPlanId: item.testPlanId || '',
        projectId: item.projectId,
        executedBy: item.executedBy
      });
      setShowTestRunModal(true);
    }
  };

  const handleDeleteItem = async (item, type) => {
    console.log('Delete item clicked:', type, item);
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'project') {
          const updatedProjects = (projects || []).filter(p => p._id !== item._id);
          setProjects(updatedProjects);
          localStorage.setItem('testara_projects', JSON.stringify(updatedProjects));
        } else if (type === 'testcase') {
          const updatedTestCases = (testCases || []).filter(tc => tc._id !== item._id);
          setTestCases(updatedTestCases);
          localStorage.setItem('testara_testCases', JSON.stringify(updatedTestCases));
        } else if (type === 'testplan') {
          const updatedTestPlans = (testPlans || []).filter(tp => tp._id !== item._id);
          setTestPlans(updatedTestPlans);
          localStorage.setItem('testara_testPlans', JSON.stringify(updatedTestPlans));
        } else if (type === 'testrun') {
          const updatedTestRuns = (testRuns || []).filter(tr => tr._id !== item._id);
          setTestRuns(updatedTestRuns);
          localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
        }
      } catch (err) {
        setError(`Failed to delete ${type}: ` + err.message);
      }
    }
  };

  const handleProjectSubmit = async () => {
    if (!projectForm.name.trim()) return;

    try {
      const projectData = {
        ...projectForm,
        team: (projectForm.team || []).filter(member => member.trim() !== '')
      };

      let updatedProjects;
      if (editingItem) {
        const updatedProject = { ...projectData, _id: editingItem._id };
        updatedProjects = (projects || []).map(p => p._id === editingItem._id ? updatedProject : p);
        setEditingItem(null);
      } else {
        const newProject = { ...projectData, _id: Date.now().toString() };
        updatedProjects = [...(projects || []), newProject];
      }
      
      setProjects(updatedProjects);
      localStorage.setItem('testara_projects', JSON.stringify(updatedProjects));
      setShowProjectModal(false);
      
      setProjectForm({
        name: '',
        description: '',
        status: 'active',
        team: ['']
      });
    } catch (err) {
      setError('Failed to save project: ' + err.message);
    }
  };

  const handleTestCaseSubmit = async () => {
    if (!testCaseForm.title.trim()) return;

    try {
      let updatedTestCases;
      if (editingItem) {
        const updatedTestCase = { ...testCaseForm, _id: editingItem._id };
        updatedTestCases = (testCases || []).map(tc => tc._id === editingItem._id ? updatedTestCase : tc);
        setEditingItem(null);
      } else {
        const newTestCase = { ...testCaseForm, _id: Date.now().toString() };
        updatedTestCases = [...(testCases || []), newTestCase];
      }
      
      setTestCases(updatedTestCases);
      localStorage.setItem('testara_testCases', JSON.stringify(updatedTestCases));
      setShowTestCaseModal(false);
      
      setTestCaseForm({
        title: '',
        description: '',
        project: (projects || []).length > 0 ? (projects || [])[0].name : '',
        priority: 'Medium',
        category: 'Functional',
        steps: []
      });
    } catch (err) {
      setError('Failed to save test case: ' + err.message);
    }
  };

  const handleTestPlanSubmit = async () => {
    if (!testPlanForm.name.trim()) return;

    try {
      const testPlanData = {
        ...testPlanForm,
        status: editingItem ? editingItem.status : 'active',
        createdDate: editingItem ? editingItem.createdDate : new Date().toISOString().split('T')[0],
        strategy: {
          ...testPlanForm.strategy,
          objectives: (testPlanForm.strategy.objectives || []).filter(obj => obj.trim() !== ''),
          deliverables: (testPlanForm.strategy.deliverables || []).filter(del => del.trim() !== '')
        }
      };

      let updatedTestPlans;
      if (editingItem) {
        const updatedTestPlan = { ...testPlanData, _id: editingItem._id };
        updatedTestPlans = (testPlans || []).map(tp => tp._id === editingItem._id ? updatedTestPlan : tp);
        setEditingItem(null);
      } else {
        const newTestPlan = { ...testPlanData, _id: Date.now().toString() };
        updatedTestPlans = [...(testPlans || []), newTestPlan];
      }
      
      setTestPlans(updatedTestPlans);
      localStorage.setItem('testara_testPlans', JSON.stringify(updatedTestPlans));
      setShowTestPlanModal(false);
      
      setTestPlanForm({
        name: '',
        description: '',
        projectId: (projects || []).length > 0 ? (projects || [])[0]._id : '',
        testCases: [],
        strategy: {
          objectives: [''],
          scope: '',
          approach: '',
          resources: '',
          timeline: '',
          deliverables: ['']
        }
      });
    } catch (err) {
      setError('Failed to save test plan: ' + err.message);
    }
  };

  const handleTestRunSubmit = async () => {
    if (!testRunForm.name.trim()) return;

    try {
      let selectedTestCases = [];
      
      if (testRunForm.testPlanId) {
        // If a test plan is selected, get test cases from the test plan
        const selectedTestPlan = (testPlans || []).find(tp => tp._id === testRunForm.testPlanId);
        if (selectedTestPlan) {
          selectedTestCases = (selectedTestPlan.testCases || []);
        }
      } else {
        // If no test plan selected, get all test cases for the project
        const projectTestCases = (testCases || []).filter(tc => {
          const project = (projects || []).find(p => p._id === testRunForm.projectId);
          return project ? tc.project === project.name : false;
        });
        selectedTestCases = projectTestCases.map(tc => tc._id);
      }

      const testRunData = {
        ...testRunForm,
        status: editingItem ? editingItem.status : 'pending',
        startDate: editingItem ? editingItem.startDate : new Date().toISOString().split('T')[0],
        testCaseResults: selectedTestCases.map(tcId => {
          const testCase = (testCases || []).find(tc => tc._id === tcId);
          return {
            testCaseId: tcId,
            status: 'pending',
            executedDate: null,
            notes: '',
            stepResults: testCase?.steps?.map(() => ({
              status: 'pending',
              actualResult: '',
              notes: ''
            })) || []
          };
        }),
        totalTests: selectedTestCases.length,
        passedTests: editingItem ? editingItem.passedTests : 0,
        failedTests: editingItem ? editingItem.failedTests : 0,
        skippedTests: editingItem ? editingItem.skippedTests : 0
      };

      let updatedTestRuns;
      if (editingItem) {
        const updatedTestRun = { ...testRunData, _id: editingItem._id };
        updatedTestRuns = (testRuns || []).map(tr => tr._id === updatedTestRun._id ? updatedTestRun : tr);
        setEditingItem(null);
      } else {
        const newTestRun = { ...testRunData, _id: Date.now().toString() };
        updatedTestRuns = [...(testRuns || []), newTestRun];
      }
      
      setTestRuns(updatedTestRuns);
      localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
      setShowTestRunModal(false);
      
      setTestRunForm({
        name: '',
        description: '',
        testPlanId: (testPlans || []).length > 0 ? (testPlans || [])[0]._id : '',
        projectId: (projects || []).length > 0 ? (projects || [])[0]._id : '',
        executedBy: 'Current User',
        testCaseResults: []
      });
    } catch (err) {
      setError('Failed to save test run: ' + err.message);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const capitalizeWords = (str) => {
      return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };
    
    if (aiTask === 'project') {
      const newProject = {
        _id: Date.now().toString(),
        name: capitalizeWords(aiPrompt),
        description: `AI-generated testing project for ${aiPrompt}`,
        status: 'active',
        testCases: Math.floor(Math.random() * 20) + 5,
        passRate: Math.floor(Math.random() * 40) + 60,
        lastRun: new Date().toISOString().split('T')[0],
        team: ['AI Assistant', 'Test Lead']
      };
      const updatedProjects = [...(projects || []), newProject];
      setProjects(updatedProjects);
      localStorage.setItem('testara_projects', JSON.stringify(updatedProjects));
    } else if (aiTask === 'testcase') {
      const newTestCase = {
        _id: Date.now().toString(),
        title: capitalizeWords(aiPrompt),
        project: (projects || []).length > 0 ? (projects || [])[0].name : 'Default Project',
        priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        status: 'pending',
        lastRun: new Date().toISOString().split('T')[0],
        description: `AI-generated test case for ${aiPrompt} functionality`,
        category: 'Functional',
        steps: [
          {
            step: `Open the ${aiPrompt} module`,
            expectedResult: `${aiPrompt} module loads successfully`
          },
          {
            step: `Navigate to ${aiPrompt} functionality`,
            expectedResult: `${aiPrompt} interface is displayed correctly`
          },
          {
            step: `Execute ${aiPrompt} action`,
            expectedResult: `${aiPrompt} performs as expected`
          },
          {
            step: `Verify ${aiPrompt} results`,
            expectedResult: `Results are accurate and properly displayed`
          }
        ]
      };
      const updatedTestCases = [...(testCases || []), newTestCase];
      setTestCases(updatedTestCases);
      localStorage.setItem('testara_testCases', JSON.stringify(updatedTestCases));
    } else if (aiTask === 'testplan') {
      const newTestPlan = {
        _id: Date.now().toString(),
        name: capitalizeWords(aiPrompt) + ' Test Plan',
        description: `AI-generated test plan for ${aiPrompt} testing`,
        projectId: (projects || []).length > 0 ? (projects || [])[0]._id : 'default',
        testCases: (testCases || []).slice(0, Math.min(3, (testCases || []).length)).map(tc => tc._id),
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        strategy: {
          objectives: [`Test ${aiPrompt} functionality`, 'Ensure system stability'],
          scope: `Comprehensive testing coverage for ${aiPrompt}`,
          approach: 'Risk-based testing approach with automated execution',
          resources: 'QA team with automated testing tools',
          timeline: '2-3 weeks testing phase',
          deliverables: ['Test execution report', 'Defect analysis', 'Coverage documentation']
        }
      };
      const updatedTestPlans = [...(testPlans || []), newTestPlan];
      setTestPlans(updatedTestPlans);
      localStorage.setItem('testara_testPlans', JSON.stringify(updatedTestPlans));
    } else if (aiTask === 'testrun') {
      const selectedProject = (projects || []).length > 0 ? (projects || [])[0] : null;
      const availableTestCases = (testCases || []).filter(tc => 
        selectedProject ? tc.project === selectedProject.name : true
      );
      
      const selectedTestCaseIds = availableTestCases
        .slice(0, Math.min(Math.floor(Math.random() * 3) + 2, availableTestCases.length))
        .map(tc => tc._id);

      const newTestRun = {
        _id: Date.now().toString(),
        name: `${capitalizeWords(aiPrompt)} - Test Run`,
        description: `AI-generated test run for ${aiPrompt} testing`,
        testPlanId: null,
        projectId: selectedProject?._id || 'default',
        status: 'in_progress',
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        executedBy: 'AI Assistant',
        testCaseResults: selectedTestCaseIds.map(tcId => ({
          testCaseId: tcId,
          status: 'pending',
          executedDate: null,
          notes: ''
        })),
        totalTests: selectedTestCaseIds.length,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0
      };
      const updatedTestRuns = [...(testRuns || []), newTestRun];
      setTestRuns(updatedTestRuns);
      localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
    }
    
    setIsGenerating(false);
    setShowAIModal(false);
    setAiPrompt('');
  };

  const handleRunTest = (testCase) => {
    console.log('Run test clicked:', testCase);
    // Simulate running a test
    const updatedTestCases = (testCases || []).map(tc => {
      if (tc._id === testCase._id) {
        return {
          ...tc,
          status: Math.random() > 0.5 ? 'passed' : 'failed',
          lastRun: new Date().toISOString().split('T')[0]
        };
      }
      return tc;
    });
    setTestCases(updatedTestCases);
    localStorage.setItem('testara_testCases', JSON.stringify(updatedTestCases));
  };

  const handleExecuteTestPlan = (testPlan) => {
    console.log('Execute test plan clicked:', testPlan);
    // Create a new test run from the test plan
    const planTestCases = (testPlan.testCases || []);
    const newTestRun = {
      _id: `${Date.now()}`,
      name: `${testPlan.name} - Auto Run`,
      description: `Automated execution of ${testPlan.name}`,
      testPlanId: testPlan._id,
      projectId: testPlan.projectId,
      status: 'pending',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      executedBy: 'Auto Executor',
      testCaseResults: planTestCases.map(tcId => {
        const testCase = (testCases || []).find(tc => tc._id === tcId);
        return {
          testCaseId: tcId,
          status: 'pending',
          executedDate: null,
          notes: '',
          stepResults: testCase?.steps?.map(() => ({
            status: 'pending',
            actualResult: '',
            notes: ''
          })) || []
        };
      }),
      totalTests: planTestCases.length,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0
    };
    const updatedTestRuns = [...(testRuns || []), newTestRun];
    setTestRuns(updatedTestRuns);
    localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
    alert('Test plan execution started! Check Test Runs tab.');
  };

  // Add functions to manage test steps
  const addTestStep = () => {
    setTestCaseForm({
      ...testCaseForm,
      steps: [...(testCaseForm.steps || []), { step: '', expectedResult: '' }]
    });
  };

  const updateTestStep = (index, field, value) => {
    const updatedSteps = (testCaseForm.steps || []).map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    );
    setTestCaseForm({
      ...testCaseForm,
      steps: updatedSteps
    });
  };

  const removeTestStep = (index) => {
    const updatedSteps = (testCaseForm.steps || []).filter((_, i) => i !== index);
    setTestCaseForm({
      ...testCaseForm,
      steps: updatedSteps
    });
  };

  // Add test execution handlers
  const handleExecuteTestRun = (testRun) => {
    console.log('Execute test run clicked:', testRun);
    setExecutingTestRun(testRun);
    setShowTestExecutionModal(true);
  };

  const handleUpdateTestResult = (testCaseId, status, notes = '') => {
    if (!executingTestRun) return;

    const updatedTestRun = {
      ...executingTestRun,
      testCaseResults: executingTestRun.testCaseResults.map(result => 
        result.testCaseId === testCaseId 
          ? { 
              ...result, 
              status, 
              notes, 
              executedDate: new Date().toISOString().split('T')[0]
            }
          : result
      )
    };

    // Update counts
    const passed = updatedTestRun.testCaseResults.filter(r => r.status === 'passed').length;
    const failed = updatedTestRun.testCaseResults.filter(r => r.status === 'failed').length;
    const skipped = updatedTestRun.testCaseResults.filter(r => r.status === 'skipped').length;
    const pending = updatedTestRun.testCaseResults.filter(r => r.status === 'pending').length;

    updatedTestRun.passedTests = passed;
    updatedTestRun.failedTests = failed;
    updatedTestRun.skippedTests = skipped;

    // Update status based on completion
    if (pending === 0) {
      updatedTestRun.status = 'completed';
      updatedTestRun.endDate = new Date().toISOString().split('T')[0];
    } else {
      updatedTestRun.status = 'in_progress';
    }

    setExecutingTestRun(updatedTestRun);
    const updatedTestRuns = (testRuns || []).map(tr => tr._id === updatedTestRun._id ? updatedTestRun : tr);
    setTestRuns(updatedTestRuns);
    localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
  };

  // User management handlers
  const handleAddUser = (userData) => {
    setUsers([...users, userData]);
  };

  const handleUpdateUser = (userId, userData) => {
    setUsers(users.map(user => user.id === userId ? userData : user));
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAIModal(true); setAiTask('project'); }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            AI Generate
          </button>
          <button 
            onClick={handleCreateProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(projects || []).map(project => {
          const calculatedPassRate = calculateProjectPassRate(project._id);
          const calculatedTestCaseCount = calculateProjectTestCaseCount(project._id);
          const projectTestRuns = (testRuns || []).filter(tr => tr.projectId === project._id);
          const lastTestRun = projectTestRuns.length > 0 ? 
            projectTestRuns.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0] : null;
          
          return (
            <div key={project._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                </div>
                <StatusBadge status={project.status || 'active'} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Test Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{calculatedTestCaseCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-600">{calculatedPassRate}%</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Team Members</p>
                <div className="flex gap-2">
                  {(project.team || []).map((member, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Last run: {lastTestRun ? lastTestRun.startDate : 'Never'}
                </p>
                <div className="flex gap-2">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleViewItem(project, 'project')}
                    title="View Project"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => handleEditItem(project, 'project')}
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteItem(project, 'project')}
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {(!projects || projects.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Created</h3>
          <p className="text-gray-600 mb-6">Create your first project to get started</p>
          <button
            onClick={handleCreateProject}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create Project
          </button>
        </div>
      )}
    </div>
  );

  const renderTestCases = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Test Cases</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAIModal(true); setAiTask('testcase'); }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            AI Generate
          </button>
          <button 
            onClick={handleCreateTestCase}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Test Case
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(testCases || []).map(testCase => (
                <tr key={testCase._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{testCase.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{testCase.project}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={testCase.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={testCase.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex gap-2">
                      <button 
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleRunTest(testCase)}
                        title="Run Test"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewItem(testCase, 'testcase')}
                        title="View Test Case"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => handleEditItem(testCase, 'testcase')}
                        title="Edit Test Case"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {(!testCases || testCases.length === 0) && (
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
  );

  const renderTestPlans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Test Plans</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAIModal(true); setAiTask('testplan'); }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            AI Generate
          </button>
          <button 
            onClick={handleCreateTestPlan}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Test Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(testPlans || []).map(testPlan => {
          const project = (projects || []).find(p => p._id === testPlan.projectId);
          const planTestCases = (testCases || []).filter(tc => (testPlan.testCases || []).includes(tc._id));
          
          return (
            <div key={testPlan._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testPlan.name}</h3>
                  <p className="text-gray-600 mt-1">{testPlan.description}</p>
                </div>
                <StatusBadge status={testPlan.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Project</p>
                  <p className="text-base font-medium text-gray-900">{project?.name || 'Unknown Project'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Test Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{(testPlan.testCases || []).length}</p>
                </div>
              </div>

              {planTestCases.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Included Test Cases</p>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {planTestCases.slice(0, 3).map(tc => (
                      <div key={tc._id} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                        <span className="text-gray-700 truncate">{tc.title}</span>
                        <PriorityBadge priority={tc.priority} />
                      </div>
                    ))}
                    {planTestCases.length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{planTestCases.length - 3} more test cases
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Created: {testPlan.createdDate}</p>
                <div className="flex gap-2">
                  <button 
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                    onClick={() => handleExecuteTestPlan(testPlan)}
                    title="Execute Test Plan"
                  >
                    <Play className="w-3 h-3" />
                    Execute
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleViewItem(testPlan, 'testplan')}
                    title="View Test Plan"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => handleEditItem(testPlan, 'testplan')}
                    title="Edit Test Plan"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteItem(testPlan, 'testplan')}
                    title="Delete Test Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {testPlans.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Plans Created</h3>
          <p className="text-gray-600 mb-6">Create your first test plan to organize and execute test cases</p>
          <button
            onClick={handleCreateTestPlan}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create Test Plan
          </button>
        </div>
      )}
    </div>
  );

  const renderTestRuns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Test Runs</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAIModal(true); setAiTask('testrun'); }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            AI Generate
          </button>
          <button 
            onClick={handleCreateTestRun}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Test Run
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(testRuns || []).map(testRun => {
          const testPlan = (testPlans || []).find(tp => tp._id === testRun.testPlanId);
          const project = (projects || []).find(p => p._id === testRun.projectId);
          const passRate = testRun.totalTests > 0 ? Math.round((testRun.passedTests / testRun.totalTests) * 100) : 0;
          
          return (
            <div key={testRun._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testRun.name}</h3>
                  <p className="text-gray-600 mt-1">
                    {testPlan ? `${testPlan.name} • ` : ''}{project?.name || 'Unknown Project'}
                  </p>
                  {testRun.description && (
                    <p className="text-sm text-gray-500 mt-1">{testRun.description}</p>
                  )}
                </div>
                <StatusBadge status={testRun.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${((testRun.passedTests + testRun.failedTests + testRun.skippedTests) / testRun.totalTests) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {testRun.passedTests + testRun.failedTests + testRun.skippedTests}/{testRun.totalTests}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-600">{passRate}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-lg font-bold text-green-600">{testRun.passedTests}</p>
                  <p className="text-xs text-green-600">Passed</p>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <p className="text-lg font-bold text-red-600">{testRun.failedTests}</p>
                  <p className="text-xs text-red-600">Failed</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <p className="text-lg font-bold text-yellow-600">{testRun.skippedTests}</p>
                  <p className="text-xs text-yellow-600">Skipped</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>Started: {testRun.startDate}</span>
                {testRun.endDate && <span>Completed: {testRun.endDate}</span>}
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Executed by: {testRun.executedBy}</p>
                <div className="flex gap-2">
                  <button 
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                    onClick={() => handleExecuteTestRun(testRun)}
                    title="Execute Tests"
                  >
                    <Play className="w-3 h-3" />
                    Execute
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-800" 
                    title="View Details"
                    onClick={() => handleViewItem(testRun, 'testrun')}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-800" 
                    title="Edit Test Run"
                    onClick={() => handleEditItem(testRun, 'testrun')}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800" 
                    title="Delete Test Run"
                    onClick={() => handleDeleteItem(testRun, 'testrun')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {testRuns.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Runs Yet</h3>
          <p className="text-gray-600 mb-6">Create your first test run to start executing tests</p>
          <button
            onClick={handleCreateTestRun}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create Test Run
          </button>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <button 
          onClick={handleExportReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Test Execution Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Test Runs</span>
              <span className="text-lg font-bold text-gray-900">{(testRuns || []).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed Runs</span>
              <span className="text-lg font-bold text-green-600">
                {(testRuns || []).filter(tr => tr.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-lg font-bold text-yellow-600">
                {(testRuns || []).filter(tr => tr.status === 'in_progress').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Pass Rate</span>
              <span className="text-lg font-bold text-blue-600">
                {(testRuns || []).length > 0 
                  ? Math.round((testRuns || []).reduce((acc, tr) => acc + (tr.totalTests > 0 ? (tr.passedTests / tr.totalTests) * 100 : 0), 0) / (testRuns || []).length)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Test Case Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Passed Tests</span>
              <span className="text-sm font-medium text-green-600">{dashboardStats.passedTests}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${dashboardStats.totalTestCases > 0 ? (dashboardStats.passedTests / dashboardStats.totalTestCases) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Failed Tests</span>
              <span className="text-sm font-medium text-red-600">{dashboardStats.failedTests}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${dashboardStats.totalTestCases > 0 ? (dashboardStats.failedTests / dashboardStats.totalTestCases) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Tests</span>
              <span className="text-sm font-medium text-yellow-600">
                {(testCases || []).filter(tc => tc.status === 'pending').length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${dashboardStats.totalTestCases > 0 ? ((testCases || []).filter(tc => tc.status === 'pending').length / dashboardStats.totalTestCases) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Project Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Project</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Test Plans</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Test Runs</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Pass Rate</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(projects || []).map(project => {
                  const projectTestPlans = (testPlans || []).filter(tp => tp.projectId === project._id);
                  const projectTestRuns = (testRuns || []).filter(tr => tr.projectId === project._id);
                  const calculatedPassRate = calculateProjectPassRate(project._id);
                  
                  return (
                    <tr key={project._id}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{project.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{projectTestPlans.length}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{projectTestRuns.length}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{calculatedPassRate}%</td>
                      <td className="px-4 py-2"><StatusBadge status={project.status || 'active'} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {(!projects || projects.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No projects to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Add a debug section to see the current state
  console.log('Modal states:', {
    showAIModal,
    showProjectModal,
    showTestCaseModal,
    showTestPlanModal,
    showTestRunModal
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold mb-2">Error Loading Data</h3>
            <p className="text-sm">{error}</p>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <p>Application is running in localStorage mode.</p>
          </div>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={loadAllData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry Loading
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                generateMockData();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Generate Mock Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add inline style to override text centering
  const leftAlignStyle = {
    textAlign: 'left'
  };

  return (
    <div className="min-h-screen bg-gray-50" style={leftAlignStyle}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Test Manager Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab('testcases')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'testcases' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Test Cases
            </button>
            <button 
              onClick={() => setActiveTab('testplans')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'testplans' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Test Plans
            </button>
            <button 
              onClick={() => setActiveTab('testruns')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'testruns' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Test Runs
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Reports
            </button>
          </div>
        </div>

        {/* Use new Dashboard component */}
        {activeTab === 'dashboard' && (
          <Dashboard
            dashboardStats={dashboardStats}
            projects={projects}
            testCases={testCases}
            testRuns={testRuns}
            testPlans={testPlans}
            setActiveTab={setActiveTab}
            handleCreateProject={handleCreateProject}
            handleCreateTestCase={handleCreateTestCase}
            handleRunTest={handleRunTest}
            setShowAIModal={setShowAIModal}
            setAiTask={setAiTask}
            calculateProjectPassRate={calculateProjectPassRate}
            calculateProjectTestCaseCount={calculateProjectTestCaseCount}
            onGenerateTestData={generateMockData}
          />
        )}
        
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'testcases' && renderTestCases()}
        {activeTab === 'testplans' && renderTestPlans()}
        {activeTab === 'testruns' && renderTestRuns()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" style={leftAlignStyle}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={leftAlignStyle}>
              <Bot className="w-5 h-5 text-purple-600" />
              AI Generation
            </h3>
            
            <div className="mb-4" style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Generate Type</label>
              <select
                value={aiTask}
                onChange={(e) => setAiTask(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={leftAlignStyle}
              >
                <option value="project" style={leftAlignStyle}>Project</option>
                <option value="testcase" style={leftAlignStyle}>Test Case</option>
                <option value="testplan" style={leftAlignStyle}>Test Plan</option>
                <option value="testrun" style={leftAlignStyle}>Test Run</option>
              </select>
            </div>
            
            <div className="mb-4" style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Description</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., User authentication system, Shopping cart functionality..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                style={leftAlignStyle}
              />
            </div>
            
            <div className="flex justify-end gap-3" style={leftAlignStyle}>
              <button
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isGenerating}
                style={leftAlignStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || isGenerating}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                style={leftAlignStyle}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" style={leftAlignStyle}>
            <h3 className="text-lg font-semibold mb-4" style={leftAlignStyle}>
              {editingItem ? 'Edit Project' : 'Create New Project'}
            </h3>
            
            <div className="space-y-4" style={leftAlignStyle}>
              <div style={leftAlignStyle}>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Project Name</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  style={leftAlignStyle}
                />
              </div>

              <div style={leftAlignStyle}>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the project"
                  rows="3"
                  style={leftAlignStyle}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6" style={leftAlignStyle}>
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                style={leftAlignStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleProjectSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                style={leftAlignStyle}
              >
                {editingItem ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use new TestCaseModal component */}
      <TestCaseModal
        show={showTestCaseModal}
        onClose={() => {
          setShowTestCaseModal(false);
          setEditingItem(null);
        }}
        testCaseForm={testCaseForm}
        setTestCaseForm={setTestCaseForm}
        projects={projects}
        editingItem={editingItem}
        onSubmit={handleTestCaseSubmit}
        addTestStep={addTestStep}
        updateTestStep={updateTestStep}
        removeTestStep={removeTestStep}
      />

      {/* Test Plan Modal */}
      {showTestPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl" style={leftAlignStyle}>
            <h3 className="text-lg font-semibold mb-4" style={leftAlignStyle}>
              {editingItem ? 'Edit Test Plan' : 'Create New Test Plan'}
            </h3>
            
            <div className="space-y-4" style={leftAlignStyle}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={leftAlignStyle}>
                <div style={leftAlignStyle}>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Test Plan Name</label>
                  <input
                    type="text"
                    value={testPlanForm.name}
                    onChange={(e) => setTestPlanForm({...testPlanForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter test plan name"
                    style={leftAlignStyle}
                  />
                </div>

                <div style={leftAlignStyle}>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Project</label>
                  <select
                    value={testPlanForm.projectId}
                    onChange={(e) => setTestPlanForm({...testPlanForm, projectId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={leftAlignStyle}
                  >
                    {(projects || []).map(project => (
                      <option key={project._id} value={project._id} style={leftAlignStyle}>{project.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={leftAlignStyle}>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Description</label>
                <textarea
                  value={testPlanForm.description}
                  onChange={(e) => setTestPlanForm({...testPlanForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the test plan"
                  rows="3"
                  style={leftAlignStyle}
                />
              </div>

              <div style={leftAlignStyle}>
                <label className="block text-sm font-medium text-gray-700 mb-3" style={leftAlignStyle}>Select Test Cases</label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2" style={leftAlignStyle}>
                  {(testCases || []).map(testCase => (
                    <label key={testCase._id} className="flex items-center space-x-2" style={leftAlignStyle}>
                      <input
                        type="checkbox"
                        checked={testPlanForm.testCases.includes(testCase._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTestPlanForm({
                              ...testPlanForm,
                              testCases: [...testPlanForm.testCases, testCase._id]
                            });
                          } else {
                            setTestPlanForm({
                              ...testPlanForm,
                              testCases: testPlanForm.testCases.filter(id => id !== testCase._id)
                            });
                          }
                        }}
                        className="rounded"
                        style={leftAlignStyle}
                      />
                      <span className="text-sm" style={leftAlignStyle}>{testCase.title}</span>
                      <PriorityBadge priority={testCase.priority} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6" style={leftAlignStyle}>
              <button
                onClick={() => {
                  setShowTestPlanModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                style={leftAlignStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleTestPlanSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                style={leftAlignStyle}
              >
                {editingItem ? 'Update Test Plan' : 'Create Test Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Run Modal */}
      {showTestRunModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl" style={leftAlignStyle}>
            <h3 className="text-lg font-semibold mb-4" style={leftAlignStyle}>Create New Test Run</h3>
            
            <div className="space-y-4" style={leftAlignStyle}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={leftAlignStyle}>
                <div style={leftAlignStyle}>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Test Run Name</label>
                  <input
                    type="text"
                    value={testRunForm.name}
                    onChange={(e) => setTestRunForm({...testRunForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter test run name"
                    style={leftAlignStyle}
                  />
                </div>

                <div style={leftAlignStyle}>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Executed By</label>
                  <input
                    type="text"
                    value={testRunForm.executedBy}
                    onChange={(e) => setTestRunForm({...testRunForm, executedBy: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter executor name"
                    style={leftAlignStyle}
                  />
                </div>
              </div>

              <div style={leftAlignStyle}>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Description</label>
                <textarea
                  value={testRunForm.description}
                  onChange={(e) => setTestRunForm({...testRunForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the test run (optional)"
                  rows="3"
                  style={leftAlignStyle}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={leftAlignStyle}>
                <div style={leftAlignStyle}>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Project</label>
                  <select
                    value={testRunForm.projectId}
                    onChange={(e) => setTestRunForm({...testRunForm, projectId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={leftAlignStyle}
                  >
                    {(projects || []).map(project => (
                      <option key={project._id} value={project._id} style={leftAlignStyle}>{project.name}</option>
                    ))}
                  </select>
                </div>

                <div style={leftAlignStyle}>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={leftAlignStyle}>Test Plan (Optional)</label>
                  <select
                    value={testRunForm.testPlanId}
                    onChange={(e) => setTestRunForm({...testRunForm, testPlanId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={leftAlignStyle}
                  >
                    <option value="" style={leftAlignStyle}>No Test Plan (Manual Selection)</option>
                    {(testPlans || [])
                      .filter(tp => tp.projectId == testRunForm.projectId)
                      .map(testPlan => (
                        <option key={testPlan._id} value={testPlan._id} style={leftAlignStyle}>{testPlan.name}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6" style={leftAlignStyle}>
              <button
                onClick={() => {
                  setShowTestRunModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                style={leftAlignStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleTestRunSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                style={leftAlignStyle}
              >
                Create Test Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={leftAlignStyle}>
            <div className="flex justify-between items-center mb-4" style={leftAlignStyle}>
              <h3 className="text-lg font-semibold" style={leftAlignStyle}>
                {viewModalType === 'project' && `Project: ${viewModalData.name}`}
                {viewModalType === 'testcase' && `Test Case: ${viewModalData.title}`}
                {viewModalType === 'testplan' && `Test Plan: ${viewModalData.name}`}
                {viewModalType === 'testrun' && `Test Run: ${viewModalData.name}`}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
                style={leftAlignStyle}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4" style={leftAlignStyle}>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto" style={leftAlignStyle}>
                {JSON.stringify(viewModalData, null, 2)}
              </pre>
            </div>
            
            <div className="flex justify-end mt-6" style={leftAlignStyle}>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                style={leftAlignStyle}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use new TestExecutionModal component */}
      <TestExecutionModal
        show={showTestExecutionModal}
        onClose={() => setShowTestExecutionModal(false)}
        executingTestRun={executingTestRun}
        testCases={testCases}
        handleUpdateTestResult={handleUpdateTestResult}
      />

      {/* Settings Modal */}
      <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        users={users}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onGenerateMockData={generateMockData}
      />
    </div>
  );
};

export default TestManagerPortal;