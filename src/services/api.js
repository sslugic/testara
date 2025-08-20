// Simple localStorage service
const localStorageService = {
  keys: {
    testCases: 'testara_test_cases',
    testPlans: 'testara_test_plans',
    testRuns: 'testara_test_runs',
    projects: 'testara_projects'
  },

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  },

  getFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Projects
  getProjects() {
    const projects = this.getFromStorage(this.keys.projects);
    if (projects.length === 0) {
      const defaultProjects = [
        { _id: 'default', name: 'Default Project', description: 'Default project for testing' }
      ];
      this.saveToStorage(this.keys.projects, defaultProjects);
      return defaultProjects;
    }
    return projects;
  },

  saveProject(projectData) {
    const projects = this.getProjects();
    const newProject = {
      ...projectData,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    this.saveToStorage(this.keys.projects, projects);
    return newProject;
  },

  updateProject(id, projectData) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p._id === id);
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage(this.keys.projects, projects);
      return projects[index];
    }
    return null;
  },

  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p._id !== id);
    this.saveToStorage(this.keys.projects, filtered);
    return true;
  },

  // Test Cases
  getTestCases() {
    return this.getFromStorage(this.keys.testCases);
  },

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
      status: testCaseData.status || 'Draft',
      category: testCaseData.category || 'Functional'
    };
    
    testCases.push(newTestCase);
    this.saveToStorage(this.keys.testCases, testCases);
    return newTestCase;
  },

  updateTestCase(id, testCaseData) {
    const testCases = this.getTestCases();
    const index = testCases.findIndex(tc => tc._id === id);
    if (index !== -1) {
      testCases[index] = {
        ...testCases[index],
        ...testCaseData,
        steps: testCaseData.steps || [],
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage(this.keys.testCases, testCases);
      return testCases[index];
    }
    return null;
  },

  deleteTestCase(id) {
    const testCases = this.getTestCases();
    const filtered = testCases.filter(tc => tc._id !== id);
    this.saveToStorage(this.keys.testCases, filtered);
    return true;
  },

  // Test Plans
  getTestPlans() {
    return this.getFromStorage(this.keys.testPlans);
  },

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
  },

  updateTestPlan(id, testPlanData) {
    const testPlans = this.getTestPlans();
    const index = testPlans.findIndex(tp => tp._id === id);
    if (index !== -1) {
      testPlans[index] = {
        ...testPlans[index],
        ...testPlanData,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage(this.keys.testPlans, testPlans);
      return testPlans[index];
    }
    return null;
  },

  deleteTestPlan(id) {
    const testPlans = this.getTestPlans();
    const filtered = testPlans.filter(tp => tp._id !== id);
    this.saveToStorage(this.keys.testPlans, filtered);
    return true;
  },

  // Test Runs
  getTestRuns() {
    return this.getFromStorage(this.keys.testRuns);
  },

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
  },

  updateTestRun(id, testRunData) {
    const testRuns = this.getTestRuns();
    const index = testRuns.findIndex(tr => tr._id === id);
    if (index !== -1) {
      testRuns[index] = {
        ...testRuns[index],
        ...testRunData,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage(this.keys.testRuns, testRuns);
      return testRuns[index];
    }
    return null;
  },

  deleteTestRun(id) {
    const testRuns = this.getTestRuns();
    const filtered = testRuns.filter(tr => tr._id !== id);
    this.saveToStorage(this.keys.testRuns, filtered);
    return true;
  }
};

class ApiService {
  constructor() {
    console.log('ApiService initialized - localStorage only mode');
  }

  // Helper method to sanitize data before sending
  sanitizeData(data) {
    const sanitized = { ...data };
    
    // Remove undefined values and empty strings that should be null
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined || sanitized[key] === '') {
        if (key.endsWith('Id') || key === 'testPlanId' || key === 'projectId') {
          delete sanitized[key]; // Remove undefined ObjectId fields
        }
      }
    });
    
    return sanitized;
  }

  // Projects
  async getProjects() {
    return Promise.resolve(localStorageService.getProjects());
  }

  async createProject(project) {
    const newProject = localStorageService.saveProject(project);
    return Promise.resolve(newProject);
  }

  async updateProject(id, project) {
    const updatedProject = localStorageService.updateProject(id, project);
    return Promise.resolve(updatedProject);
  }

  async deleteProject(id) {
    localStorageService.deleteProject(id);
    return Promise.resolve({ success: true });
  }

  // Test Cases
  async getTestCases() {
    return Promise.resolve(localStorageService.getTestCases());
  }

  async createTestCase(testCase) {
    const newTestCase = localStorageService.saveTestCase(testCase);
    return Promise.resolve(newTestCase);
  }

  async updateTestCase(id, testCase) {
    const updatedTestCase = localStorageService.updateTestCase(id, testCase);
    return Promise.resolve(updatedTestCase);
  }

  async deleteTestCase(id) {
    localStorageService.deleteTestCase(id);
    return Promise.resolve({ success: true });
  }

  // Test Plans
  async getTestPlans() {
    return Promise.resolve(localStorageService.getTestPlans());
  }

  async createTestPlan(testPlan) {
    const newTestPlan = localStorageService.saveTestPlan(testPlan);
    return Promise.resolve(newTestPlan);
  }

  async updateTestPlan(id, testPlan) {
    const updatedTestPlan = localStorageService.updateTestPlan(id, testPlan);
    return Promise.resolve(updatedTestPlan);
  }

  async deleteTestPlan(id) {
    localStorageService.deleteTestPlan(id);
    return Promise.resolve({ success: true });
  }

  // Test Runs
  async getTestRuns() {
    return Promise.resolve(localStorageService.getTestRuns());
  }

  async createTestRun(testRun) {
    const newTestRun = localStorageService.saveTestRun(testRun);
    return Promise.resolve(newTestRun);
  }

  async updateTestRun(id, testRun) {
    const updatedTestRun = localStorageService.updateTestRun(id, testRun);
    return Promise.resolve(updatedTestRun);
  }

  async deleteTestRun(id) {
    localStorageService.deleteTestRun(id);
    return Promise.resolve({ success: true });
  }
}

export default new ApiService();
