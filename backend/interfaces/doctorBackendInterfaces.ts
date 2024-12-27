export interface doctorServicesICreateDoctorMonthlySlotsParams {
  defaultMonthlyTime: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    breakStart: string;
    breakEnd: string;
  };
  excludedDates: string[];
  specificDates: string[];
  weeklyDays: { day: string, startTime: string, endTime: string }[]
}


export interface doctorServicesAddPrescriptionParams {
  slotId: string;
  patientId: string;
  doctorId: string;
  prescription: {
    doctorId: string;
    patientId: string;
    diagnosis: string;
    medications: string[];
    additionalNotes?: string;
  };
}

export interface doctorServicesPopulatedPatient {
  name: string;
  contactNumber: string;
  email:string;
}

export interface doctorServicesPopulatedSlot {
  startTime: string;
  endTime: string;
  date: string
}



