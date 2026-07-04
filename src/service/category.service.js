import httpClient from "../http.common";

export const getall = ()=>{
    return httpClient.get("/categories");
}
export const getcategoryById = (id) =>{
    return httpClient.post(`categories/${id}`)
}
export const deleteCat = (id,token) =>{
    return httpClient.delete(`/admin/categories/${id}`,{
       headers:{
            Authorization:`Bearer ${token}`
        } 
    })
}
export const addCat = (category,token) =>{
    return httpClient.post(`/admin/categories`,category,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}
export const updateCat = (id,category,token) =>{
    return httpClient.put(`/admin/categories/${id}`,category,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
}

export default {
    getall,
    getcategoryById,
    addCat,
    updateCat,
    deleteCat
}