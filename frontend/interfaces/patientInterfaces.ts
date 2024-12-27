export interface AppointmentHistoryScreen {
  index: number;
  bookingId: string;
  date: string;
  slotTime: string;
  doctorName: string;
  patientName: string;
  contactNumber: string;
  specialization?: string;     
  clinicAddress?: string;     
  locality?: string;        
  experience?: number;
  doctorId:string;        
  additionalNotes?: string;  
}


export interface BookingConfirmedScreen {
  _id: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  doctorName: string;
  clinicAddress: string;
  locality: string;
  status: string;
  bookingStatus: string;
  amount: number;
}


export interface BookingSucessPageScreen {
  doctorName: string;
  doctorAddress: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
}


// Define types for Doctor and Review
export interface DoctorDetailsPagePatient{
  _id: string;
  name: string;
  experience: number;
  specialization: string;
  contactNumber: string;
  clinicAddress: string;
  locality: string;
  biography: string;
  profilePicture: string;
}

export interface DoctorDetailsPagePatientReview {
  patientName: string;
  comment: string;
  rating: number;
}

// Define the Doctor type
export interface DoctorListingScreen {
  _id: string;
  name: string;
  experience: number;
  specialization: string;
  contactNumber: string;
  clinicAddress: string;
  locality:string,
  profilePicture: string;
}

export interface EditPatientProfileScreen {
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  locality:string;
  contactNumber: string;
  bloodGroup: string;
}

export interface HomeScreenDoctor {
  _id: string;
  name: string;
  experience: number;
  specialization: string;
  contactNumber: string;
  clinicAddress: string;
  locality: string;
  profilePicture: string;
  averageRating?: number | null; 
}

export interface NotificationScreen {
  _id: string;
  type: string;
  message: string;
  reason?: string;
  refundAmount?: number;
  refundStatus?: string;
  status: string;
  createdAt: string;
}


interface PatientPrescritpionPageMedication {
  name: string;
  dosage: string;
  duration: string;
}

export interface PatientPrescritpionPage {
  diagnosis: string;
  medications: PatientPrescritpionPageMedication[];
  additionalNotes: string;
}

export interface PatientProfileScreenPatientData {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  locality:string;
  contactNumber: string;
  bloodGroup: string;
  isVerified: boolean;
  joinedDate: string;
  createdAt: string;
}


export interface SpecializationScreen {
  _id: string;
  name: string;
  isActive: boolean;
  doctorCount: number;
}

export interface SpecializationScreenDoctor {
  _id: string;
  name: string;
  experience: number;
  specialization: string;
  contactNumber: string;
  clinicAddress: string;
  locality: string;
  profilePicture: string;
}


export interface Wallet {
  balance: number;
}

export interface TransactionWalletScreen {
  _id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}



export interface DoctorDetailsPatientChatScreen {
  name: string;
  specialization: string;
  clinicAddress?: string; // Optional
  contactNumber?: string;
  experience:string // Optional
}
