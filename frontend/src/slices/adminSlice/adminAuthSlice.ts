import { createSlice } from '@reduxjs/toolkit';

interface Admin {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: Admin | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'AdminAuth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
           

            state.isAuthenticated = true;
            state.user = action.payload.admin; 
            state.token = action.payload.token; 
        },  
        setToken: (state, action) => {
            state.token = action.payload.token; // Update only the token field
        },
        clearCredentials: (state) => {
            console.log('Clearing admin credentials');
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
    },
});


export const { setCredentials, clearCredentials, setToken } = authSlice.actions;


export default authSlice.reducer;
