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

// Import components
import Dashboard from './Dashboard';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import TestCaseModal from './modals/TestCaseModal';
import TestExecutionModal from './modals/TestExecutionModal';
import SettingsModal from './modals/SettingsModal';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';

const TestManagerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [projects, setProjects] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [testPlans, setTestPlans] = useState([]);
  const [testRuns, setTestRuns] = useState([]);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login');

  // Modal states
  const [showAIModal, setShowAIModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [showTestPlanModal, setShowTestPlanModal] = useState(false);
  const [showTestRunModal, setShowTestRunModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTestExecutionModal, setShowTestExecutionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Filter states
  const [showArchivedTestRuns, setShowArchivedTestRuns] = useState(false);

  // AI state
  const [aiTask, setAiTask] = useState('project');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [viewModalData, setViewModalData] = useState(null);
  const [viewModalType, setViewModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [executingTestRun, setExecutingTestRun] = useState(null);

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

  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Test Manager',
      status: 'active',
      password: 'demo'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Tester',
      status: 'active',
      password: 'demo'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      role: 'Developer',
      status: 'inactive',
      password: 'demo'
    },
    {
      id: '4',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'Admin',
      status: 'active',
      password: 'demo'
    }
  ]);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('testara_currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    // Load saved users or set defaults
    const savedUsers = localStorage.getItem('testara_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      localStorage.setItem('testara_users', JSON.stringify(users));
    }
    
    if (savedUser) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (email, password) => {
    const savedUsers = JSON.parse(localStorage.getItem('testara_users') || '[]');
    const user = savedUsers.find(u => u.email === email && u.password === password && u.status === 'active');
    
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('testara_currentUser', JSON.stringify(userWithoutPassword));
      loadAllData();
      return true;
    }
    return false;
  };

  const handleSignup = async (userData) => {
    const savedUsers = JSON.parse(localStorage.getItem('testara_users') || '[]');
    
    if (savedUsers.find(u => u.email === userData.email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: 'active',
      password: userData.password
    };

    const updatedUsers = [...savedUsers, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('testara_users', JSON.stringify(updatedUsers));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    
    setCurrentUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('testara_currentUser', JSON.stringify(userWithoutPassword));
    loadAllData();
    return true;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('testara_currentUser');
  };

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

    // Generate test cases
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
      { title: 'Browser Compatibility', description: 'Test across different browsers', category: 'Compatibility' }
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
      }
    ];

    console.log('Generated data:', {
      projects: mockProjects.length,
      testCases: mockTestCases.length,
      testPlans: mockTestPlans.length,
      testRuns: mockTestRuns.length
    });

    // Save to localStorage
    try {
      localStorage.setItem('testara_projects', JSON.stringify(mockProjects));
      localStorage.setItem('testara_testCases', JSON.stringify(mockTestCases));
      localStorage.setItem('testara_testPlans', JSON.stringify(mockTestPlans));
      localStorage.setItem('testara_testRuns', JSON.stringify(mockTestRuns));
      console.log('Mock data saved to localStorage successfully');
    } catch (error) {
      console.error('Failed to save mock data to localStorage:', error);
    }

    setProjects(mockProjects);
    setTestCases(mockTestCases);
    setTestPlans(mockTestPlans);
    setTestRuns(mockTestRuns);
    setError(null);
    setLoading(false);
    
    console.log('Mock data generation complete');
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
          console.log('No data found, ready to generate mock data...');
          setProjects([]);
          setTestCases([]);
          setTestPlans([]);
          setTestRuns([]);
        }
      }
    } catch (err) {
      console.error('Error loading data from API:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectPassRate = (projectId) => {
    const projectTestRuns = (testRuns || []).filter(tr => tr.projectId === projectId);
    
    if (projectTestRuns.length === 0) return 0;
    
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
    const project = (projects || []).find(p => p._id === projectId);
    if (!project) return 0;
    
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

  // Handler functions
  const handleCreateProject = () => {
    setProjectForm({ name: '', description: '', status: 'active', team: [''] });
    setEditingItem(null);
    setShowProjectModal(true);
  };

  const handleCreateTestCase = () => {
    setTestCaseForm({
      title: '',
      description: '',
      project: (projects || []).length > 0 ? (projects || [])[0].name : '',
      priority: 'Medium',
      category: 'Functional',
      steps: []
    });
    setEditingItem(null);
    setShowTestCaseModal(true);
  };

  const handleCreateTestPlan = () => {
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
    setEditingItem(null);
    setShowTestPlanModal(true);
  };

  const handleCreateTestRun = () => {
    setTestRunForm({
      name: '',
      description: '',
      testPlanId: '',
      projectId: (projects || []).length > 0 ? (projects || [])[0]._id : '',
      executedBy: currentUser?.name || 'Current User',
      testCaseResults: []
    });
    setEditingItem(null);
    setShowTestRunModal(true);
  };

  const handleEditItem = (item, type) => {
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

  const handleDeleteItem = (item, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'project') {
          const updatedProjects = projects.filter(p => p._id !== item._id);
          setProjects(updatedProjects);
          localStorage.setItem('testara_projects', JSON.stringify(updatedProjects));
        } else if (type === 'testcase') {
          const updatedTestCases = testCases.filter(tc => tc._id !== item._id);
          setTestCases(updatedTestCases);
          localStorage.setItem('testara_testCases', JSON.stringify(updatedTestCases));
        } else if (type === 'testplan') {
          const updatedTestPlans = testPlans.filter(tp => tp._id !== item._id);
          setTestPlans(updatedTestPlans);
          localStorage.setItem('testara_testPlans', JSON.stringify(updatedTestPlans));
        } else if (type === 'testrun') {
          const updatedTestRuns = testRuns.filter(tr => tr._id !== item._id);
          setTestRuns(updatedTestRuns);
          localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
        }
      } catch (err) {
        setError(`Failed to delete ${type}: ` + err.message);
      }
    }
  };

  const handleArchiveTestRun = (testRun) => {
    if (window.confirm('Are you sure you want to archive this test run?')) {
      try {
        const updatedTestRun = { ...testRun, archived: true, archivedDate: new Date().toISOString().split('T')[0] };
        const updatedTestRuns = testRuns.map(tr => tr._id === testRun._id ? updatedTestRun : tr);
        setTestRuns(updatedTestRuns);
        localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
      } catch (err) {
        setError('Failed to archive test run: ' + err.message);
      }
    }
  };

  const handleUnarchiveTestRun = (testRun) => {
    try {
      const updatedTestRun = { ...testRun, archived: false };
      delete updatedTestRun.archivedDate;
      const updatedTestRuns = testRuns.map(tr => tr._id === testRun._id ? updatedTestRun : tr);
      setTestRuns(updatedTestRuns);
      localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
    } catch (err) {
      setError('Failed to unarchive test run: ' + err.message);
    }
  };

  const handleProjectSubmit = () => {
    if (!projectForm.name.trim()) return;

    try {
      const projectData = {
        ...projectForm,
        team: (projectForm.team || []).filter(member => member.trim() !== '')
      };

      let updatedProjects;
      if (editingItem) {
        const updatedProject = { ...projectData, _id: editingItem._id };
        updatedProjects = projects.map(p => p._id === editingItem._id ? updatedProject : p);
      } else {
        const newProject = { ...projectData, _id: Date.now().toString() };
        updatedProjects = [...projects, newProject];
      }
      
      setProjects(updatedProjects);
      localStorage.setItem('testara_projects', JSON.stringify(updatedProjects));
      setShowProjectModal(false);
      setEditingItem(null);
      
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

  const handleTestCaseSubmit = () => {
    if (!testCaseForm.title.trim()) return;

    try {
      let updatedTestCases;
      if (editingItem) {
        const updatedTestCase = { ...testCaseForm, _id: editingItem._id };
        updatedTestCases = testCases.map(tc => tc._id === editingItem._id ? updatedTestCase : tc);
      } else {
        const newTestCase = { ...testCaseForm, _id: Date.now().toString() };
        updatedTestCases = [...testCases, newTestCase];
      }
      
      setTestCases(updatedTestCases);
      localStorage.setItem('testara_testCases', JSON.stringify(updatedTestCases));
      setShowTestCaseModal(false);
      setEditingItem(null);
      
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

  // Add test step functions
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

  const handleRunTest = (testCase) => {
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

  // User management handlers
  const handleAddUser = (userData) => {
    const newUser = { ...userData, password: 'demo' };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('testara_users', JSON.stringify(updatedUsers));
  };

  const handleUpdateUser = (userId, userData) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...userData, id: userId, password: user.password } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('testara_users', JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('testara_users', JSON.stringify(updatedUsers));
  };

  const handleExecuteTestRun = (testRun) => {
    setExecutingTestRun(testRun);
    setShowTestExecutionModal(true);
  };

  const handleTestRunSubmit = () => {
    if (!testRunForm.name.trim()) return;

    try {
      let updatedTestRuns;
      if (editingItem) {
        const updatedTestRun = { ...testRunForm, _id: editingItem._id };
        updatedTestRuns = testRuns.map(tr => tr._id === editingItem._id ? updatedTestRun : tr);
      } else {
        const selectedTestPlan = testPlans.find(tp => tp._id === testRunForm.testPlanId);
        const selectedProject = projects.find(p => p._id === testRunForm.projectId);
        
        // Get test cases for this test run
        let testCasesForRun = [];
        if (selectedTestPlan) {
          testCasesForRun = testCases.filter(tc => selectedTestPlan.testCases.includes(tc._id));
        } else {
          // If no test plan selected, get all test cases for the project
          testCasesForRun = testCases.filter(tc => tc.project === selectedProject?.name);
        }

        const newTestRun = {
          ...testRunForm,
          _id: Date.now().toString(),
          status: 'pending',
          startDate: new Date().toISOString().split('T')[0],
          totalTests: testCasesForRun.length,
          passedTests: 0,
          failedTests: 0,
          skippedTests: 0,
          testCaseResults: testCasesForRun.map(tc => ({
            testCaseId: tc._id,
            status: 'pending',
            executedDate: null,
            notes: ''
          }))
        };
        updatedTestRuns = [...testRuns, newTestRun];
      }
      
      setTestRuns(updatedTestRuns);
      localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
      setShowTestRunModal(false);
      setEditingItem(null);
      
      setTestRunForm({
        name: '',
        description: '',
        testPlanId: '',
        projectId: (projects || []).length > 0 ? (projects || [])[0]._id : '',
        executedBy: currentUser?.name || 'Current User',
        testCaseResults: []
      });
    } catch (err) {
      setError('Failed to save test run: ' + err.message);
    }
  };

  const handleTestPlanSubmit = () => {
    if (!testPlanForm.name.trim()) return;

    try {
      let updatedTestPlans;
      if (editingItem) {
        const updatedTestPlan = { ...testPlanForm, _id: editingItem._id };
        updatedTestPlans = testPlans.map(tp => tp._id === editingItem._id ? updatedTestPlan : tp);
      } else {
        const newTestPlan = {
          ...testPlanForm,
          _id: Date.now().toString(),
          status: 'active',
          createdDate: new Date().toISOString().split('T')[0]
        };
        updatedTestPlans = [...testPlans, newTestPlan];
      }
      
      setTestPlans(updatedTestPlans);
      localStorage.setItem('testara_testPlans', JSON.stringify(updatedTestPlans));
      setShowTestPlanModal(false);
      setEditingItem(null);
      
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

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (authView === 'signup') {
      return (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthView('signup')}
      />
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50" style={{ textAlign: 'left' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Testara Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser?.name}</span>
              <button 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
              >
                Logout
              </button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" style={{ textAlign: 'left' }}>
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

        {/* Tab content */}
        <div style={{ textAlign: 'left' }}>
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

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <button 
                  onClick={handleCreateProject}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>
              {projects.length === 0 ? (
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
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.map(project => (
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
                          <p className="text-2xl font-bold text-gray-900">{calculateProjectTestCaseCount(project._id)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pass Rate</p>
                          <p className="text-2xl font-bold text-green-600">{calculateProjectPassRate(project._id)}%</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Last run: Never
                        </p>
                        <div className="flex gap-2">
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
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'testcases' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Test Cases</h2>
                <button 
                  onClick={handleCreateTestCase}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Test Case
                </button>
              </div>
              {testCases.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Cases Created</h3>
                  <p className="text-gray-600 mb-6">Create your first test case to get started</p>
                  <button
                    onClick={handleCreateTestCase}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Create Test Case
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Case</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {testCases.map(testCase => (
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button 
                                  className="text-green-600 hover:text-green-800"
                                  onClick={() => handleRunTest(testCase)}
                                  title="Run Test"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                                <button 
                                  className="text-gray-600 hover:text-gray-800"
                                  onClick={() => handleEditItem(testCase, 'testcase')}
                                  title="Edit Test Case"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteItem(testCase, 'testcase')}
                                  title="Delete Test Case"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'testplans' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Test Plans</h2>
                <button 
                  onClick={handleCreateTestPlan}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Test Plan
                </button>
              </div>
              {testPlans.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Plans Created</h3>
                  <p className="text-gray-600 mb-6">Create your first test plan to organize test cases</p>
                  <button
                    onClick={handleCreateTestPlan}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Create Test Plan
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {testPlans.map(testPlan => {
                    const project = projects.find(p => p._id === testPlan.projectId);
                    const planTestCases = testCases.filter(tc => (testPlan.testCases || []).includes(tc._id));
                    
                    return (
                      <div key={testPlan._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{testPlan.name}</h3>
                            <p className="text-gray-600 mt-1">{testPlan.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            testPlan.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {testPlan.status?.charAt(0).toUpperCase() + testPlan.status?.slice(1)}
                          </span>
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
                        
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">Created: {testPlan.createdDate}</p>
                          <div className="flex gap-2">
                            <button 
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                              onClick={() => {
                                // Create a new test run from this test plan
                                setTestRunForm({
                                  name: `${testPlan.name} - Execution`,
                                  description: `Execution of ${testPlan.name}`,
                                  testPlanId: testPlan._id,
                                  projectId: testPlan.projectId,
                                  executedBy: currentUser?.name || 'Current User',
                                  testCaseResults: []
                                });
                                setShowTestRunModal(true);
                              }}
                              title="Execute Test Plan"
                            >
                              <Play className="w-3 h-3" />
                              Execute
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
              )}
            </div>
          )}

          {activeTab === 'testruns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Test Runs</h2>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={showArchivedTestRuns}
                        onChange={(e) => setShowArchivedTestRuns(e.target.checked)}
                        className="rounded"
                      />
                      Show Archived
                    </label>
                  </div>
                </div>
                <button 
                  onClick={handleCreateTestRun}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Test Run
                </button>
              </div>

              {(() => {
                const filteredTestRuns = testRuns.filter(tr => 
                  showArchivedTestRuns ? tr.archived === true : !tr.archived
                );

                return filteredTestRuns.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {showArchivedTestRuns ? 'No Archived Test Runs' : 'No Test Runs Yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {showArchivedTestRuns 
                        ? 'No test runs have been archived yet'
                        : 'Create your first test run to start executing tests'
                      }
                    </p>
                    {!showArchivedTestRuns && (
                      <button
                        onClick={handleCreateTestRun}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-5 h-5" />
                        Create Test Run
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTestRuns.map(testRun => {
                      const testPlan = testPlans.find(tp => tp._id === testRun.testPlanId);
                      const project = projects.find(p => p._id === testRun.projectId);
                      const passRate = testRun.totalTests > 0 ? Math.round((testRun.passedTests / testRun.totalTests) * 100) : 0;
                      
                      return (
                        <div key={testRun._id} className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${testRun.archived ? 'bg-gray-50' : ''}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">{testRun.name}</h3>
                                {testRun.archived && (
                                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                    Archived
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mt-1">
                                {testPlan ? `${testPlan.name} • ` : ''}{project?.name || 'Unknown Project'}
                              </p>
                              {testRun.description && (
                                <p className="text-sm text-gray-500 mt-1">{testRun.description}</p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testRun.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : testRun.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {testRun.status?.replace('_', ' ').charAt(0).toUpperCase() + testRun.status?.replace('_', ' ').slice(1)}
                            </span>
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
                            {testRun.archivedDate && <span>Archived: {testRun.archivedDate}</span>}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">Executed by: {testRun.executedBy}</p>
                            <div className="flex gap-2">
                              {!testRun.archived && (
                                <>
                                  <button 
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                                    onClick={() => handleExecuteTestRun(testRun)}
                                    title="Execute Tests"
                                  >
                                    <Play className="w-3 h-3" />
                                    Execute
                                  </button>
                                  <button 
                                    className="text-gray-600 hover:text-gray-800"
                                    onClick={() => handleEditItem(testRun, 'testrun')}
                                    title="Edit Test Run"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              
                              {testRun.archived ? (
                                <button 
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={() => handleUnarchiveTestRun(testRun)}
                                  title="Unarchive Test Run"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              ) : (
                                <button 
                                  className="text-yellow-600 hover:text-yellow-800"
                                  onClick={() => handleArchiveTestRun(testRun)}
                                  title="Archive Test Run"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                              
                              <button 
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteItem(testRun, 'testrun')}
                                title="Delete Test Run"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
                <button 
                  onClick={() => {
                    const reportData = {
                      dashboardStats,
                      projects,
                      testCases,
                      testRuns,
                      testPlans,
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
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Quick Stats Cards */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProjects}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Test Cases</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalTestCases}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Test Plans</p>
                      <p className="text-2xl font-bold text-gray-900">{testPlans.length}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Test Runs</p>
                      <p className="text-2xl font-bold text-gray-900">{testRuns.filter(tr => !tr.archived).length}</p>
                    </div>
                    <Play className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Test Execution Summary */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Test Execution Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Passed Tests</span>
                      <span className="text-lg font-bold text-green-600">{dashboardStats.passedTests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Failed Tests</span>
                      <span className="text-lg font-bold text-red-600">{dashboardStats.failedTests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Tests</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {testCases.filter(tc => tc.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Pass Rate</span>
                      <span className="text-lg font-bold text-blue-600">{dashboardStats.avgPassRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Test Case Distribution by Category */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Test Categories Distribution</h3>
                  <div className="space-y-3">
                    {(() => {
                      const categoryStats = testCases.reduce((acc, tc) => {
                        const category = tc.category || 'Uncategorized';
                        acc[category] = (acc[category] || 0) + 1;
                        return acc;
                      }, {});
                      
                      return Object.entries(categoryStats).map(([category, count]) => (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">{category}</span>
                            <span className="text-sm font-medium">{count} tests</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / testCases.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Priority Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
                  <div className="space-y-3">
                    {(() => {
                      const priorityStats = testCases.reduce((acc, tc) => {
                        const priority = tc.priority || 'Medium';
                        acc[priority] = (acc[priority] || 0) + 1;
                        return acc;
                      }, {});
                      
                      const priorityColors = {
                        'Critical': 'bg-red-500',
                        'High': 'bg-orange-500',
                        'Medium': 'bg-yellow-500',
                        'Low': 'bg-green-500'
                      };
                      
                      return Object.entries(priorityStats).map(([priority, count]) => (
                        <div key={priority} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${priorityColors[priority] || 'bg-gray-500'}`}></div>
                            <span className="text-sm text-gray-600">{priority}</span>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Test Run Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Test Run Status</h3>
                  <div className="space-y-3">
                    {(() => {
                      const statusStats = testRuns.filter(tr => !tr.archived).reduce((acc, tr) => {
                        const status = tr.status || 'pending';
                        acc[status] = (acc[status] || 0) + 1;
                        return acc;
                      }, {});
                      
                      const statusColors = {
                        'completed': 'text-green-600',
                        'in_progress': 'text-yellow-600',
                        'pending': 'text-gray-600'
                      };
                      
                      return Object.entries(statusStats).map(([status, count]) => (
                        <div key={status} className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${statusColors[status]}`}>
                            {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                          </span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {(() => {
                      const recentTestRuns = testRuns
                        .filter(tr => tr.startDate)
                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                        .slice(0, 5);
                      
                      return recentTestRuns.map(tr => (
                        <div key={tr._id} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{tr.name}</p>
                            <p className="text-xs text-gray-500">{tr.startDate}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tr.status === 'completed' ? 'bg-green-100 text-green-800' :
                            tr.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tr.status}
                          </span>
                        </div>
                      ));
                    })()}
                    {testRuns.filter(tr => tr.startDate).length === 0 && (
                      <p className="text-sm text-gray-500">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Project Performance */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Detailed Project Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Project</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Test Cases</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Test Plans</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Test Runs</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Pass Rate</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {projects.map(project => {
                        const calculatedTestCaseCount = calculateProjectTestCaseCount(project._id);
                        const calculatedPassRate = calculateProjectPassRate(project._id);
                        const projectTestPlans = testPlans.filter(tp => tp.projectId === project._id);
                        const projectTestRuns = testRuns.filter(tr => tr.projectId === project._id && !tr.archived);
                        const lastRun = projectTestRuns
                          .filter(tr => tr.startDate)
                          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
                        
                        return (
                          <tr key={project._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{project.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{calculatedTestCaseCount}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{projectTestPlans.length}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{projectTestRuns.length}</td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">{calculatedPassRate}%</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      calculatedPassRate >= 80 ? 'bg-green-500' :
                                      calculatedPassRate >= 60 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${calculatedPassRate}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2"><StatusBadge status={project.status || 'active'} /></td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {lastRun ? lastRun.startDate : 'Never'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {projects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No projects to display</p>
                  </div>
                )}
              </div>

              {/* Test Execution Trends */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Test Execution Timeline</h3>
                <div className="space-y-4">
                  {(() => {
                    const testRunsByDate = testRuns
                      .filter(tr => tr.startDate && !tr.archived)
                      .reduce((acc, tr) => {
                        const date = tr.startDate;
                        if (!acc[date]) {
                          acc[date] = { total: 0, passed: 0, failed: 0, completed: 0 };
                        }
                        acc[date].total += 1;
                        acc[date].passed += tr.passedTests || 0;
                        acc[date].failed += tr.failedTests || 0;
                        if (tr.status === 'completed') acc[date].completed += 1;
                        return acc;
                      }, {});
                    
                    const sortedDates = Object.keys(testRunsByDate)
                      .sort((a, b) => new Date(b) - new Date(a))
                      .slice(0, 10);
                    
                    return sortedDates.length > 0 ? sortedDates.map(date => {
                      const data = testRunsByDate[date];
                      const passRate = data.passed + data.failed > 0 ? 
                        Math.round((data.passed / (data.passed + data.failed)) * 100) : 0;
                      
                      return (
                        <div key={date} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-900">{date}</h4>
                            <span className="text-sm text-gray-600">{data.total} test runs</span>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Completed: </span>
                              <span className="font-medium">{data.completed}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Passed: </span>
                              <span className="font-medium text-green-600">{data.passed}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Failed: </span>
                              <span className="font-medium text-red-600">{data.failed}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Pass Rate: </span>
                              <span className="font-medium">{passRate}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <p className="text-gray-500 text-center py-4">No test execution data available</p>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" style={{ textAlign: 'left' }}>
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Project' : 'Create New Project'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the project"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleProjectSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingItem ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Case Modal */}
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

      {/* Test Plan Modal */}
      {showTestPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl" style={{ textAlign: 'left' }}>
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Test Plan' : 'Create New Test Plan'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Plan Name</label>
                  <input
                    type="text"
                    value={testPlanForm.name}
                    onChange={(e) => setTestPlanForm({...testPlanForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter test plan name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={testPlanForm.projectId}
                    onChange={(e) => setTestPlanForm({...testPlanForm, projectId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={testPlanForm.description}
                  onChange={(e) => setTestPlanForm({...testPlanForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the test plan"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Test Cases</label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {testCases.map(testCase => (
                    <label key={testCase._id} className="flex items-center space-x-2">
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
                      />
                      <span className="text-sm">{testCase.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTestPlanModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTestPlanSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl" style={{ textAlign: 'left' }}>
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Test Run' : 'Create New Test Run'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Run Name</label>
                  <input
                    type="text"
                    value={testRunForm.name}
                    onChange={(e) => setTestRunForm({...testRunForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter test run name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Executed By</label>
                  <input
                    type="text"
                    value={testRunForm.executedBy}
                    onChange={(e) => setTestRunForm({...testRunForm, executedBy: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter executor name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={testRunForm.description}
                  onChange={(e) => setTestRunForm({...testRunForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the test run (optional)"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={testRunForm.projectId}
                    onChange={(e) => setTestRunForm({...testRunForm, projectId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Plan (Optional)</label>
                  <select
                    value={testRunForm.testPlanId}
                    onChange={(e) => setTestRunForm({...testRunForm, testPlanId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Test Plan (Manual Selection)</option>
                    {testPlans
                      .filter(tp => tp.projectId === testRunForm.projectId)
                      .map(testPlan => (
                        <option key={testPlan._id} value={testPlan._id}>{testPlan.name}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTestRunModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTestRunSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingItem ? 'Update Test Run' : 'Create Test Run'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Execution Modal */}
      {showTestExecutionModal && (
        <TestExecutionModal
          show={showTestExecutionModal}
          onClose={() => {
            setShowTestExecutionModal(false);
            setExecutingTestRun(null);
          }}
          testRun={executingTestRun}
          testCases={testCases}
          onUpdateTestRun={(updatedTestRun) => {
            const updatedTestRuns = testRuns.map(tr => 
              tr._id === updatedTestRun._id ? updatedTestRun : tr
            );
            setTestRuns(updatedTestRuns);
            localStorage.setItem('testara_testRuns', JSON.stringify(updatedTestRuns));
          }}
        />
      )}

    </div>
  );
};

export default TestManagerPortal;