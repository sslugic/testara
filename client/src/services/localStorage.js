// Add CSS override for left-aligned text
const addLeftAlignStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .App {
      text-align: left !important;
    }
    .container {
      text-align: left !important;
    }
    .text-center {
      text-align: left !important;
    }
    body, div, p, h1, h2, h3, h4, h5, h6 {
      text-align: left !important;
    }
  `;
  document.head.appendChild(style);
};

class LocalStorageService {
  constructor() {
    this.keys = {
      testCases: 'testara_test_cases',
      testPlans: 'testara_test_plans',
      testRuns: 'testara_test_runs',
      projects: 'testara_projects'
    };
    
    // Initialize with default data if empty
    this.initializeDefaults();
    
    // Apply left-aligned styles
    addLeftAlignStyles();
  }

  initializeDefaults() {
    if (!this.getProjects().length) {
      this.saveProjects([
        { _id: 'default', name: 'Default Project', description: 'Default project for testing' }
      ]);
    }
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Generic storage methods
  getFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  // Test Cases
  getTestCases() {
    return this.getFromStorage(this.keys.testCases);
  }

  saveTestCase(testCaseData) {
    const testCases = this.getTestCases();
    const newTestCase = {
      ...testCaseData,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: testCaseData.title || testCaseData.name || 'Untitled Test Case',
      description: testCaseData.description || '',
      steps: testCaseData.steps || [],
      priority: testCaseData.priority || 'Medium',
      status: testCaseData.status || 'Draft'
    };
    
    testCases.push(newTestCase);
    this.saveToStorage(this.keys.testCases, testCases);
    return newTestCase;
  }

  getTestCase(id) {
    const testCases = this.getTestCases();
    return testCases.find(tc => tc._id === id);
  }

  updateTestCase(id, updates) {
    const testCases = this.getTestCases();
    const index = testCases.findIndex(tc => tc._id === id);
    if (index !== -1) {
      testCases[index] = {
        ...testCases[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage(this.keys.testCases, testCases);
      return testCases[index];
    }
    return null;
  }

  deleteTestCase(id) {
    const testCases = this.getTestCases();
    const filtered = testCases.filter(tc => tc._id !== id);
    this.saveToStorage(this.keys.testCases, filtered);
    return true;
  }

  // Test Plans
  getTestPlans() {
    return this.getFromStorage(this.keys.testPlans);
  }

  saveTestPlan(testPlanData) {
    const testPlans = this.getTestPlans();
    const newTestPlan = {
      ...testPlanData,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      testCases: testPlanData.testCases || []
    };
    
    testPlans.push(newTestPlan);
    this.saveToStorage(this.keys.testPlans, testPlans);
    return newTestPlan;
  }

  getTestPlan(id) {
    const testPlans = this.getTestPlans();
    return testPlans.find(tp => tp._id === id);
  }

  // Test Runs
  getTestRuns() {
    return this.getFromStorage(this.keys.testRuns);
  }

  saveTestRun(testRunData) {
    const testRuns = this.getTestRuns();
    const newTestRun = {
      ...testRunData,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    testRuns.push(newTestRun);
    this.saveToStorage(this.keys.testRuns, testRuns);
    return newTestRun;
  }

  getTestRun(id) {
    const testRuns = this.getTestRuns();
    return testRuns.find(tr => tr._id === id);
  }

  // Projects
  getProjects() {
    return this.getFromStorage(this.keys.projects);
  }

  saveProjects(projects) {
    this.saveToStorage(this.keys.projects, projects);
  }

  // AI Generation Mock
  generateTestCases(description, projectId = 'default') {
    return [
      {
        title: `AI: ${description} - Basic Functionality`,
        description: `Verify basic functionality of ${description}`,
        projectId: projectId,
        steps: [
          { step: 'Navigate to the application', expectedResult: 'Application loads successfully' },
          { step: 'Perform primary action', expectedResult: 'Action completes as expected' }
        ],
        priority: 'High',
        status: 'Draft',
        category: 'Functional'
      },
      {
        title: `AI: ${description} - Edge Cases`,
        description: `Test edge cases and error handling for ${description}`,
        projectId: projectId,
        steps: [
          { step: 'Test with invalid input', expectedResult: 'Appropriate error message displayed' },
          { step: 'Test boundary conditions', expectedResult: 'System handles boundaries correctly' }
        ],
        priority: 'Medium',
        status: 'Draft',
        category: 'Functional'
      }
    ];
  }

  generateTestPlan(name, description, projectId = 'default') {
    return {
      name: `AI Generated: ${name}`,
      description: description || `Comprehensive test plan for ${name}`,
      projectId: projectId,
      testCases: [],
      phases: ['Unit Testing', 'Integration Testing', 'System Testing', 'User Acceptance Testing']
    };
  }

  // Utility methods
  clearAllData() {
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initializeDefaults();
  }

  exportData() {
    const data = {};
    Object.entries(this.keys).forEach(([name, key]) => {
      data[name] = this.getFromStorage(key);
    });
    return data;
  }

  importData(data) {
    Object.entries(data).forEach(([name, items]) => {
      if (this.keys[name]) {
        this.saveToStorage(this.keys[name], items);
      }
    });
  }

  // Override any potential API calls that might still exist
  async makeRequest() {
    throw new Error('No backend server - using localStorage only');
  }

  // Ensure all methods return promises for API compatibility
  async getTestCasesAsync() {
    return Promise.resolve(this.getTestCases());
  }

  async saveTestCaseAsync(testCaseData) {
    return Promise.resolve(this.saveTestCase(testCaseData));
  }

  async getTestPlansAsync() {
    return Promise.resolve(this.getTestPlans());
  }

  async saveTestPlanAsync(testPlanData) {
    return Promise.resolve(this.saveTestPlan(testPlanData));
  }

  async getTestRunsAsync() {
    return Promise.resolve(this.getTestRuns());
  }

  async saveTestRunAsync(testRunData) {
    return Promise.resolve(this.saveTestRun(testRunData));
  }

  async getProjectsAsync() {
    return Promise.resolve(this.getProjects());
  }

  // Mock health check that never connects to server
  async healthCheck() {
    return Promise.resolve({
      status: 'OK',
      storage: 'localStorage',
      connected: true,
      timestamp: new Date().toISOString()
    });
  }

  // Mock any remaining API endpoints
  async request(url, options = {}) {
    console.warn('API request intercepted - using localStorage instead:', url);
    return Promise.resolve({ 
      ok: true, 
      status: 200, 
      json: () => Promise.resolve({ message: 'Using localStorage' })
    });
  }

  // Disable any fetch calls
  fetch() {
    console.warn('Fetch call intercepted - no backend server available');
    return Promise.reject(new Error('No backend server - using localStorage only'));
  }
}

// Override global fetch for this service if needed
const originalFetch = window.fetch;
const localStorageInstance = new LocalStorageService();

// Monkey patch to catch any remaining API calls
localStorageInstance.disableNetworkCalls = () => {
  window.fetch = (...args) => {
    console.warn('Network call blocked - using localStorage only:', args[0]);
    return Promise.reject(new Error('Network calls disabled - using localStorage'));
  };
};

// Enable network call blocking
localStorageInstance.disableNetworkCalls();

export default localStorageInstance;
