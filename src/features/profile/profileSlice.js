import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../service/user.service";

export const updateProfileAPI = createAsyncThunk(
    'profile/updateProfile',
    async ({ formData, token }, thunkApi) => {
        try {
            const response = await userService.profileUpdate(formData, token);
            return response.data?.data || response.data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
        }
    },
);
export const LoginApi = createAsyncThunk(
    'profile/login',
    async (login, thunkAPi) => {
        try {
            const response = await userService.login(login);
            return response.data?.data || response.data;
        } catch (error) {
            return thunkAPi.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)
const initialState = {
        name: '',
        email: '',
        profileimage: '',
        imageUrl: '',
        role: '',
        token: '',
        tokenExpiry: '',
        loading: false,
        error: null,
        successMessage: null,
        isAthunticated: false,
    };
const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
        logoutUser: (state) => initialState,
        clearProfile: (state) => {
            state.name = '';
            state.email = '';
            state.profileimage = '';
            state.imageUrl = '';
            state.role = '';
            state.token = '';
            state.tokenExpiry = '';
            state.loading = false;
            state.error = null;
            state.successMessage = null;
            state.isAthunticated = false;
        },
        clearProfileMessages(state) {
            state.successMessage = null;
            state.error = null;
        },
        updateProfileField(state, action) {
            const { field, value } = action.payload;
            if (field in state) {
                state[field] = value;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfileAPI.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfileAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.name = action.payload?.name || state.name || '';
                state.email = action.payload?.email || state.email || '';
                const imageValue = action.payload?.profileimage ?? action.payload?.imageUrl ?? state.profileimage ?? state.imageUrl ?? '';
                state.profileimage = imageValue;
                state.imageUrl = imageValue;
                state.role = action.payload?.role || state.role || '';
                state.token = action.payload?.token || state.token || '';
                state.tokenExpiry = action.payload?.tokenExpiry || state.tokenExpiry || '';
                state.isAthunticated = true;
            })
            .addCase(updateProfileAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message;
            })
            .addCase(LoginApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginApi.fulfilled, (state, action) => {
                state.loading = false;
                state.name = action.payload?.username || action.payload?.name || '';
                state.email = action.payload?.email || '';
                const loginImage = action.payload?.profileimage ?? action.payload?.profileImage ?? action.payload?.imageUrl ?? '';
                state.profileimage = loginImage;
                state.imageUrl = loginImage;
                state.role = action.payload?.role || '';
                state.token = action.payload?.token || '';
                state.tokenExpiry = action.payload?.tokenExpiry || '';
                state.successMessage = action.payload?.successMessage || 'Login successful';
                state.isAthunticated = true;
            })
            .addCase(LoginApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearProfile, clearProfileMessages, logoutUser, updateProfileField } = profileSlice.actions;
export default profileSlice.reducer;