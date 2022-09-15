export function formatHoursToMinutes(hour: string) {
    const [hours, minutes] = hour.split(':').map(Number);

    const minutesAmount = (hours * 60 + minutes);
    return minutesAmount;
}

export function formatMinutesToHours(minutesAmount: number) {
    const hours = Math.floor(minutesAmount / 60);
    const minutes = minutesAmount % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}