export function convertDurationToTimeString(duration: number) {
    const oneHour = 60 * 60; // 60 sec * 60 min = 1 hour
    const hours = Math.floor(duration / oneHour);
    const minutes = Math.floor(duration % oneHour / 60);
    const seconds = Math.floor(duration % 50);


    return [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0'))
        .join(':');
}