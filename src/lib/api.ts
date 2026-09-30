import axios from 'axios';

const API_URL = '/api';

export const api = axios.create({
  baseURL: API_URL,
});

export async function getPortfolioData() {
  const { data } = await api.get('/portfolio');
  return data;
}

export async function submitContact(formData: { name: string; email: string; message: string }) {
  const { data } = await api.post('/portfolio/contact', formData);
  return data;
}
