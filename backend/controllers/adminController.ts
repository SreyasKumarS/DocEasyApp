import { Response, Request, NextFunction } from 'express';
import AdminService from '../services/adminServices.js';

class AdminController {

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { email, otp } = req.body;
  try {
    await AdminService.verifyOtp(email, otp);
    return res.status(201).json({ message: 'Admin verified successfully' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    next(error);
  }
};


async resendOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { email } = req.body;
  try {
    await AdminService.resendOtp(email);
    return res.status(200).json({ message: 'OTP resent to your email' });
  } catch (error) {
    next(error);
  }
};

// Login Admin
async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { email, password } = req.body;
  try {
    const result = await AdminService.loginAdmin(email, password, res);
    return res.status(200).json({
      message: 'Login successful',
      admin: result.admin,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

// Logout Admin
async logoutAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    await AdminService.logoutAdmin(res);
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

// Send OTP for password reset (Admin)
async sendAdminResetOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { email } = req.body;
  try {
    await AdminService.sendResetOtp(email); 
    return res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error in sendAdminResetOtp controller:', error); 
    if (error instanceof Error) {
      console.error('Error message:', error.message); 
      return res.status(500).json({ message: error.message });
    } else {
      console.error('Unknown error in sendAdminResetOtp controller:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// Reset Admin password
async resetAdminPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { email, newPassword, confirmPassword } = req.body;

 
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    
    await AdminService.resetPassword(email, newPassword);
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting admin password:', error); 
    next(error); 
  }
};


//doctor aprovals------------------------------------------------------------------------------------------

// Fetch unapproved doctors
async fetchUnapprovedDoctors(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const doctors = await AdminService.fetchUnapprovedDoctors();  // Fetch unapproved doctors from the service
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching unapproved doctors:', error);
    next(error);
  }
};

// Approve a doctor
async approveDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  
  const { doctorId } = req.params;
  try {
    await AdminService.approveDoctor(doctorId);  // Approve doctor in the service
    return res.status(200).json({ message: 'Doctor approved successfully' });
  } catch (error) {
    console.error('Error approving doctor:', error);
    next(error);
  }
};

// Reject a doctor
async deleteDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
 
  const { doctorId } = req.params;
  try {
    await AdminService.deleteDoctor(doctorId);  // Reject doctor in the service
    return res.status(200).json({ message: 'Doctor rejected successfully' });
  } catch (error) {
    console.error('Error rejecting doctor:', error);
    next(error);
  }
};



async fetchPatientListing(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const doctors = await AdminService.fetchPatientListing();  // Fetch unapproved doctors from the service
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching unapproved doctors:', error);
    next(error);
  }
};


async deletePatient(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
 
  const { patientId} = req.params;
  try {
    await AdminService.deletePatient(patientId);  
    return res.status(200).json({ message: 'Doctor rejected successfully' });
  } catch (error) {
    console.error('Error rejecting doctor:', error);
    next(error);
  }
};




async blockDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { doctorId } = req.params;
  try {
    await AdminService.blockDoctor(doctorId); 
    return res.status(200).json({ message: 'Doctor blocked successfully' });
  } catch (error) {
    console.error('Error blocking doctor:', error);
    next(error);
  }
};

// Unblock a doctor
async unblockDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { doctorId } = req.params;
  try {
    await AdminService.unblockDoctor(doctorId); 
    return res.status(200).json({ message: 'Doctor unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking doctor:', error);
    next(error);
  }
};



// Fetch all doctors
async fetchAllDoctors(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
  
    const doctors = await AdminService.fetchAllDoctors();
    
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching all doctors:', error);
    next(error);
  }
};



async fetchDoctorProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const {doctorId }= req.params;
    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    const doctor = await AdminService.fetchDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    return res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    next(error);
  }
};




async rejectDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
  const { doctorId } = req.params;
  const { reason } = req.body;
  
  try {
    await AdminService.rejectDoctor(doctorId, reason);
    return res.status(200).json({ message: 'Doctor rejected and notified successfully' });
  } catch (error) {
    console.error('Error rejecting doctor:', error);
    return res.status(500).json({ message: 'Error rejecting doctor' });
  }
};



 async updatePlatformFee (req: Request, res: Response): Promise<Response> {
  const { percentageFee, fixedFee } = req.body;
  try {
    if (
      (percentageFee !== null && fixedFee !== null) ||
      (percentageFee === null && fixedFee === null)
    ) {
      return res.status(400).json({
        message: 'Please provide only one: either percentage or fixed money value.',
      });
    }

    const updatedFee = await AdminService.updatePlatformFee(percentageFee, fixedFee);
    if (!updatedFee) {
      return res.status(404).json({ message: 'Admin record not found.' });
    }

  
    return res.status(200).json({
      message: 'Platform fee updated successfully.',
      data: updatedFee,
    });
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({
      message: 'An error occurred while updating the platform fee.',
    });
  }
};



async TopRevenueDoctors (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
   
    const page = parseInt(req.query.page as string, 10) || 1; 
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const data = await AdminService.getTopRevenueDoctor(page, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching top doctors:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


 async getTopRatedDoctors(req: Request, res: Response): Promise<Response>{
  const { page, limit } = req.query;
    
  try {
    const result = await AdminService.getTopRatedDoctors(parseInt(page as string), parseInt(limit as string));
 
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching top-rated doctors' });
  }
};



async getTopPatients(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;


    const data = await AdminService.fetchTopPatients(page, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching top patients:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


async getTopBookedDoctors (req: Request, res: Response){
  const { page = 1, limit = 10 } = req.query;

  try {
    const result = await AdminService.fetchTopBookedDoctors(Number(page), Number(limit));
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching top-booked doctors:', error);
    res.status(500).json({ error: 'Error fetching top-booked doctors' });
  }
};



// Controller
async getSpecializationsPieChart(req: Request, res: Response) {
  try {
    const revenueData = await AdminService.getSpecializationsPieChart();
    res.status(200).json(revenueData);
  } catch (error) {
    console.error('Error fetching specialization pie chart data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




async  getDoctorsRevenueBarChart(req: Request, res: Response){
  try {
    const revenueData = await AdminService.getDoctorsRevenueBarChart();
    res.status(200).json(revenueData);
  } catch (error) {
    console.error('Error fetching doctor revenue data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





async getReport(req: Request, res: Response){
  try {
    const { rangeType, startDate, endDate } = req.body;
  
    
    const reportData = await AdminService.generateReport(rangeType, startDate, endDate);
    
    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Error generating report' });
  }
};



}

export default new AdminController();



