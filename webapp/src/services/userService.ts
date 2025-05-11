import httpClient from './httpClient';

export const getUsers = async () => {
    const res = await httpClient.get('/users');
    return res.data;
};

export const getUserById = async (id: string) => {
    const res = await httpClient.get(`/users/${id}`);
    return res.data;
};

export const createUser = async (data: {
    name: string
    email: string
    phone: string
    password: string
    role: string
    [key: string]: any
}) => {
    const res = await httpClient.post('/users', data)
    return res.data
}

export const updateUser = async (id: string, data: {
    name?: string
    email?: string
    [key: string]: any
}) => {
    const res = await httpClient.put(`/users/${id}`, data)
    return res.data
}

export const deleteUser = async (id: string) => {
    const res = await httpClient.delete(`/users/${id}`)
    return res.data
}