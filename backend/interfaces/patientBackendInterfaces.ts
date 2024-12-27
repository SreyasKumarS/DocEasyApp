export interface patientControllerNotification {
  _id: string;
  patientId: string;
  doctorId: string;
  type: string;
  message: string;
  reason?: string;
  refundAmount?: number;
  refundStatus?: string;
  status: 'read' | 'unread'; // Use string union type for status
  createdAt: string;
  updatedAt: string;
}



export interface patientServiceSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface patientServiceSlotDoctor {
  _id: string;
  name: string;
  clinicAddress: string;
  locality: string;
}

export interface patientServiceSBooking {
  _id: string;
  slotId: patientServiceSlot;
  doctorId: patientServiceSlotDoctor;
  patientId: string;
  bookingStatus: string;
  amount:number;
}



export interface patientServiceSPopulatedPatient {
  name: string;
  contactNumber: string;
  email: string; // Added based on your schema
}

export interface patientServiceSPopulatedSlot {
  startTime: string;
  endTime: string;
  date: string; // Adjusted to match lowercase usage in schema
}

export interface patientServiceSPopulatedDoctor {
  _id:string,
  name: string;
  specialization?: string; 
  clinicAddress?: string;  
  locality?: string;       
  experience?: number;     
}
