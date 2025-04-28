import axios from 'axios'

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Gắn token tự động trước mỗi request
httpClient.interceptors.request.use((config) => {
  // Có thể lấy token từ localStorage, cookie, hoặc bất kỳ đâu
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export default httpClient
