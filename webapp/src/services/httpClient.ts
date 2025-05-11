import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

interface ErrorResponse {
  message: string;
  statusCode: number;
}

// Create axios instance with default config
const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response
  },
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response

      switch (status) {
        case 400:
          // Handle bad request
          throw new Error(data?.message || 'Bad request')
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/signin'
          throw new Error(data?.message || 'Unauthorized access')
        case 403:
          // Handle forbidden
          throw new Error(data?.message || 'Access forbidden')
        case 404:
          // Handle not found
          throw new Error(data?.message || 'Resource not found')
        case 409:
          // Handle conflict
          throw new Error(data?.message || 'Resource conflict')
        case 422:
          // Handle validation error
          throw new Error(data?.message || 'Validation error')
        case 500:
          // Handle server error
          throw new Error(data?.message || 'Internal server error')
        default:
          // Handle other errors
          throw new Error(data?.message || 'Something went wrong')
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server')
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Request failed')
    }
  }
)

export default httpClient
