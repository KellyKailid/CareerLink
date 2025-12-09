const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Production URL: https://careerlink-3ggx.onrender.com/api

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// ==================== AUTH API ====================

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },
};

// ==================== JOBS API ====================

export const jobsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.jobType) params.append('jobType', filters.jobType);
    if (filters.location) params.append('location', filters.location);
    if (filters.skills) params.append('skills', filters.skills);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    return handleResponse(response);
  },

  getMyJobs: async () => {
    const response = await fetch(`${API_BASE_URL}/jobs/my`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  create: async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  update: async (id, jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },
};

// ==================== EXPERIENCES API ====================

export const experiencesAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/experiences${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}`);
    return handleResponse(response);
  },

  getMyExperiences: async () => {
    const response = await fetch(`${API_BASE_URL}/experiences/my`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  create: async (experienceData) => {
    const response = await fetch(`${API_BASE_URL}/experiences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(experienceData),
    });
    return handleResponse(response);
  },

  update: async (id, experienceData) => {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(experienceData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },
};

// ==================== SAVED API ====================

export const savedAPI = {
  // Saved Jobs
  getSavedJobs: async () => {
    const response = await fetch(`${API_BASE_URL}/saved/jobs`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  saveJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/saved/jobs/${jobId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  unsaveJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/saved/jobs/${jobId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  checkJobSaved: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/saved/jobs/${jobId}/check`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  // Saved Experiences
  getSavedExperiences: async () => {
    const response = await fetch(`${API_BASE_URL}/saved/experiences`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  saveExperience: async (experienceId) => {
    const response = await fetch(`${API_BASE_URL}/saved/experiences/${experienceId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  unsaveExperience: async (experienceId) => {
    const response = await fetch(`${API_BASE_URL}/saved/experiences/${experienceId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  checkExperienceSaved: async (experienceId) => {
    const response = await fetch(`${API_BASE_URL}/saved/experiences/${experienceId}/check`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },
};

