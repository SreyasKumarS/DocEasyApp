import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import patientReducer from '../frontend/src/slices/patientSlice/patientAuthSlice';
import doctorReducer from '../frontend/src/slices/doctorSlice/doctorAuthSlice';
import adminReducer from '../frontend/src/slices/adminSlice/adminAuthSlice';



const persistConfig = {
  key: 'root',
  storage,
};


const rootReducer = combineReducers({
  PatientAuth: patientReducer,
  DoctorAuth: doctorReducer,
  AdminAuth: adminReducer,

});


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export default store;
