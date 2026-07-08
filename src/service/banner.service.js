import httpClient from '../http.common.js'
const getBanners = () => {
    return httpClient.get( "/banners" );
};

const createBanner = (form, token) => {
    return httpClient.post("/admin/banners", form,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
};

const updateBanner = (form, id, token) => {
    return httpClient.put(`/admin/banners/${id}`, form,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
};
const deleteBanner = (id, token) => {
    console.log("API DELETE", id+"***"+token);
    return httpClient.delete( `/admin/banners/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export default {
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner
};