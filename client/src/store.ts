import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import cacheReducer from "./reducers/cache";

const store = configureStore({
    reducer: {
        user: userReducer,
        cache: cacheReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;

export default store;
