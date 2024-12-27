export interface PatientChatListAndRequestScreen {
  patientId: string;
  patientName: string;
  latestMessage: string;
  latestTimestamp: string;
}


// Define the type for the prescription object
interface Medication {
  name: string;
  dosage: string;
  duration: string;
}

export interface MyPatientPrescriptionScreen {
  diagnosis: string;
  medications: Medication[];
  additionalNotes: string;
}


export interface MyPatientsScreen {
  id: string;
  patientName: string;
  contactNumber: string;
  slotStartTime: string;
  slotEndTime: string;
  date: string;
}


// Type Definitions
interface MedicationPrescriptionScreen {
  name: string;
  dosage: string;
  duration: string;
}

export interface PrescriptionScreen {
  patientId: string;
  doctorId: string;
  diagnosis: string;
  medications: MedicationPrescriptionScreen[];
  additionalNotes: string;
}



export interface PatientDetailsDoctorChatScreen {
  name: string;
  contactNumber?: string;
  email:string 
  gender:string
}
