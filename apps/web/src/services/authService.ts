import apiClient from './apiClient';

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/auth/register', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const data = new URLSearchParams();
    data.append('username', email);
    data.append('password', password);

    console.log("Sending login data:", data.toString());

    const response = await apiClient.post('/api/auth/login', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
