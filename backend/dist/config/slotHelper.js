export function generateTimeSlots(startHour, endHour, slotDuration) {
    const slots = [];
    const startInMinutes = startHour * 60;
    const endInMinutes = endHour * 60;
    for (let time = startInMinutes; time < endInMinutes; time += slotDuration) {
        const slotStart = time;
        const slotEnd = time + slotDuration;
        const startHourFormatted = Math.floor(slotStart / 60);
        const startMinuteFormatted = slotStart % 60;
        const startPeriod = startHourFormatted >= 12 ? 'PM' : 'AM';
        const formattedStartHour = startHourFormatted % 12 || 12;
        const endHourFormatted = Math.floor(slotEnd / 60);
        const endMinuteFormatted = slotEnd % 60;
        const endPeriod = endHourFormatted >= 12 ? 'PM' : 'AM';
        const formattedEndHour = endHourFormatted % 12 || 12;
        const slotString = `${formattedStartHour}:${startMinuteFormatted.toString().padStart(2, '0')} ${startPeriod} - ${formattedEndHour}:${endMinuteFormatted.toString().padStart(2, '0')} ${endPeriod}`;
        slots.push(slotString);
    }
    return slots;
}
export function convertTo24Hour(time, period) {
    let [hour, minute] = time.split(':').map(Number);
    if (period === 'PM' && hour < 12)
        hour += 12;
    if (period === 'AM' && hour === 12)
        hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}
export function validateSlotDuration(existingSlots, slotDuration) {
    if (existingSlots.length > 0) {
        const existingDuration = (existingSlots[0].endTime.getTime() - existingSlots[0].startTime.getTime()) / 60000;
        if (existingDuration !== slotDuration) {
            throw new Error(`Existing slots with ${existingDuration}-minute duration found. Please delete these slots before creating new ones with a different duration.`);
        }
    }
}
