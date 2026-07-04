import httpClient from '../http.common';

const login = (login) => {
    return httpClient.post('/auth/login',login);
}
const register =(register) =>{
    return httpClient.post('/auth/register',register);
}
const forgot_password = (email) =>{
    return httpClient.post('/auth/send-otp',email);
}
const verify_otp = (verifyOtp) => {
    return httpClient.post('/auth/verify-otp', verifyOtp);
}
const reset_password = (reset) =>{
    return httpClient.post('/auth/reset-password-by-otp',reset);
}
const banners = ()=>{
    return httpClient.get('/banners');
}

const profileUpdate = (formdata,token)=>{
    return httpClient.put('/profile-update',formdata,{
        headers :{
         Authorization: `Bearer ${token}`
    }
    });
}

const getAllUsers = (token) => {
    return httpClient.get('/admin/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const deleteUser = (userId, token) => {
    return httpClient.delete(`/admin/users/${userId}`, {
        headers: { 
            Authorization: `Bearer ${token}`
        }
    });
}
const getUserById = (userId, token) => {
    return httpClient.get(`/admin/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export default {
    login,
    register,
    forgot_password,
    reset_password,
    banners,
    verify_otp,
    profileUpdate,
    getAllUsers,
    deleteUser,
    getUserById
}
