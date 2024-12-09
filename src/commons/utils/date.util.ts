export function monthDiff(date1: Date, date2: Date): number {
  date1 = new Date(date1);
  date2 = new Date(date2);
  const [year1, month1, day1] = date1.toISOString().split('-').map(Number);
  const [year2, month2, day2] = date2.toISOString().split('-').map(Number);

  const totalMonthsYear1 = (year1 - 1) * 12 + month1;
  const totalMonthsYear2 = (year2 - 1) * 12 + month2;

  let monthDifference = totalMonthsYear2 - totalMonthsYear1;

  // Adjust for days in the current month
  if (day2 > day1) {
    monthDifference += 1;
  }

  return monthDifference;
}

export function decreaseByMonth(
  dateString: string,
  dec: number,
  sparator = '',
): string {
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(5, 7), 10);
  let newYear = year;
  let newMonth = month - dec;

  while (newMonth < 1) {
    newYear -= 1;
    newMonth += 12;
  }

  const formattedYear = newYear.toString();
  const formattedMonth = newMonth < 10 ? `0${newMonth}` : newMonth.toString();

  return `${formattedYear}${sparator}${formattedMonth}`;
}

export function increaseDateByYears(date: Date, years: number): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

export function previousPeriod(period: string) {
  const year = period.substring(0, 4);
  const month = period.substring(4, 6);
  const previousPeriod =
    +month - 1 < 1
      ? `${+year - 1}12`
      : `${year}${String(+month - 1).padStart(2, '0')}`;

  return previousPeriod;
}

export function dateToPeriod(date: Date | string): string {
  const newDate = new Date(date);
  const [year1, month1] = newDate.toISOString().split('-');
  return `${year1}${month1}`;
}

export function formatYearMonth(date: Date | string): string {
  const newDate = new Date(date);
  const [year1, month1] = newDate.toISOString().split('-');
  return `${year1}-${month1}`;
}
export function formatYearMonthDay(date: Date | string): string {
  const newDate = new Date(date);
  const [onlyDate] = newDate.toISOString().split('T');
  const [year1, month1, day1] = onlyDate.split('-');
  return `${year1}-${month1}-${day1}`;
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}

export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
}
export function formatDateToExactString(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return `${day} ${monthNames[month]} ${year}`;
}

export function formatYearMonthToString(yyyymm: string): string {
  const [year, month] = yyyymm.split('-').map(Number);

  const date = new Date(year, month - 1);

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agistus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  // Format the date to "MonthName Year"
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatPeriod(dateString: string): string {
  const [year, month] = dateString.split('-');
  return `${month}-${year}`;
}

export function jakartaDate(date: string | Date): string {
  if (!date) return '';
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour12: false,
  });
  const newDate = new Date(date);

  const parts = formatter.formatToParts(newDate);

  const day = parts.find((part) => part.type === 'day')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const year = parts.find((part) => part.type === 'year')?.value;
  if (day && month && year) {
    return `${day}-${month}-${year}`;
  }

  throw new Error('Failed to format date');
}

export function jakartaLongMonthDate(date: string | Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour12: false,
  });
  const newDate = new Date(date);

  const parts = formatter.formatToParts(newDate);

  const day = parts.find((part) => part.type === 'day')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const year = parts.find((part) => part.type === 'year')?.value;
  if (day && month && year) {
    return `${day} ${month} ${year}`;
  }

  throw new Error('Failed to format date');
}

export function jakartaTZdate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const day = parts.find((part) => part.type === 'day')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const year = parts.find((part) => part.type === 'year')?.value;
  const hour = parts.find((part) => part.type === 'hour')?.value;
  const minute = parts.find((part) => part.type === 'minute')?.value;
  const second = parts.find((part) => part.type === 'second')?.value;

  if (day && month && year && hour && minute && second) {
    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
  }

  throw new Error('Failed to format date');
}
