// Mock authentication API service
export const authApi = {
  async login(email: string, password: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock validation
    if (email === 'test@example.com' && password === 'password') {
      return { id: '1', email, name: 'Test User' };
    }
    throw new Error('Invalid credentials');
  },

  async register(name: string, email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock registration
    return { id: Date.now().toString(), email, name };
  },

  async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  }
};