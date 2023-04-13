import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = { pfp: "" };

const cacheSlice = createSlice({
    name: "cache",
    initialState: { value: initialStateValue },
    reducers: {
        updateCache: (state, action: { payload: { pfp: string }, type: string }) => {
            state.value = action.payload;
        },

        clearCache: (state, _) => {
            state.value = initialStateValue;
        }
    },
});

export const { updateCache, clearCache } = cacheSlice.actions; 

export default cacheSlice.reducer;
