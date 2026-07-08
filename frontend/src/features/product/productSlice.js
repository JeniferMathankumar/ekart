import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import productService from '../../service/product.service';

export const fetchAllProductsAPI = createAsyncThunk(
    'product/fetchAllProducts',
    async (_, thunkApi) => {
        try {
            const response = await productService.getAllProduct();
            return response.data?.data || [];
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchProductByIdAPI = createAsyncThunk(
    'product/fetchProductById',
    async (id, thunkApi) => {
        try {
            const response = await productService.getProductById(id);
            return response.data?.data || response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createProductAPI = createAsyncThunk(
    'product/createProduct',
    async ({ form, token }, thunkApi) => {
        try {
            const response = await productService.createProduct(form, token);
            return response.data?.data || response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateProductAPI = createAsyncThunk(
    'product/updateProduct',
    async ({ id, form, token }, thunkApi) => {
        try {
            const response = await productService.updateProduct(id, form, token);
            return response.data?.data || response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteProductAPI = createAsyncThunk(
    'product/deleteProduct',
    async ({ id, token }, thunkApi) => {
        try {
            const response = await productService.deleteProduct(id, token);
            return {
                id,
                message: response.data?.message || 'Product deleted successfully',
            };
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        items: [],
        selectedProduct: null,
        loading: false,
        submitting: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearProductMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProductsAPI.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProductsAPI.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllProductsAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductByIdAPI.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductByIdAPI.fulfilled, (state, action) => {
                state.selectedProduct = action.payload;
                state.loading = false;
            })
            .addCase(fetchProductByIdAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProductAPI.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createProductAPI.fulfilled, (state, action) => {
                state.items = [action.payload, ...state.items];
                state.submitting = false;
                state.successMessage = 'Product created successfully';
            })
            .addCase(createProductAPI.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            .addCase(updateProductAPI.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateProductAPI.fulfilled, (state, action) => {
                state.items = state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.selectedProduct = action.payload;
                state.submitting = false;
                state.successMessage = 'Product updated successfully';
            })
            .addCase(updateProductAPI.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            .addCase(deleteProductAPI.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteProductAPI.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload.id);
                state.submitting = false;
                state.successMessage = action.payload.message;
            })
            .addCase(deleteProductAPI.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });
    },
});

export const { clearProductMessages, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
