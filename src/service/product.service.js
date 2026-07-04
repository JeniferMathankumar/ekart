import httpClient from '../http.common.js'

const getAllProduct = () =>{
    return httpClient.get("/products");
}
const getProductById = (id) =>{
    return httpClient.get(`/products/${id}`);
}
const createProduct = (product,token) =>{
    return httpClient.post("/admin/products",product,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
}
const updateProduct = (id,product,token) =>{
    return httpClient.put(`/admin/products/${id}`,product,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
}
const deleteProduct = (id,token) =>{
    return httpClient.delete(`/admin/products/${id}`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
}
export default {
    getAllProduct,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}