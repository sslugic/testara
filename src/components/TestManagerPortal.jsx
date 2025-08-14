import React, { useState } from 'react';
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

const TestManagerPortal = () => {
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

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTask, setAiTask] = useState('project');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [testCaseForm, setTestCaseForm] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'Medium',
    category: 'Functional',
    steps: [{ id: 1, action: '', expected: '' }]
  });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'active',
    team: ['']
  });

  // Add test plans state
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

  const [showTestPlanModal, setShowTestPlanModal] = useState(false);
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

  // Add test plan viewing state
  const [showTestPlanViewModal, setShowTestPlanViewModal] = useState(false);
  const [viewingTestPlan, setViewingTestPlan] = useState(null);

  // Add test plan editing state
  const [editingTestPlan, setEditingTestPlan] = useState(null);
  const [isTestPlanEditMode, setIsTestPlanEditMode] = useState(false);

  // Add project editing state
  const [editingProject, setEditingProject] = useState(null);
  const [isProjectEditMode, setIsProjectEditMode] = useState(false);

  // Add editing state
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Add view modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingTestCase, setViewingTestCase] = useState(null);

  // Add filter state
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    project: '',
    priority: '',
    category: ''
  });

  // Add test runs state
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

  // Add test run viewing and execution states
  const [showTestRunViewModal, setShowTestRunViewModal] = useState(false);
  const [viewingTestRun, setViewingTestRun] = useState(null);
  const [executingTestCase, setExecutingTestCase] = useState(null);
  const [showExecuteTestCaseModal, setShowExecuteTestCaseModal] = useState(false);
  const [testCaseExecution, setTestCaseExecution] = useState({
    status: 'passed',
    notes: ''
  });

  const openNewTestCaseModal = () => {
    setTestCaseForm({
      title: '',
      description: '',
      project: projects.length > 0 ? projects[0].name : '',
      priority: 'Medium',
      category: 'Functional',
      steps: [{ id: 1, action: '', expected: '' }]
    });
    setIsEditMode(false);
    setShowTestCaseModal(true);
  };

  // Add edit test case function
  const openEditTestCaseModal = (testCase) => {
    setTestCaseForm({
      title: testCase.title,
      description: testCase.description || '',
      project: testCase.project,
      priority: testCase.priority,
      category: testCase.category || 'Functional',
      steps: testCase.testSteps || [{ id: 1, action: '', expected: '' }]
    });
    setEditingTestCase(testCase);
    setIsEditMode(true);
    setShowTestCaseModal(true);
  };

  // Add view test case function
  const openViewTestCaseModal = (testCase) => {
    setViewingTestCase(testCase);
    setShowViewModal(true);
  };

  // Add project edit function
  const openEditProjectModal = (project) => {
    setProjectForm({
      name: project.name,
      description: project.description,
      status: project.status,
      team: project.team || ['']
    });
    setEditingProject(project);
    setIsProjectEditMode(true);
    setShowProjectModal(true);
  };

  const openNewProjectModal = () => {
    setProjectForm({
      name: '',
      description: '',
      status: 'active',
      team: ['']
    });
    setIsProjectEditMode(false);
    setEditingProject(null);
    setShowProjectModal(true);
  };

  // Add test plan modal functions
  const openNewTestPlanModal = () => {
    setTestPlanForm({
      name: '',
      description: '',
      projectId: projects.length > 0 ? projects[0].id : '',
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

  // Add view test plan function
  const openViewTestPlanModal = (testPlan) => {
    setViewingTestPlan(testPlan);
    setShowTestPlanViewModal(true);
  };

  // Add edit test plan function
  const openEditTestPlanModal = (testPlan) => {
    setTestPlanForm({
      name: testPlan.name,
      description: testPlan.description,
      projectId: testPlan.projectId.toString(),
      testCases: testPlan.testCases,
      strategy: {
        objectives: testPlan.strategy?.objectives || [''],
        scope: testPlan.strategy?.scope || '',
        approach: testPlan.strategy?.approach || '',
        resources: testPlan.strategy?.resources || '',
        timeline: testPlan.strategy?.timeline || '',
        deliverables: testPlan.strategy?.deliverables || ['']
      }
    });
    setEditingTestPlan(testPlan);
    setIsTestPlanEditMode(true);
    setShowTestPlanModal(true);
  };

  // Add delete test plan function
  const deleteTestPlan = (testPlanId) => {
    if (window.confirm('Are you sure you want to delete this test plan? This action cannot be undone.')) {
      setTestPlans(testPlans.filter(tp => tp.id !== testPlanId));
    }
  };

  // Add test run functions
  const executeTestPlan = (testPlan) => {
    const newTestRun = {
      id: testRuns.length + 1,
      name: `${testPlan.name} - Run #${testRuns.filter(tr => tr.testPlanId === testPlan.id).length + 1}`,
      testPlanId: testPlan.id,
      status: 'in_progress',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      executedBy: 'Current User',
      testCaseResults: testPlan.testCases.map(tcId => ({
        testCaseId: tcId,
        status: 'pending',
        executedDate: null,
        notes: ''
      })),
      totalTests: testPlan.testCases.length,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0
    };

    setTestRuns([...testRuns, newTestRun]);
    setActiveTab('testruns');
  };

  const openTestRunViewModal = (testRun) => {
    setViewingTestRun(testRun);
    setShowTestRunViewModal(true);
  };

  const openExecuteTestCaseModal = (testRun, testCaseId) => {
    setExecutingTestCase({ testRun, testCaseId });
    const existingResult = testRun.testCaseResults.find(tcr => tcr.testCaseId === testCaseId);
    setTestCaseExecution({
      status: existingResult?.status || 'passed',
      notes: existingResult?.notes || ''
    });
    setShowExecuteTestCaseModal(true);
  };

  const handleTestCaseExecution = () => {
    if (!executingTestCase) return;

    const { testRun, testCaseId } = executingTestCase;

    // Update test run with new result
    const updatedTestRuns = testRuns.map(tr => {
      if (tr.id === testRun.id) {
        const updatedResults = tr.testCaseResults.map(tcr => 
          tcr.testCaseId === testCaseId 
            ? {
                ...tcr,
                status: testCaseExecution.status,
                executedDate: new Date().toISOString().split('T')[0],
                notes: testCaseExecution.notes
              }
            : tcr
        );

        // Calculate new stats
        const passedTests = updatedResults.filter(r => r.status === 'passed').length;
        const failedTests = updatedResults.filter(r => r.status === 'failed').length;
        const skippedTests = updatedResults.filter(r => r.status === 'skipped').length;
        const pendingTests = updatedResults.filter(r => r.status === 'pending').length;

        // Determine overall status
        let status = 'in_progress';
        if (pendingTests === 0) {
          status = 'completed';
        }

        return {
          ...tr,
          testCaseResults: updatedResults,
          passedTests,
          failedTests,
          skippedTests,
          status,
          endDate: status === 'completed' ? new Date().toISOString().split('T')[0] : tr.endDate
        };
      }
      return tr;
    });

    setTestRuns(updatedTestRuns);
    
    // Update viewing test run if it's currently open
    if (viewingTestRun && viewingTestRun.id === testRun.id) {
      setViewingTestRun(updatedTestRuns.find(tr => tr.id === testRun.id));
    }

    setShowExecuteTestCaseModal(false);
    setExecutingTestCase(null);
  };

  const handleTestCaseSubmit = () => {
    if (!testCaseForm.title.trim()) return;

    if (isEditMode && editingTestCase) {
      // Update existing test case
      setTestCases(testCases.map(tc => 
        tc.id === editingTestCase.id 
          ? { 
              ...tc, 
              title: testCaseForm.title,
              project: testCaseForm.project,
              priority: testCaseForm.priority,
              description: testCaseForm.description,
              category: testCaseForm.category,
              testSteps: testCaseForm.steps,
              steps: testCaseForm.steps.length
            }
          : tc
      ));
    } else {
      // Create new test case
      const newTestCase = {
        id: testCases.length + 1,
        title: testCaseForm.title,
        project: testCaseForm.project,
        priority: testCaseForm.priority,
        status: 'pending',
        lastRun: new Date().toISOString().split('T')[0],
        steps: testCaseForm.steps.length,
        description: testCaseForm.description,
        category: testCaseForm.category,
        testSteps: testCaseForm.steps
      };
      setTestCases([...testCases, newTestCase]);
    }

    setShowTestCaseModal(false);
    setEditingTestCase(null);
    setIsEditMode(false);
  };

  const handleProjectSubmit = () => {
    if (!projectForm.name.trim()) return;

    if (isProjectEditMode && editingProject) {
      // Update existing project
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { 
              ...p, 
              name: projectForm.name,
              description: projectForm.description,
              status: projectForm.status,
              team: projectForm.team.filter(member => member.trim() !== '')
            }
          : p
      ));
    } else {
      // Create new project
      const newProject = {
        id: projects.length + 1,
        name: projectForm.name,
        description: projectForm.description,
        status: projectForm.status,
        testCases: 0,
        passRate: 0,
        lastRun: new Date().toISOString().split('T')[0],
        team: projectForm.team.filter(member => member.trim() !== '')
      };
      setProjects([...projects, newProject]);
    }

    setShowProjectModal(false);
    setEditingProject(null);
    setIsProjectEditMode(false);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Helper function to capitalize first letter of each word
    const capitalizeWords = (str) => {
      return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };
    
    if (aiTask === 'project') {
      const newProject = {
        id: projects.length + 1,
        name: capitalizeWords(aiPrompt),
        description: `Comprehensive testing project for ${aiPrompt}`,
        status: 'active',
        testCases: Math.floor(Math.random() * 50) + 20,
        passRate: 0,
        lastRun: new Date().toISOString().split('T')[0],
        team: ['AI Assistant', 'Test Lead'],
        isAIGenerated: true
      };
      setProjects([...projects, newProject]);
    } else if (aiTask === 'testcase') {
      // Generate detailed test case based on prompt
      const generateTestSteps = (prompt) => {
        const commonSteps = [
          {
            id: 1,
            action: `Navigate to the ${prompt} section/page`,
            expected: `${prompt} page should load successfully with all elements visible`
          },
          {
            id: 2,
            action: `Verify all input fields and buttons related to ${prompt} are present`,
            expected: 'All required UI elements should be displayed correctly'
          },
          {
            id: 3,
            action: `Enter valid test data for ${prompt}`,
            expected: 'System should accept valid input without errors'
          },
          {
            id: 4,
            action: `Submit/Execute the ${prompt} action`,
            expected: `${prompt} should complete successfully with appropriate confirmation`
          },
          {
            id: 5,
            action: `Verify the results/outcome of ${prompt}`,
            expected: 'Expected results should be displayed and data should be saved correctly'
          }
        ];

        // Add specific steps based on common functionality types
        if (prompt.toLowerCase().includes('login') || prompt.toLowerCase().includes('authentication')) {
          return [
            { id: 1, action: 'Navigate to login page', expected: 'Login page loads with username and password fields' },
            { id: 2, action: 'Enter valid username and password', expected: 'System accepts input without validation errors' },
            { id: 3, action: 'Click login button', expected: 'User is authenticated and redirected to dashboard' },
            { id: 4, action: 'Verify user session is active', expected: 'User remains logged in and can access protected pages' }
          ];
        } else if (prompt.toLowerCase().includes('payment') || prompt.toLowerCase().includes('checkout')) {
          return [
            { id: 1, action: 'Add items to cart and proceed to checkout', expected: 'Checkout page loads with item summary' },
            { id: 2, action: 'Enter shipping and billing information', expected: 'Forms accept valid address information' },
            { id: 3, action: 'Select payment method and enter card details', expected: 'Payment form validates card information' },
            { id: 4, action: 'Review order and submit payment', expected: 'Payment processes successfully' },
            { id: 5, action: 'Verify order confirmation', expected: 'Order confirmation page shows correct details and order ID' }
          ];
        } else if (prompt.toLowerCase().includes('search')) {
          return [
            { id: 1, action: 'Navigate to search functionality', expected: 'Search interface is accessible and visible' },
            { id: 2, action: 'Enter search query in search field', expected: 'Search field accepts input and shows suggestions if available' },
            { id: 3, action: 'Execute search operation', expected: 'Search results are displayed matching the query' },
            { id: 4, action: 'Verify search results are relevant', expected: 'Results contain items related to search terms' }
          ];
        } else {
          return commonSteps;
        }
      };

      const newTestCase = {
        id: testCases.length + 1,
        title: capitalizeWords(aiPrompt),
        project: projects.length > 0 ? projects[0].name : 'Default Project',
        priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        status: 'pending',
        lastRun: new Date().toISOString().split('T')[0],
        steps: 5,
        description: `Comprehensive test case for ${aiPrompt} functionality. This test covers the main user workflow and verifies expected system behavior.`,
        category: aiPrompt.toLowerCase().includes('ui') ? 'UI/UX' : 
                 aiPrompt.toLowerCase().includes('performance') ? 'Performance' :
                 aiPrompt.toLowerCase().includes('security') ? 'Security' : 'Functional',
        testSteps: generateTestSteps(aiPrompt),
        isAIGenerated: true
      };
      setTestCases([...testCases, newTestCase]);
    } else if (aiTask === 'testplan') {
      // Generate test plan with comprehensive strategy
      const generateTestStrategy = (prompt) => {
        const lowerPrompt = prompt.toLowerCase();
        
        // Generate objectives based on the prompt
        let objectives = ['Ensure system functionality works as expected', 'Validate user experience'];
        if (lowerPrompt.includes('performance')) {
          objectives.push('Benchmark system performance under load');
        }
        if (lowerPrompt.includes('security')) {
          objectives.push('Verify security controls and data protection');
        }
        if (lowerPrompt.includes('integration')) {
          objectives.push('Test system integration points');
        }

        // Generate scope
        const scope = `Comprehensive testing coverage for ${prompt} including functional validation, user interface testing, and system integration verification.`;

        // Generate approach
        let approach = 'Risk-based testing approach with focus on critical user paths';
        if (lowerPrompt.includes('automation')) {
          approach += ' and automated test execution';
        }
        if (lowerPrompt.includes('manual')) {
          approach += ' with thorough manual testing';
        }

        // Generate resources
        const resources = `QA team with expertise in ${prompt} testing, test automation tools, and testing environments`;

        // Generate timeline
        const timeline = '2-3 weeks including test preparation, execution, and reporting phases';

        // Generate deliverables
        const deliverables = [
          'Test execution report with pass/fail metrics',
          'Defect analysis and recommendations',
          'Test coverage documentation'
        ];

        return {
          objectives,
          scope,
          approach,
          resources,
          timeline,
          deliverables
        };
      };

      const testPlanTestCases = Math.floor(Math.random() * 5) + 3; // 3-7 test cases
      const selectedTestCases = testCases.slice(0, testPlanTestCases).map(tc => tc.id);
      
      const newTestPlan = {
        id: testPlans.length + 1,
        name: capitalizeWords(aiPrompt) + ' Test Plan',
        description: `Comprehensive test plan covering ${aiPrompt} with automated test case selection`,
        projectId: projects.length > 0 ? projects[0].id : 1,
        testCases: selectedTestCases,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        isAIGenerated: true,
        strategy: generateTestStrategy(aiPrompt)
      };
      setTestPlans([...testPlans, newTestPlan]);
    }
    
    setIsGenerating(false);
    setShowAIModal(false);
    setAiPrompt('');
  };

  // Add test plan submit handler
  const handleTestPlanSubmit = () => {
    if (!testPlanForm.name.trim()) return;

    if (isTestPlanEditMode && editingTestPlan) {
      // Update existing test plan
      setTestPlans(testPlans.map(tp => 
        tp.id === editingTestPlan.id 
          ? { 
              ...tp, 
              name: testPlanForm.name,
              description: testPlanForm.description,
              projectId: parseInt(testPlanForm.projectId),
              testCases: testPlanForm.testCases,
              strategy: {
                ...testPlanForm.strategy,
                objectives: testPlanForm.strategy.objectives.filter(obj => obj.trim() !== ''),
                deliverables: testPlanForm.strategy.deliverables.filter(del => del.trim() !== '')
              }
            }
          : tp
      ));
    } else {
      // Create new test plan
      const newTestPlan = {
        id: testPlans.length + 1,
        name: testPlanForm.name,
        description: testPlanForm.description,
        projectId: parseInt(testPlanForm.projectId),
        testCases: testPlanForm.testCases,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        strategy: {
          ...testPlanForm.strategy,
          objectives: testPlanForm.strategy.objectives.filter(obj => obj.trim() !== ''),
          deliverables: testPlanForm.strategy.deliverables.filter(del => del.trim() !== '')
        }
      };
      setTestPlans([...testPlans, newTestPlan]);
    }

    setShowTestPlanModal(false);
    setEditingTestPlan(null);
    setIsTestPlanEditMode(false);
  };

  // Add team member management
  const addTeamMember = () => {
    setProjectForm({
      ...projectForm,
      team: [...projectForm.team, '']
    });
  };

  const removeTeamMember = (index) => {
    if (projectForm.team.length > 1) {
      setProjectForm({
        ...projectForm,
        team: projectForm.team.filter((_, i) => i !== index)
      });
    }
  };

  const updateTeamMember = (index, value) => {
    setProjectForm({
      ...projectForm,
      team: projectForm.team.map((member, i) => i === index ? value : member)
    });
  };

  // Add step management functions
  const addTestStep = () => {
    const newStep = {
      id: testCaseForm.steps.length + 1,
      action: '',
      expected: ''
    };
    setTestCaseForm({
      ...testCaseForm,
      steps: [...testCaseForm.steps, newStep]
    });
  };

  const removeTestStep = (stepId) => {
    if (testCaseForm.steps.length > 1) {
      setTestCaseForm({
        ...testCaseForm,
        steps: testCaseForm.steps.filter(step => step.id !== stepId)
      });
    }
  };

  const updateTestStep = (stepId, field, value) => {
    setTestCaseForm({
      ...testCaseForm,
      steps: testCaseForm.steps.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    });
  };

  // Add strategy management functions
  const addObjective = () => {
    setTestPlanForm({
      ...testPlanForm,
      strategy: {
        ...testPlanForm.strategy,
        objectives: [...testPlanForm.strategy.objectives, '']
      }
    });
  };

  const removeObjective = (index) => {
    if (testPlanForm.strategy.objectives.length > 1) {
      setTestPlanForm({
        ...testPlanForm,
        strategy: {
          ...testPlanForm.strategy,
          objectives: testPlanForm.strategy.objectives.filter((_, i) => i !== index)
        }
      });
    }
  };

  const updateObjective = (index, value) => {
    setTestPlanForm({
      ...testPlanForm,
      strategy: {
        ...testPlanForm.strategy,
        objectives: testPlanForm.strategy.objectives.map((obj, i) => i === index ? value : obj)
      }
    });
  };

  const addDeliverable = () => {
    setTestPlanForm({
      ...testPlanForm,
      strategy: {
        ...testPlanForm.strategy,
        deliverables: [...testPlanForm.strategy.deliverables, '']
      }
    });
  };

  const removeDeliverable = (index) => {
    if (testPlanForm.strategy.deliverables.length > 1) {
      setTestPlanForm({
        ...testPlanForm,
        strategy: {
          ...testPlanForm.strategy,
          deliverables: testPlanForm.strategy.deliverables.filter((_, i) => i !== index)
        }
      });
    }
  };

  const updateDeliverable = (index, value) => {
    setTestPlanForm({
      ...testPlanForm,
      strategy: {
        ...testPlanForm.strategy,
        deliverables: testPlanForm.strategy.deliverables.map((del, i) => i === index ? value : del)
      }
    });
  };

  const dashboardStats = {
    totalProjects: projects.length,
    totalTestCases: testCases.length,
    passedTests: testCases.filter(tc => tc.status === 'passed').length,
    failedTests: testCases.filter(tc => tc.status === 'failed').length,
    avgPassRate: Math.round(projects.reduce((acc, p) => acc + p.passRate, 0) / projects.length)
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      skipped: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  // Add filter functions
  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = !filters.project || testCase.project === filters.project;
    const matchesPriority = !filters.priority || testCase.priority === filters.priority;
    const matchesCategory = !filters.category || testCase.category === filters.category;

    return matchesSearch && matchesProject && matchesPriority && matchesCategory;
  });

  const clearFilters = () => {
    setFilters({
      project: '',
      priority: '',
      category: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = () => {
    return searchTerm || filters.project || filters.priority || filters.category;
  };

  // Get unique values for filter options
  const getUniqueValues = (field) => {
    return [...new Set(testCases.map(tc => tc[field]).filter(Boolean))];
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={() => { setShowAIModal(true); setAiTask('project'); }}
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
            onClick={() => { setShowAIModal(true); setAiTask('testplan'); }}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Generate Plan
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Run Tests</h3>
          <p className="text-green-100 mb-4">Execute automated test suites and view results</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Start Testing
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">View Reports</h3>
          <p className="text-purple-100 mb-4">Access detailed analytics and test reports</p>
          <button 
            onClick={() => setActiveTab('reports')}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View Reports
          </button>
        </div>
      </div>
    </div>
  );

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
            onClick={openNewProjectModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.isAIGenerated && (
                    <Bot className="w-4 h-4 text-purple-600" title="AI Generated" />
                  )}
                </div>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
              <StatusBadge status={project.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Test Cases</p>
                <p className="text-2xl font-bold text-gray-900">{project.testCases}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-green-600">{project.passRate}%</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Team Members</p>
              <div className="flex gap-2">
                {project.team.map((member, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {member}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Last run: {project.lastRun}</p>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => openEditProjectModal(project)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
            onClick={openNewTestCaseModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Test Case
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
                hasActiveFilters() ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters() && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0)}
                </span>
              )}
            </button>
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Project</label>
                <select
                  value={filters.project}
                  onChange={(e) => setFilters({...filters, project: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Projects</option>
                  {getUniqueValues('project').map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="Functional">Functional</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Performance">Performance</option>
                  <option value="Security">Security</option>
                  <option value="Integration">Integration</option>
                </select>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredTestCases.length} of {testCases.length} test cases
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Steps</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestCases.map(testCase => (
                <tr key={testCase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900">{testCase.title}</div>
                      {testCase.isAIGenerated && (
                        <Bot className="w-4 h-4 text-purple-600" title="AI Generated" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{testCase.project}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={testCase.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {testCase.testSteps ? testCase.testSteps.length : testCase.steps} steps
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {testCase.lastRun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex gap-2">
                      <button className="text-green-600 hover:text-green-800">
                        <Play className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openViewTestCaseModal(testCase)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openEditTestCaseModal(testCase)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTestCases.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No test cases found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
            onClick={openNewTestPlanModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Test Plan
          </button>
        </div>
      </div>

      {testPlans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Plans Created</h3>
          <p className="text-gray-600 mb-6">Create your first test plan to organize and execute test cases</p>
          <button
            onClick={openNewTestPlanModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create Test Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testPlans.map(testPlan => {
            const project = projects.find(p => p.id === testPlan.projectId);
            const planTestCases = testCases.filter(tc => testPlan.testCases.includes(tc.id));
            
            return (
              <div key={testPlan.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{testPlan.name}</h3>
                      {testPlan.isAIGenerated && (
                        <Bot className="w-4 h-4 text-purple-600" title="AI Generated" />
                      )}
                    </div>
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
                    <p className="text-2xl font-bold text-gray-900">{testPlan.testCases.length}</p>
                  </div>
                </div>

                {planTestCases.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Included Test Cases</p>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {planTestCases.slice(0, 3).map(tc => (
                        <div key={tc.id} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
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
                      onClick={() => executeTestPlan(testPlan)}
                    >
                      <Play className="w-3 h-3" />
                      Execute
                    </button>
                    <button 
                      onClick={() => openViewTestPlanModal(testPlan)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openEditTestPlanModal(testPlan)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteTestPlan(testPlan.id)}
                      className="text-red-600 hover:text-red-800"
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
  );

  const renderTestRuns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Test Runs</h2>
        <div className="text-sm text-gray-600">
          Execute test plans to create test runs
        </div>
      </div>

      {testRuns.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Runs Yet</h3>
          <p className="text-gray-600 mb-6">Execute a test plan to create your first test run</p>
          <button
            onClick={() => setActiveTab('testplans')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <FileText className="w-5 h-5" />
            Go to Test Plans
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testRuns.map(testRun => {
            const testPlan = testPlans.find(tp => tp.id === testRun.testPlanId);
            const project = projects.find(p => p.id === testPlan?.projectId);
            const passRate = testRun.totalTests > 0 ? Math.round((testRun.passedTests / testRun.totalTests) * 100) : 0;
            
            return (
              <div key={testRun.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{testRun.name}</h3>
                    <p className="text-gray-600 mt-1">
                      {testPlan?.name} • {project?.name || 'Unknown Project'}
                    </p>
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
                      onClick={() => openTestRunViewModal(testRun)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
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
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Test Execution Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            {/* Simple Chart Visualization */}
            <div className="h-full flex flex-col">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Tests Run</span>
                <span>100</span>
              </div>
              
              {/* Chart Area */}
              <div className="flex-1 flex items-end justify-between gap-2 px-2">
                {/* Sample data for 7 days */}
                {[
                  { day: 'Mon', passed: 45, failed: 5 },
                  { day: 'Tue', passed: 52, failed: 8 },
                  { day: 'Wed', passed: 38, failed: 12 },
                  { day: 'Thu', passed: 41, failed: 9 },
                  { day: 'Fri', passed: 47, failed: 3 },
                  { day: 'Sat', passed: 35, failed: 5 },
                  { day: 'Sun', passed: 42, failed: 8 }
                ].map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex flex-col items-center w-full">
                      {/* Stacked bars */}
                      <div className="w-full max-w-8 flex flex-col-reverse">
                        <div 
                          className="bg-green-500 rounded-t" 
                          style={{ height: `${(data.passed / 60) * 160}px` }}
                          title={`Passed: ${data.passed}`}
                        ></div>
                        <div 
                          className="bg-red-500 rounded-t" 
                          style={{ height: `${(data.failed / 60) * 160}px` }}
                          title={`Failed: ${data.failed}`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{data.day}</span>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Passed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600">Failed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Pass/Fail Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Passed Tests</span>
              <span className="text-sm font-medium text-green-600">{dashboardStats.passedTests}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(dashboardStats.passedTests / dashboardStats.totalTestCases) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Failed Tests</span>
              <span className="text-sm font-medium text-red-600">{dashboardStats.failedTests}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${(dashboardStats.failedTests / dashboardStats.totalTestCases) * 100}%` }}
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total Tests</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Pass Rate</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Run</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map(project => (
                  <tr key={project.id}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{project.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{project.testCases}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{project.passRate}%</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{project.lastRun}</td>
                    <td className="px-4 py-2"><StatusBadge status={project.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

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

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'testcases' && renderTestCases()}
        {activeTab === 'testplans' && renderTestPlans()}
        {activeTab === 'testruns' && renderTestRuns()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Project Form Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {isProjectEditMode ? 'Edit Project' : 'Create New Project'}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({...projectForm, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              {/* Team Members */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Team Members</label>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Member
                  </button>
                </div>
                
                <div className="space-y-2">
                  {projectForm.team.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => updateTeamMember(index, e.target.value)}
                        placeholder="Enter team member name"
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {projectForm.team.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Case Mapping */}
              {isProjectEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Case Mapping</label>
                  
                  {/* Currently Mapped Test Cases */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Currently Mapped ({testCases.filter(tc => tc.project === (editingProject?.name || '')).length})</h4>
                    <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-blue-50">
                      {testCases.filter(tc => tc.project === (editingProject?.name || ''))
                        .map(testCase => (
                          <div key={testCase.id} className="flex items-center justify-between py-1">
                            <span className="text-sm">{testCase.title}</span>
                            <div className="flex items-center gap-2">
                              <PriorityBadge priority={testCase.priority} />
                              <button
                                onClick={() => {
                                  // Unmap test case from project
                                  setTestCases(testCases.map(tc => 
                                    tc.id === testCase.id 
                                      ? { ...tc, project: 'Unassigned' }
                                      : tc
                                  ));
                                }}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* Available Test Cases to Map */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Available Test Cases</h4>
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                      {testCases.filter(tc => tc.project !== (editingProject?.name || ''))
                        .map(testCase => (
                          <div key={testCase.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{testCase.title}</span>
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                {testCase.project}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <PriorityBadge priority={testCase.priority} />
                              <button
                                onClick={() => {
                                  // Map test case to this project
                                  setTestCases(testCases.map(tc => 
                                    tc.id === testCase.id 
                                      ? { ...tc, project: editingProject?.name || '' }
                                      : tc
                                  ));
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs bg-blue-100 px-2 py-1 rounded"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div>
                {isProjectEditMode && (
                  <button
                    onClick={openNewTestPlanModal}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Test Plan
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                    setIsProjectEditMode(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProjectSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {isProjectEditMode ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Plan Form Modal */}
      {showTestPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {isTestPlanEditMode ? 'Edit Test Plan' : 'Create Test Plan'}
            </h3>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 border-b pb-2">Basic Information</h4>
                
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={testPlanForm.projectId}
                    onChange={(e) => setTestPlanForm({...testPlanForm, projectId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Test Strategy */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 border-b pb-2">Test Strategy</h4>
                
                {/* Objectives */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Test Objectives</label>
                    <button
                      type="button"
                      onClick={addObjective}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {testPlanForm.strategy.objectives.map((objective, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          placeholder="Enter test objective..."
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        {testPlanForm.strategy.objectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeObjective(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Scope</label>
                  <textarea
                    value={testPlanForm.strategy.scope}
                    onChange={(e) => setTestPlanForm({
                      ...testPlanForm,
                      strategy: { ...testPlanForm.strategy, scope: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Define what will be tested..."
                    rows="3"
                  />
                </div>

                {/* Approach */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Approach</label>
                  <textarea
                    value={testPlanForm.strategy.approach}
                    onChange={(e) => setTestPlanForm({
                      ...testPlanForm,
                      strategy: { ...testPlanForm.strategy, approach: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe testing methodology and approach..."
                    rows="2"
                  />
                </div>

                {/* Resources */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resources Required</label>
                  <textarea
                    value={testPlanForm.strategy.resources}
                    onChange={(e) => setTestPlanForm({
                      ...testPlanForm,
                      strategy: { ...testPlanForm.strategy, resources: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List required resources, tools, and personnel..."
                    rows="2"
                  />
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <input
                    type="text"
                    value={testPlanForm.strategy.timeline}
                    onChange={(e) => setTestPlanForm({
                      ...testPlanForm,
                      strategy: { ...testPlanForm.strategy, timeline: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2 weeks, 1 month..."
                  />
                </div>

                {/* Deliverables */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Deliverables</label>
                    <button
                      type="button"
                      onClick={addDeliverable}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {testPlanForm.strategy.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={deliverable}
                          onChange={(e) => updateDeliverable(index, e.target.value)}
                          placeholder="Enter deliverable..."
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        {testPlanForm.strategy.deliverables.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDeliverable(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test Case Selection */}
              <div>
                <h4 className="text-md font-medium text-gray-800 border-b pb-2 mb-4">Test Case Selection</h4>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Test Cases</label>
                <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {testCases
                    .filter(tc => !testPlanForm.projectId || tc.project === projects.find(p => p.id == testPlanForm.projectId)?.name)
                    .map(testCase => (
                      <label key={testCase.id} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          checked={testPlanForm.testCases.includes(testCase.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTestPlanForm({
                                ...testPlanForm,
                                testCases: [...testPlanForm.testCases, testCase.id]
                              });
                            } else {
                              setTestPlanForm({
                                ...testPlanForm,
                                testCases: testPlanForm.testCases.filter(id => id !== testCase.id)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm flex-1">{testCase.title}</span>
                        <PriorityBadge priority={testCase.priority} />
                      </label>
                    ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowTestPlanModal(false);
                  setEditingTestPlan(null);
                  setIsTestPlanEditMode(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTestPlanSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {isTestPlanEditMode ? 'Update Test Plan' : 'Create Test Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Plan View Modal */}
      {showTestPlanViewModal && viewingTestPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">{viewingTestPlan.name}</h3>
                    {viewingTestPlan.isAIGenerated && (
                      <Bot className="w-5 h-5 text-purple-600" title="AI Generated" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Test Plan Details & Strategy</p>
                </div>
                <button
                  onClick={() => setShowTestPlanViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Overview</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{viewingTestPlan.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Project</div>
                    <div className="text-base font-semibold text-gray-900">
                      {projects.find(p => p.id === viewingTestPlan.projectId)?.name || 'Unknown'}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Test Cases</div>
                    <div className="text-base font-semibold text-gray-900">{viewingTestPlan.testCases.length}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Status</div>
                    <div className="text-base">
                      <StatusBadge status={viewingTestPlan.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Strategy */}
              {viewingTestPlan.strategy && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Strategy Document</h4>
                  
                  {/* Objectives */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-800 mb-2">Test Objectives</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {viewingTestPlan.strategy.objectives?.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Scope */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-800 mb-2">Test Scope</h5>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-gray-700">{viewingTestPlan.strategy.scope}</p>
                    </div>
                  </div>

                  {/* Approach */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-800 mb-2">Test Approach</h5>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-gray-700">{viewingTestPlan.strategy.approach}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Resources */}
                    <div>
                      <h5 className="text-md font-medium text-gray-800 mb-2">Resources Required</h5>
                      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                        <p className="text-gray-700 text-sm">{viewingTestPlan.strategy.resources}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h5 className="text-md font-medium text-gray-800 mb-2">Timeline</h5>
                      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                        <p className="text-gray-700 text-sm">{viewingTestPlan.strategy.timeline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mt-6">
                    <h5 className="text-md font-medium text-gray-800 mb-2">Expected Deliverables</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {viewingTestPlan.strategy.deliverables?.map((deliverable, index) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Test Cases */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Included Test Cases</h4>
                <div className="space-y-3">
                  {testCases
                    .filter(tc => viewingTestPlan.testCases.includes(tc.id))
                    .map(testCase => (
                      <div key={testCase.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-medium text-gray-900">{testCase.title}</h6>
                            <p className="text-sm text-gray-600">{testCase.description || 'No description available'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <PriorityBadge priority={testCase.priority} />
                            <span className="text-xs text-gray-500">
                              {testCase.testSteps ? testCase.testSteps.length : testCase.steps} steps
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={() => setShowTestPlanViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <div className="flex gap-3">
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  onClick={() => executeTestPlan(viewingTestPlan)}
                >
                  <Play className="w-4 h-4" />
                  Execute Plan
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Strategy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Case View Modal */}
      {showViewModal && viewingTestCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{viewingTestCase.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Test Case Details</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Test Case Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">Project</div>
                  <div className="text-lg font-semibold text-gray-900">{viewingTestCase.project}</div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium mb-1">Priority</div>
                  <div className="text-lg">
                    <PriorityBadge priority={viewingTestCase.priority} />
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium mb-1">Category</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {viewingTestCase.category || 'Functional'}
                  </div>
                </div>
              </div>

              {/* Description */}
              {viewingTestCase.description && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{viewingTestCase.description}</p>
                  </div>
                </div>
              )}

              {/* Test Steps */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Test Steps</h4>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {viewingTestCase.testSteps ? viewingTestCase.testSteps.length : viewingTestCase.steps} steps
                  </span>
                </div>
                
                <div className="space-y-4">
                  {(viewingTestCase.testSteps || []).length > 0 ? (
                    viewingTestCase.testSteps.map((step, index) => (
                      <div key={step.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <h5 className="font-medium text-gray-900">Step {index + 1}</h5>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Action</div>
                            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                              <p className="text-gray-800 text-sm leading-relaxed">
                                {step.action || 'No action specified'}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Expected Result</div>
                            <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                              <p className="text-gray-800 text-sm leading-relaxed">
                                {step.expected || 'No expected result specified'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No test steps defined yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Test Case ID:</span> #{viewingTestCase.id}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {viewingTestCase.lastRun}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditTestCaseModal(viewingTestCase);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Test Case
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Run Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Case Form Modal */}
      {showTestCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {isEditMode ? 'Edit Test Case' : 'Create New Test Case'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Case Title</label>
                <input
                  type="text"
                  value={testCaseForm.title}
                  onChange={(e) => setTestCaseForm({...testCaseForm, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter test case title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={testCaseForm.description}
                  onChange={(e) => setTestCaseForm({...testCaseForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the test case"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={testCaseForm.project}
                    onChange={(e) => setTestCaseForm({...testCaseForm, project: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.name}>{project.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={testCaseForm.priority}
                    onChange={(e) => setTestCaseForm({...testCaseForm, priority: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={testCaseForm.category}
                    onChange={(e) => setTestCaseForm({...testCaseForm, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Functional">Functional</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Performance">Performance</option>
                    <option value="Security">Security</option>
                    <option value="Integration">Integration</option>
                  </select>
                </div>
              </div>

              {/* Test Steps Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Test Steps</label>
                  <button
                    type="button"
                    onClick={addTestStep}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Step
                  </button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {testCaseForm.steps.map((step, index) => (
                    <div key={step.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Step {index + 1}</span>
                        {testCaseForm.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestStep(step.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Action</label>
                          <textarea
                            value={step.action}
                            onChange={(e) => updateTestStep(step.id, 'action', e.target.value)}
                            placeholder="Describe the action to perform..."
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows="2"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Expected Result</label>
                          <textarea
                            value={step.expected}
                            onChange={(e) => updateTestStep(step.id, 'expected', e.target.value)}
                            placeholder="Describe the expected result..."
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowTestCaseModal(false);
                  setEditingTestCase(null);
                  setIsEditMode(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTestCaseSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {isEditMode ? 'Update Test Case' : 'Create Test Case'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              AI Generation
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Generate Type</label>
              <select
                value={aiTask}
                onChange={(e) => setAiTask(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="project">Project</option>
                <option value="testcase">Test Case</option>
                <option value="testplan">Test Plan</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., User authentication system, Shopping cart functionality..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || isGenerating}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
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

      {/* Test Run View Modal */}
      {showTestRunViewModal && viewingTestRun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{viewingTestRun.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Test Run Execution Details</p>
                </div>
                <button
                  onClick={() => setShowTestRunViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Test Run Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">Status</div>
                  <StatusBadge status={viewingTestRun.status} />
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium mb-1">Passed</div>
                  <div className="text-2xl font-bold text-green-600">{viewingTestRun.passedTests}</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium mb-1">Failed</div>
                  <div className="text-2xl font-bold text-red-600">{viewingTestRun.failedTests}</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium mb-1">Skipped</div>
                  <div className="text-2xl font-bold text-yellow-600">{viewingTestRun.skippedTests}</div>
                </div>
              </div>

              {/* Test Cases Execution */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Case Results</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Test Case</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Priority</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Executed Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Notes</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {viewingTestRun.testCaseResults.map(result => {
                        const testCase = testCases.find(tc => tc.id === result.testCaseId);
                        if (!testCase) return null;

                        return (
                          <tr key={result.testCaseId} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{testCase.title}</div>
                            </td>
                            <td className="px-4 py-3">
                              <PriorityBadge priority={testCase.priority} />
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={result.status} />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {result.executedDate || 'Not executed'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                              {result.notes || 'No notes'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openExecuteTestCaseModal(viewingTestRun, result.testCaseId)}
                                  className="text-blue-600 hover:text-blue-800 text-sm bg-blue-100 px-2 py-1 rounded"
                                >
                                  {result.status === 'pending' ? 'Execute' : 'Update'}
                                </button>
                                <button 
                                  onClick={() => openViewTestCaseModal(testCase)}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Run Details */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Test Run ID:</span> #{viewingTestRun.id}
                  </div>
                  <div>
                    <span className="font-medium">Started:</span> {viewingTestRun.startDate}
                  </div>
                  <div>
                    <span className="font-medium">Executed by:</span> {viewingTestRun.executedBy}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={() => setShowTestRunViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Execute Test Case Modal */}
      {showExecuteTestCaseModal && executingTestCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-green-600" />
              Execute Test Case
            </h3>
            
            {(() => {
              const testCase = testCases.find(tc => tc.id === executingTestCase.testCaseId);
              return (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">{testCase?.title}</h4>
                  <p className="text-sm text-gray-600">{testCase?.description}</p>
                </div>
              );
            })()}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Result</label>
                <select
                  value={testCaseExecution.status}
                  onChange={(e) => setTestCaseExecution({...testCaseExecution, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="passed">✅ Passed</option>
                  <option value="failed">❌ Failed</option>
                  <option value="skipped">⏭️ Skipped</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Execution Notes</label>
                <textarea
                  value={testCaseExecution.notes}
                  onChange={(e) => setTestCaseExecution({...testCaseExecution, notes: e.target.value})}
                  placeholder="Add notes about the test execution..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowExecuteTestCaseModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTestCaseExecution}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Save Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagerPortal;
