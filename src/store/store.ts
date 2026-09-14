import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import type { PersistedState } from "redux-persist/es/types";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "@/slice/requestSlice";
import authReducer from "@/features/auth/store/authSlice";
import dictionaryOverview from "@/slice/dictionaryOverviewSlice";


const reducers = combineReducers({
    auth: authReducer,
    dictionaryOverview: dictionaryOverview,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth", "dictionaryOverview"],
    blacklist: [apiSlice.reducerPath],
    migrate: (persistedState: PersistedState): Promise<PersistedState> => {
        if (!persistedState || typeof persistedState !== "object") {
            return Promise.resolve(undefined);
        }
        const state = persistedState as Record<string, unknown>;
        // Migrate from old "authAdmin" key to new "auth" key
        const authData = state.auth ?? state.authAdmin;
        const migrated = {
            _persist: { version: 1, rehydrated: false },
            ...(authData !== undefined && { auth: authData }),
            ...(state.dictionaryOverview !== undefined && { dictionaryOverview: state.dictionaryOverview }),
        } as PersistedState;
        return Promise.resolve(migrated);
    },
};


const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                    "persist/PAUSE",
                    "persist/PURGE",
                    "persist/FLUSH",
                    "persist/REGISTER",
                ],
            },
        }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

// Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persistor
export const persistor = persistStore(store);