// utils/timeHelpers.ts
// Function to generate time slots
export function generateTimeSlots(startHour, endHour, duration) {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour += duration / 60) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + duration / 60).toString().padStart(2, '0')}:00`;
        slots.push(`${startTime} - ${endTime}`);
    }
    return slots;
}
// Function to convert 12-hour time format (like "02:30 PM") to 24-hour format
export function convertTo24Hour(time) {
    // Extract the time part and AM/PM modifier
    const [timePart, modifier] = time.trim().split(' ');
    // Split time into hours and minutes
    let [hours, minutes] = timePart.split(':').map(Number);
    // Adjust hours based on AM/PM
    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    }
    else if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }
    // Format hours and minutes as two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}
