export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration / (60 * 60)); // 60 sec * 60 min = 1 hour
    const minutes = Math.floor(hours / 60);
    const seconds = Math.floor(duration / 60);

    return [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0'))
        .join(':');
}