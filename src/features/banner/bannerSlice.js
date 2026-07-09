import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannerService from '../../service/banner.service'

export const fetAllBannersApi =await createAsyncThunk(
    "banner/fetchAll",
    async (thunkApi) => {
        try {
            const response = await bannerService.getBanners();
            console.log("RES BANNER ****", response.data);
            return response.data?.data || response.data || [];
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message)
        }
    },
);
export const updateBannerByIdApi = await createAsyncThunk(
    "banner/updateByid",
    async ({ id, token, banner }, thunkApi) => {
        try {
            const response = await bannerService.updateBanner(id, banner, token);
            return response.data?.data || response.data || [];
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    },
)
export const deleteBannerByIdApi = await createAsyncThunk(
    "banner/deletebyid",
    async ({ id, token }, thunkApi) => {
        console.log("RESRRSRSRSR" , id+"&*&*&*&"+token);
        try {
            const response = await bannerService.deleteBanner(id, token);
            console.log("RESRRSRSRSR" , response);
            return response.data?.data || response.data || [];
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    },
)

const bannerSlice = createSlice({
    name: 'banner',
    initialState: {
        loading: false,
        items: [],
        errors: null,
        selectedBanner: null,
        successMessage: null,
        totalitem: 0,
    },
    reducers: {
        clearBanners: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetAllBannersApi.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(fetAllBannersApi.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.totalitem = state.items.length;

            })
            .addCase(fetAllBannersApi.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload;
            })
            .addCase(updateBannerByIdApi.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(updateBannerByIdApi.fulfilled, (state, action) => {
                state.items = state.items.map((item) => {
                    item.id === action.payload.id ? action.payload : item;
                })
                state.totalitem = state.items.length;
                state.loading = false;
                state.selectedBanner = action.payload;
                state.successMessage = "Banner updated successfully"

            })
            .addCase(updateBannerByIdApi.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload;
            })
            .addCase(deleteBannerByIdApi.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(deleteBannerByIdApi.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.id !== action.payload.id);
                state.totalitem = state.items.length;
                state.successMessage = action.payload.message;
            })
            .addCase(deleteBannerByIdApi.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload;
            })
    },
});

export const { clearBanners } = bannerSlice.actions;
export default bannerSlice.reducer; 