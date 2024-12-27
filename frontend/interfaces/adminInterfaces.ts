export interface DoctorApprovalScreen {
  _id: string;
  name: string;
  email: string;
  licenseNumber: string;
  medicalLicense: string;
  specialization: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  experience: number;
}



export interface DoctorListingScreen {
  _id: string;
  name: string;
  email: string;
  licenseNumber: string;
  medicalLicense: string; 
  specialization: string;
  isVerified: boolean;
  isApproved: boolean; 
  experience:number; 
  createdAt: string;
}


export interface DoctorProfileScreen {
  doctorId: string;
}


export interface PatientListingScreen {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  otherDetails?: string; 
}


export interface PatientProfileAdminScreen {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  contactNumber: string;
  bloodGroup: string;
  isVerified: boolean;
  joinedDate: string;
  createdAt: string;
}

export interface ReportDataScreen {
  startDate: string;
  endDate: string;
  totalSlots: number;
  totalRevenue: number;
  mostRevenueDoctor: {
    name: string;
    email: string;
    contactNumber: string;
  } | null;
  doctorRevenue?: {
    doctorName: string;
    email: string;
    contact: string;
    specialization: string;
    totalRevenue: number;
  }[];
}

export interface TopBookedDoctorScreen {
  doctorId: string;
  doctorName: string;
  specialization: string;
  contactNumber: string;
  email: string;
  totalBookings: number;
}

export interface TopRevenueDoctorScreen {
  doctorId: string;
  doctorName: string;
  specialization: string;
  contactNumber: string;
  email: string;
  totalRevenue: number;
  adminProfit: number;
}