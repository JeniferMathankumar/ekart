import categoryService from '../../service/category.service';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAllCategoriesAPI = createAsyncThunk(
    '/category/fetchAll',
    async (_, thunkApi) => {
        try {
            console.log("API CALLED");
            const response = await categoryService.getall();
            return response.data?.data || response.data || [];
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    },
);

export const fetchCategoryByIdAPI = createAsyncThunk(
    'category/fetchCategoryById',
    async (id, thunkApi) => {
        try {
            const response = await categoryService.getcategoryById(id);
            return response.data?.data || response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    },
);

export const createCategoryAPI = createAsyncThunk(
    'category/createCategory',
    async ({ category, token }, thunkApi) => {
        try {
            const response = await categoryService.addCat(category, token);
            return response.data?.data || response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    },
);

export const updateCategoryAPI = createAsyncThunk(
    'category/updateCategory',
    async ({ id, category, token }, thunkApi) => {
        try {
            const response = await categoryService.updateCat(id, category, token);
            return response.data?.data || response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    },
);

export const deleteCategoryAPI = createAsyncThunk(
    'category/deleteCategory',
    async ({ id, token }, thunkApi) => {
        try {
            const response = await categoryService.deleteCat(id, token);
            return {
                id,
                message: response.data?.message || 'Category deleted successfully',
            };
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    },
);

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        loading: false,
        items: [],
        selectedCategory: null,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearCategory: (state) => {
            state.items = [];
        },
        clearCategoryMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategoriesAPI.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCategoriesAPI.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllCategoriesAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategoryByIdAPI.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryByIdAPI.fulfilled, (state, action) => {
                state.selectedCategory = action.payload;
                state.loading = false;
            })
            .addCase(fetchCategoryByIdAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCategoryAPI.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createCategoryAPI.fulfilled, (state, action) => {
                state.items = [action.payload, ...state.items];
                state.loading = false;
                state.successMessage = 'Category created successfully';
            })
            .addCase(createCategoryAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCategoryAPI.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateCategoryAPI.fulfilled, (state, action) => {
                state.items = state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.selectedCategory = action.payload;
                state.loading = false;
                state.successMessage = 'Category updated successfully';
            })
            .addCase(updateCategoryAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCategoryAPI.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteCategoryAPI.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload.id);
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(deleteCategoryAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCategory, clearCategoryMessages, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;