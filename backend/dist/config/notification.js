import Notification from '../models/notification';
export const sendNotification = async (patientId, message, reason, refundAmount, doctorId) => {
    const notification = new Notification({
        patientId,
        doctorId,
        type: 'appointment',
        message: message,
        reason: reason,
        refundAmount: refundAmount,
        refundStatus: refundAmount > 0 ? 'success' : 'failed',
        status: 'unread',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await notification.save();
    ('Notification sent to the patient successfully.');
};
