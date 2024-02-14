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

/////////////////////////
// Format words
/////////////////////////

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

export function formatLessonWord(count) {
    if (!count) count = 0;

    const mod10 = count % 10;
    const mod100 = count % 100;

    let text = "уроков";

    if (mod10 === 1 && mod100 !== 11) {
        text = "урок";
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        text = "урока";
    }

    return `${count} ${text}`;
}

export function formatTrialWord(count) {
    if (!count) count = 0;

    const mod10 = count % 10;
    const mod100 = count % 100;

    let text = "испытаний";

    if (mod10 === 1 && mod100 !== 11) {
        text = "испытание";
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        text = "испытания";
    }

    return `${count} ${text}`;
}

export function formatExcitingWord(count) {
    if (!count) return "увлекательным";

    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return "увлекательному";
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        return "увлекательным";
    } else {
        return "увлекательным";
    }
}

export function formatAdventureWord(count) {
    if (!count) count = 0;

    const mod10 = count % 10;
    const mod100 = count % 100;

    let text = "приключениям";

    if (mod10 === 1 && mod100 !== 11) {
        text = "приключению";
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        text = "приключениям";
    }

    return text;
}

/////////////////////////

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

// Levenshtein distance
export const levenshtein = (s1, s2, costs) => {
    var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
    l1 = s1.length;
    l2 = s2.length;

    costs = costs || {};
    var cr = costs.replace || 1;
    var cri = costs.replaceCase || costs.replace || 1;
    var ci = costs.insert || 1;
    var cd = costs.remove || 1;

    cutHalf = flip = Math.max(l1, l2);

    var minCost = Math.min(cd, ci, cr);
    var minD = Math.max(minCost, (l1 - l2) * cd);
    var minI = Math.max(minCost, (l2 - l1) * ci);
    var buf = new Array((cutHalf * 2) - 1);

    for (i = 0; i <= l2; ++i) {
        buf[i] = i * minD;
    }

    for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
        ch = s1[i];
        chl = ch.toLowerCase();

        buf[flip] = (i + 1) * minI;

        ii = flip;
        ii2 = cutHalf - flip;

        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
            cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
        }
    }
    return buf[l2 + cutHalf - flip];
}