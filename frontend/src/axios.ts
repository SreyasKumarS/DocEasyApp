import axios from 'axios';
import store from '../store';
import { toast } from 'react-toastify';
import { setCredentials as setAdminCredentials, clearCredentials as clearAdminCredentials } from '../src/slices/adminSlice/adminAuthSlice';
import { setCredentials as setDoctorCredentials, clearCredentials as clearDoctorCredentials } from '../src/slices/doctorSlice/doctorAuthSlice';
import { setCredentials as setPatientCredentials, clearCredentials as clearPatientCredentials } from '../src/slices/patientSlice/patientAuthSlice';
import { setToken as setDoctorToken } from '../src/slices/doctorSlice/doctorAuthSlice';
import { setToken as setAdminToken } from '../src/slices/adminSlice/adminAuthSlice';
import { setToken as setPatientToken } from '../src/slices/patientSlice/patientAuthSlice';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true,
});

// Define the roles explicitly
type Role = 'doctor' | 'admin' | 'patient' | null;

// Function to extract role from the request URL
const extractRoleFromURL = (url: string): Role => {
    if (url.startsWith('/doctor/')) return 'doctor';
    if (url.startsWith('/admin/')) return 'admin';
    if (url.startsWith('/patients/')) return 'patient';
    return null;
};

// Define the structure of role details
interface RoleDetails {
    token: string | null;
    setCredentials: Function;
    setToken: Function;
    clearCredentials: Function;
}

// Function to get role-specific token and actions
const getRoleDetails = (role: Role): RoleDetails | null => {
    const state = store.getState();

    switch (role) {
        case 'doctor':
            return {
                token: state.DoctorAuth?.token || null,
                setCredentials: setDoctorCredentials,
                setToken: setDoctorToken,
                clearCredentials: clearDoctorCredentials,
            };
        case 'admin':
            return {
                token: state.AdminAuth?.token || null,
                setCredentials: setAdminCredentials,
                setToken: setAdminToken, // Adjust if admin has a separate token setter
                clearCredentials: clearAdminCredentials,
            };
        case 'patient':
            return {
                token: state.PatientAuth?.token || null,
                setCredentials: setPatientCredentials,
                setToken: setPatientToken,
                clearCredentials: clearPatientCredentials,
            };
        default:
            console.warn('No matching role found');
            return null;
    }
};

api.interceptors.request.use(
    (config) => {
        const role = extractRoleFromURL(config.url || '');
        const roleDetails = getRoleDetails(role);
        console.log('Current Role:',  role);
        console.log('roleDetails:',  roleDetails);

        if (roleDetails?.token) {
            config.headers.Authorization = `Bearer ${roleDetails.token}`;
        } else {
            console.warn(`No token found for role: ${role}`);
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            const role = extractRoleFromURL(originalRequest.url || '');
            const roleDetails = getRoleDetails(role);

            if (roleDetails) {
                try {
                    const { data } = await api.post('/refresh-token', { role });
                    console.log(data,'rslt din axios resposne intercepotorrrrrrrrrrr');
                    store.dispatch(roleDetails.setToken({ token: data.accessToken }));
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    store.dispatch(roleDetails.clearCredentials());
                    toast.error('Session expired. Please log in again.');
                    return Promise.reject(err);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
