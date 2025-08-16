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
        objectives: ['Ensure system stability', 'Validate core functionality'],
        scope: 'Full regression testing of core features',
        approach: 'Risk-based testing with automated regression suite',
        resources: 'QA team of 3 members, automated testing tools',
        timeline: '2 weeks testing phase',
        deliverables: ['Test execution report', 'Defect analysis']
      }
    }
  ]);

  const [testRuns, setTestRuns] = useState([
    {
      id: 1,
      name: 'Q4 Testing Plan - Run #1',
      testPlanId: 1,
      projectId: 1,
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

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTask, setAiTask] = useState('project');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [showTestPlanModal, setShowTestPlanModal] = useState(false);
  const [showTestRunModal, setShowTestRunModal] = useState(false);

  // Add view/edit modal states
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
    category: 'Functional'
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
    executedBy: 'Current User'
  });

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
    console.log('Create test case clicked'); // Debug log
    setTestCaseForm({
      title: '',
      description: '',
      project: projects.length > 0 ? projects[0].name : '',
      priority: 'Medium',
      category: 'Functional'
    });
    setShowTestCaseModal(true);
  };

  const handleCreateTestPlan = () => {
    console.log('Create test plan clicked'); // Debug log
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

  const handleCreateTestRun = () => {
    console.log('Create test run clicked'); // Debug log
    setTestRunForm({
      name: '',
      description: '',
      testPlanId: testPlans.length > 0 ? testPlans[0].id : '',
      projectId: projects.length > 0 ? projects[0].id : '',
      executedBy: 'Current User'
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
        category: item.category || 'Functional'
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
    console.log('Delete item clicked:', type, item);
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'project') {
        setProjects(projects.filter(p => p.id !== item.id));
      } else if (type === 'testcase') {
        setTestCases(testCases.filter(tc => tc.id !== item.id));
      } else if (type === 'testplan') {
        setTestPlans(testPlans.filter(tp => tp.id !== item.id));
      } else if (type === 'testrun') {
        setTestRuns(testRuns.filter(tr => tr.id !== item.id));
      }
    }
  };

  const handleProjectSubmit = () => {
    if (!projectForm.name.trim()) return;

    if (editingItem) {
      // Update existing project
      const updatedProjects = projects.map(p => 
        p.id === editingItem.id 
          ? { ...p, ...projectForm, team: projectForm.team.filter(member => member.trim() !== '') }
          : p
      );
      setProjects(updatedProjects);
      setEditingItem(null);
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
  };

  const handleTestCaseSubmit = () => {
    if (!testCaseForm.title.trim()) return;

    if (editingItem) {
      // Update existing test case
      const updatedTestCases = testCases.map(tc => 
        tc.id === editingItem.id 
          ? { ...tc, ...testCaseForm }
          : tc
      );
      setTestCases(updatedTestCases);
      setEditingItem(null);
    } else {
      // Create new test case
      const newTestCase = {
        id: testCases.length + 1,
        title: testCaseForm.title,
        project: testCaseForm.project,
        priority: testCaseForm.priority,
        status: 'pending',
        lastRun: new Date().toISOString().split('T')[0],
        steps: 0,
        description: testCaseForm.description,
        category: testCaseForm.category
      };
      setTestCases([...testCases, newTestCase]);
    }
    setShowTestCaseModal(false);
  };

  const handleTestPlanSubmit = () => {
    if (!testPlanForm.name.trim()) return;

    if (editingItem) {
      // Update existing test plan
      const updatedTestPlans = testPlans.map(tp => 
        tp.id === editingItem.id 
          ? { ...tp, ...testPlanForm, 
              strategy: {
                ...testPlanForm.strategy,
                objectives: testPlanForm.strategy.objectives.filter(obj => obj.trim() !== ''),
                deliverables: testPlanForm.strategy.deliverables.filter(del => del.trim() !== '')
              }
            }
          : tp
      );
      setTestPlans(updatedTestPlans);
      setEditingItem(null);
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
  };

  const handleTestRunSubmit = () => {
    if (!testRunForm.name.trim()) return;

    const selectedTestPlan = testPlans.find(tp => tp.id == testRunForm.testPlanId);
    const selectedTestCases = selectedTestPlan ? selectedTestPlan.testCases : [];

    if (editingItem) {
      // Update existing test run
      const updatedTestRuns = testRuns.map(tr => 
        tr.id === editingItem.id 
          ? { ...tr, ...testRunForm, 
              testCaseResults: selectedTestCases.map(tcId => ({
                testCaseId: tcId,
                status: 'pending',
                executedDate: null,
                notes: ''
              })),
              totalTests: selectedTestCases.length
            }
          : tr
      );
      setTestRuns(updatedTestRuns);
      setEditingItem(null);
    } else {
      // Create new test run
      const newTestRun = {
        id: testRuns.length + 1,
        name: testRunForm.name,
        description: testRunForm.description,
        testPlanId: testRunForm.testPlanId ? parseInt(testRunForm.testPlanId) : null,
        projectId: parseInt(testRunForm.projectId),
        status: 'in_progress',
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        executedBy: testRunForm.executedBy,
        testCaseResults: selectedTestCases.map(tcId => ({
          testCaseId: tcId,
          status: 'pending',
          executedDate: null,
          notes: ''
        })),
        totalTests: selectedTestCases.length,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0
      };
      setTestRuns([...testRuns, newTestRun]);
    }
    setShowTestRunModal(false);
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
        id: projects.length + 1,
        name: capitalizeWords(aiPrompt),
        description: `AI-generated testing project for ${aiPrompt}`,
        status: 'active',
        testCases: Math.floor(Math.random() * 20) + 5,
        passRate: Math.floor(Math.random() * 40) + 60,
        lastRun: new Date().toISOString().split('T')[0],
        team: ['AI Assistant', 'Test Lead']
      };
      setProjects([...projects, newProject]);
    } else if (aiTask === 'testcase') {
      const newTestCase = {
        id: testCases.length + 1,
        title: capitalizeWords(aiPrompt),
        project: projects.length > 0 ? projects[0].name : 'Default Project',
        priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        status: 'pending',
        lastRun: new Date().toISOString().split('T')[0],
        steps: Math.floor(Math.random() * 8) + 3,
        description: `AI-generated test case for ${aiPrompt} functionality`,
        category: 'Functional'
      };
      setTestCases([...testCases, newTestCase]);
    } else if (aiTask === 'testplan') {
      const newTestPlan = {
        id: testPlans.length + 1,
        name: capitalizeWords(aiPrompt) + ' Test Plan',
        description: `AI-generated test plan for ${aiPrompt} testing`,
        projectId: projects.length > 0 ? projects[0].id : 1,
        testCases: testCases.slice(0, Math.min(3, testCases.length)).map(tc => tc.id),
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
      setTestPlans([...testPlans, newTestPlan]);
    } else if (aiTask === 'testrun') {
      const selectedProject = projects.length > 0 ? projects[0] : null;
      const availableTestCases = testCases.filter(tc => 
        selectedProject ? tc.project === selectedProject.name : true
      );
      
      const selectedTestCases = availableTestCases
        .slice(0, Math.min(Math.floor(Math.random() * 3) + 2, availableTestCases.length))
        .map(tc => tc.id);

      const newTestRun = {
        id: testRuns.length + 1,
        name: `${capitalizeWords(aiPrompt)} - Test Run`,
        description: `AI-generated test run for ${aiPrompt} testing`,
        testPlanId: null,
        projectId: selectedProject?.id || 1,
        status: 'in_progress',
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        executedBy: 'AI Assistant',
        testCaseResults: selectedTestCases.map(tcId => ({
          testCaseId: tcId,
          status: 'pending',
          executedDate: null,
          notes: ''
        })),
        totalTests: selectedTestCases.length,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0
      };
      setTestRuns([...testRuns, newTestRun]);
    }
    
    setIsGenerating(false);
    setShowAIModal(false);
    setAiPrompt('');
  };

  const handleRunTest = (testCase) => {
    console.log('Run test clicked:', testCase);
    // Simulate running a test
    const updatedTestCases = testCases.map(tc => {
      if (tc.id === testCase.id) {
        return {
          ...tc,
          status: Math.random() > 0.5 ? 'passed' : 'failed',
          lastRun: new Date().toISOString().split('T')[0]
        };
      }
      return tc;
    });
    setTestCases(updatedTestCases);
  };

  const handleExecuteTestPlan = (testPlan) => {
    console.log('Execute test plan clicked:', testPlan);
    // Create a new test run from the test plan
    const newTestRun = {
      id: testRuns.length + 1,
      name: `${testPlan.name} - Auto Run`,
      description: `Automated execution of ${testPlan.name}`,
      testPlanId: testPlan.id,
      projectId: testPlan.projectId,
      status: 'in_progress',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      executedBy: 'Auto Executor',
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
    alert('Test plan execution started! Check Test Runs tab.');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={() => { 
            console.log('AI Generate clicked from dashboard'); // Debug log
            setShowAIModal(true); 
            setAiTask('project'); 
          }}
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
            onClick={handleCreateProject}
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
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
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
              {testCases.map(testCase => (
                <tr key={testCase.id} className="hover:bg-gray-50">
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
        {testPlans.map(testPlan => {
          const project = projects.find(p => p.id === testPlan.projectId);
          const planTestCases = testCases.filter(tc => testPlan.testCases.includes(tc.id));
          
          return (
            <div key={testPlan.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
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
        {testRuns.map(testRun => {
          const testPlan = testPlans.find(tp => tp.id === testRun.testPlanId);
          const project = projects.find(p => p.id === testRun.projectId);
          const passRate = testRun.totalTests > 0 ? Math.round((testRun.passedTests / testRun.totalTests) * 100) : 0;
          
          return (
            <div key={testRun.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
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
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
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
              <span className="text-lg font-bold text-gray-900">{testRuns.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed Runs</span>
              <span className="text-lg font-bold text-green-600">
                {testRuns.filter(tr => tr.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-lg font-bold text-yellow-600">
                {testRuns.filter(tr => tr.status === 'in_progress').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Pass Rate</span>
              <span className="text-lg font-bold text-blue-600">
                {testRuns.length > 0 
                  ? Math.round(testRuns.reduce((acc, tr) => acc + (tr.totalTests > 0 ? (tr.passedTests / tr.totalTests) * 100 : 0), 0) / testRuns.length)
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
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Tests</span>
              <span className="text-sm font-medium text-yellow-600">
                {testCases.filter(tc => tc.status === 'pending').length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${(testCases.filter(tc => tc.status === 'pending').length / dashboardStats.totalTestCases) * 100}%` }}
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
                {projects.map(project => {
                  const projectTestPlans = testPlans.filter(tp => tp.projectId === project.id);
                  const projectTestRuns = testRuns.filter(tr => tr.projectId === project.id);
                  
                  return (
                    <tr key={project.id}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{project.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{projectTestPlans.length}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{projectTestRuns.length}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{project.passRate}%</td>
                      <td className="px-4 py-2"><StatusBadge status={project.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

      {/* Debug info - remove this after testing */}
      <div className="fixed top-4 right-4 bg-black text-white p-2 text-xs z-50">
        Modals: AI:{showAIModal ? 'Y' : 'N'} | Proj:{showProjectModal ? 'Y' : 'N'} | TC:{showTestCaseModal ? 'Y' : 'N'} | TP:{showTestPlanModal ? 'Y' : 'N'} | TR:{showTestRunModal ? 'Y' : 'N'}
      </div>

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
                <option value="testrun">Test Run</option>
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

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
      {showTestCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Test Case' : 'Create New Test Case'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={testCaseForm.description}
                  onChange={(e) => setTestCaseForm({...testCaseForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the test case"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTestCaseModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTestCaseSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingItem ? 'Update Test Case' : 'Create Test Case'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Plan Modal */}
      {showTestPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create New Test Plan</h3>
            
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
                      <option key={project.id} value={project.id}>{project.name}</option>
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
                    <label key={testCase.id} className="flex items-center space-x-2">
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
                      <span className="text-sm">{testCase.title}</span>
                      <PriorityBadge priority={testCase.priority} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTestPlanModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTestPlanSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Test Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Run Modal */}
      {showTestRunModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create New Test Run</h3>
            
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
                      <option key={project.id} value={project.id}>{project.name}</option>
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
                      .filter(tp => tp.projectId == testRunForm.projectId)
                      .map(testPlan => (
                        <option key={testPlan.id} value={testPlan.id}>{testPlan.name}</option>
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
                Create Test Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {viewModalType === 'project' && `Project: ${viewModalData.name}`}
                {viewModalType === 'testcase' && `Test Case: ${viewModalData.title}`}
                {viewModalType === 'testplan' && `Test Plan: ${viewModalData.name}`}
                {viewModalType === 'testrun' && `Test Run: ${viewModalData.name}`}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(viewModalData, null, 2)}
              </pre>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagerPortal;
