import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getProperties = () => api.get('/properties')
export const getProperty = (id) => api.get(`/properties/${id}`)
export const createProperty = (data) => api.post('/properties', data)
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data)
export const deleteProperty = (id) => api.delete(`/properties/${id}`)

export const getUsers = () => api.get('/users')
export const createUser = (data) => api.post('/users', data)

export default api
