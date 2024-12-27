import { createSlice } from '@reduxjs/toolkit';

interface Doctor {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: Doctor | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};
const authSlice = createSlice({
    name: 'DoctorAuth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.doctor; 
            state.token = action.payload.token;
            console.log('Updated DoctorAuth state:', JSON.parse(JSON.stringify(state)));

            
        },
        setToken: (state, action) => {
            state.token = action.payload.token; // Update only the token field
        },
        clearCredentials: (state) => {
            state.isAuthenticated = false;
            state.user = null;    
            state.token = null;   
        },
    },
});

export const { setCredentials,setToken, clearCredentials } = authSlice.actions;


export default authSlice.reducer;
