
import { createSlice } from '@reduxjs/toolkit';

interface Patient {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: Patient | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'PatientAuth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.patient;
            state.token = action.payload.token;
            
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


export const { setCredentials, clearCredentials,setToken } = authSlice.actions;


export default authSlice.reducer;
