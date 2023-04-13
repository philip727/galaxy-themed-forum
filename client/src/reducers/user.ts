import { createSlice } from '@reduxjs/toolkit';
import { IUserReducerAction } from '../types/user';

const initialStateValue = { username: "", uid: -1, role: "user", regdate: "", bio: "" };

const userSlice = createSlice({
    name: "user",
    initialState: { value: initialStateValue, isAuthenticed: false },
    reducers: {
        updateUser: (state, action: IUserReducerAction) => {
            state.value = action.payload;
            state.isAuthenticed = (action.payload.uid >= 0 && action.payload.username.length > 0);
        },

        clearUser: (state) => {
            state.value = initialStateValue;
            state.isAuthenticed = false;
        }
    },
});

export const { updateUser, clearUser } = userSlice.actions; 

export default userSlice.reducer;
