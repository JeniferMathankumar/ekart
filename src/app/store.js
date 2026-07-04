import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from '../features/category/categorySlice'
import productReducer from '../features/product/productSlice'
import profileReducer from '../features/profile/profileSlice'
import storageModule from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'

const storage = storageModule.default ?? storageModule

const persistConfig = {
    key: 'root',
    // version: 1,
    storage,
    whitelist: ["category", "product", "profile"],
}

const appReducer = combineReducers({
    category: categoryReducer,
    product: productReducer,
    profile: profileReducer,
});

const rootReducers = (state, action) => {
    if(action.type === 'RESET_APP'){
        state = undefined;
    }
    return appReducer(state,action);
};

const persistedReducer = persistReducer(persistConfig, rootReducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)
export default store