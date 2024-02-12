export function debounce(func, wait) {
    let timeout

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export function formatDayWord(days) {
    if (!days) days = 0

    let mod10 = days % 10
    let mod100 = days % 100

    let text = "дней";

    if (mod10 === 1 && mod100 !== 11) {
        text = "день"
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        text = "дня"
    }

    return `${days} ${text}`
}

export function formatHoursWord(hours) {
    if (!hours) hours = 0

    const roundedHours = Math.round(hours * 10) / 10
    const integerPart = Math.floor(hours)
    const decimalPart = roundedHours % 1

    if (integerPart === 1 && decimalPart === 0) {
        return `${integerPart} час`
    } else if (decimalPart > 0) {
        if (integerPart === 0) {
            return `${roundedHours} часа`
        } else if (integerPart === 1) {
            return `${roundedHours} часа`
        } else {
            return `${roundedHours} часов`
        }
    } else {
        if (integerPart >= 2 && integerPart <= 4) {
            return `${integerPart} часа`
        } else {
            return `${integerPart} часов`
        }
    }
}

export function formatMinutesWord(minutes) {
    if (!minutes) minutes = 0

    let text = "минут";

    if (minutes % 10 === 1 && minutes % 100 !== 11) {
        text = "минута";
    } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) {
        text = "минуты";
    }
    
    return `${minutes} ${text}`;
}

export function getHoursOrMinutes(hours, withWord = false) {
    if (!hours) hours = 0

    if (hours < 1) {
        const minutes = Math.round(hours * 60)

        return withWord ? formatMinutesWord(minutes) : minutes
    } else {
        hours = hours.toFixed(1)

        return withWord ? formatHoursWord(hours) : hours
    }
}

export function calculatePercentage(value, total, withFloat = false) {
    if (value === 0) return 0

    const percentage = (value / total) * 100

    if (percentage < 10 && withFloat) {
        return percentage.toFixed(1)
    } else {
        return Math.floor(percentage)
    }
}