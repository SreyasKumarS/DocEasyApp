import Admin from '../models/admin.js';
import Doctor from '../models/doctor.js';
import Patient from '../models/patient.js';
import Booking from '../models/booking.js';
class AdminRepository {
    async findByEmail(email) {
        return Admin.findOne({ email });
    }
    async saveAdmin(adminData) {
        const admin = new Admin(adminData);
        return admin.save();
    }
    async updateAdmin(admin) {
        return admin.save();
    }
    async findUnapprovedDoctors() {
        return Doctor.find({ isApproved: false });
    }
    async findDoctorById(doctorId) {
        return Doctor.findById(doctorId);
    }
    async findPatientById(patientId) {
        return Patient.findById(patientId);
    }
    async updateDoctor(doctor) {
        return doctor.save();
    }
    async deleteDoctor(doctorId) {
        try {
            await Doctor.findByIdAndDelete(doctorId);
        }
        catch (error) {
            throw new Error('Internal server error');
        }
    }
    async findPatients() {
        return Patient.find({ isVerified: true });
    }
    async deletePatient(patientId) {
        try {
            await Patient.findByIdAndDelete(patientId);
        }
        catch (error) {
            throw new Error('Internal server error');
        }
    }
    async findAllDoctors() {
        try {
            const doctors = await Doctor.find();
            return doctors;
        }
        catch (error) {
            console.error('Error fetching all doctors from database:', error);
            throw new Error('Internal server error while fetching doctors');
        }
    }
    async updatePlatformFee({ percentageFee, fixedFee }) {
        try {
            // Fetch the admin record
            const admin = await Admin.findOne();
            if (!admin) {
                console.error('Admin record not found.');
                throw new Error('Admin record not found.');
            }
            // Update the appropriate field
            if (percentageFee !== null) {
                admin.percentageFee = percentageFee;
                admin.fixedFee = null; // Reset the fixedFee if percentageFee is updated
            }
            else if (fixedFee !== null) {
                admin.fixedFee = fixedFee;
                admin.percentageFee = null; // Reset the percentageFee if fixedFee is updated
            }
            // Save and return the updated admin document
            const updatedAdmin = await admin.save();
            return updatedAdmin;
        }
        catch (error) {
            console.error('Error in repository layer:', error);
            throw error;
        }
    }
    async getTopRevenueDoctor(page, limit) {
        const skip = (page - 1) * limit;
        // MongoDB Aggregation
        const result = await Booking.aggregate([
            // Filter only completed bookings
            {
                $match: {
                    bookingStatus: 'completed',
                },
            },
            {
                $group: {
                    _id: '$doctorId',
                    totalRevenue: { $sum: '$amount' },
                    adminProfit: { $sum: '$platformFee' },
                },
            },
            {
                $lookup: {
                    from: 'doctors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doctorDetails',
                },
            },
            { $unwind: '$doctorDetails' },
            {
                $project: {
                    _id: 0,
                    doctorId: '$_id',
                    totalRevenue: 1,
                    adminProfit: 1,
                    doctorName: '$doctorDetails.name',
                    specialization: '$doctorDetails.specialization',
                    contactNumber: '$doctorDetails.contactNumber',
                    email: '$doctorDetails.email',
                },
            },
            { $sort: { totalRevenue: -1 } }, // Sort by revenue descending
            { $skip: skip },
            { $limit: limit },
        ]);
        return result;
    }
    async getDoctorsWithRatings() {
        try {
            // Aggregate to fetch doctors with reviews
            const doctorsWithRatings = await Doctor.aggregate([
                {
                    $lookup: {
                        from: 'reviews', // Assuming the reviews collection is named 'reviews'
                        localField: '_id',
                        foreignField: 'doctorId',
                        as: 'reviews',
                    },
                },
                {
                    $project: {
                        doctorId: 1,
                        name: 1,
                        specialization: 1,
                        contactNumber: 1,
                        email: 1,
                        reviews: 1,
                    },
                },
            ]);
            return doctorsWithRatings;
        }
        catch (error) {
            console.error("Error in getDoctorsWithRatings:", error);
            throw new Error('Error fetching doctors with ratings');
        }
    }
    async getTopPatients(page, limit) {
        const skip = (page - 1) * limit;
        const result = await Booking.aggregate([
            { $match: { bookingStatus: 'completed' } }, // Filter for completed bookings
            {
                $group: {
                    _id: '$patientId',
                    totalSlots: { $sum: 1 }, // Count completed bookings
                },
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'patientDetails',
                },
            },
            { $unwind: '$patientDetails' },
            {
                $project: {
                    _id: 0,
                    patientId: '$_id',
                    totalSlots: 1,
                    patientName: '$patientDetails.name',
                    contactNumber: '$patientDetails.contactNumber',
                    email: '$patientDetails.email',
                    gender: '$patientDetails.gender',
                },
            },
            { $sort: { totalSlots: -1 } }, // Sort by total slots descending
            { $skip: skip },
            { $limit: limit },
        ]);
        return result;
    }
    async getTopBookedDoctors(page, limit) {
        const skip = (page - 1) * limit;
        const result = await Booking.aggregate([
            { $match: { bookingStatus: 'completed' } }, // Filter for completed bookings
            {
                $group: {
                    _id: '$doctorId', // Group by doctorId
                    totalBookings: { $sum: 1 }, // Count completed bookings
                },
            },
            {
                $lookup: {
                    from: 'doctors', // Lookup doctor details from the doctors collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doctorDetails',
                },
            },
            { $unwind: '$doctorDetails' }, // Unwind to access doctor details
            {
                $project: {
                    _id: 0,
                    doctorId: '$_id',
                    totalBookings: 1,
                    doctorName: '$doctorDetails.name',
                    specialization: '$doctorDetails.specialization',
                    contactNumber: '$doctorDetails.contactNumber',
                    email: '$doctorDetails.email',
                },
            },
            { $sort: { totalBookings: -1 } }, // Sort by total bookings in descending order
            { $skip: skip }, // Skip based on pagination
            { $limit: limit }, // Limit the result based on the limit
        ]);
        // Get total count for pagination
        const totalCount = await Booking.aggregate([
            { $match: { bookingStatus: 'completed' } },
            { $group: { _id: '$doctorId' } },
            { $count: 'totalDoctors' },
        ]);
        return { data: result, totalCount: totalCount[0]?.totalDoctors || 0 };
    }
    // Repository
    async getRevenueBySpecialization() {
        // Aggregate data from Booking collection and join with Doctor collection
        return await Booking.aggregate([
            { $match: { bookingStatus: 'completed' } }, // Filter completed bookings
            {
                $group: {
                    _id: '$doctorId', // Group by doctorId
                    totalRevenue: { $sum: '$platformFee' }, // Sum platform fees
                },
            },
            {
                $lookup: {
                    from: 'doctors', // Reference Doctor collection
                    localField: '_id', // Match doctorId
                    foreignField: '_id',
                    as: 'doctorDetails', // Resulting field
                },
            },
            { $unwind: '$doctorDetails' }, // Deconstruct array to single object
            {
                $project: {
                    specialization: '$doctorDetails.specialization',
                    totalRevenue: 1,
                    _id: 0,
                },
            },
            { $sort: { totalRevenue: -1 } }, // Sort by total revenue in descending order
        ]);
    }
    async getDoctorsRevenueBarChart() {
        return await Booking.aggregate([
            { $match: { bookingStatus: 'completed' } }, // Filter completed bookings
            {
                $group: {
                    _id: '$doctorId', // Group by doctorId
                    totalRevenue: { $sum: '$platformFee' }, // Sum platform fees
                },
            },
            {
                $lookup: {
                    from: 'doctors', // Join Doctor collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doctorDetails',
                },
            },
            { $unwind: '$doctorDetails' }, // Flatten array
            {
                $project: {
                    doctorName: '$doctorDetails.name',
                    totalRevenue: 1,
                    _id: 0,
                },
            },
            { $sort: { totalRevenue: -1 } }, // Sort by revenue descending
        ]);
    }
    async getReport({ rangeType, startDate, endDate, }) {
        try {
            const match = { bookingStatus: 'completed' };
            if (startDate && endDate) {
                match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
            }
            // Total slots count
            const totalSlots = await Booking.countDocuments(match);
            // Total revenue calculation
            const totalRevenue = await Booking.aggregate([
                { $match: match },
                { $group: { _id: null, totalRevenue: { $sum: '$platformFee' } } },
            ]);
            // Revenue for all doctors
            const doctorRevenue = await Booking.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: '$doctorId',
                        totalRevenue: { $sum: '$platformFee' },
                    },
                },
                { $sort: { totalRevenue: -1 } },
                {
                    $lookup: {
                        from: 'doctors',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'doctorDetails',
                    },
                },
                {
                    $unwind: '$doctorDetails', // Unwind to get the individual doctor details
                },
                {
                    $project: {
                        _id: 0,
                        doctorId: '$_id',
                        totalRevenue: 1,
                        doctorName: '$doctorDetails.name',
                        specialization: '$doctorDetails.specialization',
                        contact: '$doctorDetails.contactNumber',
                        email: '$doctorDetails.email',
                    },
                },
            ]);
            return {
                startDate: startDate || 'N/A',
                endDate: endDate || 'N/A',
                totalSlots,
                totalRevenue: totalRevenue[0]?.totalRevenue || 0,
                doctorRevenue, // Return the list of doctors with their total revenue
            };
        }
        catch (error) {
            console.error('Error in RevenueService.getReport:', error);
            throw new Error('Unable to fetch revenue details');
        }
    }
}
export default new AdminRepository();
