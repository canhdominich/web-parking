import { httpClient } from "@/lib/httpClient";

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
}) => {
    const res = await httpClient.post('/users', data)
    return res.data
}

export const updateUser = async (id: string, data: {
    name?: string
    email?: string
    phone?: string
    password?: string
    role?: string
}) => {
    const res = await httpClient.patch(`/users/${id}`, data)
    return res.data
}

export const deleteUser = async (id: string) => {
    const res = await httpClient.delete(`/users/${id}`)
    return res.data
}

export interface CreateUserDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRole {
    id: number;
    name: string;
    description: string;
}
