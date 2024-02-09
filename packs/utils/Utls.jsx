export function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function getDayWord(count) {
    if (!count) count = 0

    let mod10 = count % 10;
    let mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return "день";
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        return "дня";
    } else {
        return "дней";
    }
}

export function getHourWord(count) {
    if (!count) count = 0

    let mod10 = count % 10;
    let mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return "час";
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        return "часа";
    } else {
        return "часов";
    }
}