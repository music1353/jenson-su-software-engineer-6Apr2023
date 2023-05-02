import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default class DateUtil {
  static getMonthOptions = (): { value: string; label: string }[] => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthNumber = i + 1;
      const monthName = new Date(Date.UTC(0, i)).toLocaleString('en-US', {
        month: 'long'
      });

      return {
        value: String(monthNumber),
        label: monthName,
      };
    });

    return months
  }

  static getYearOptions = (): { value: string; label: string }[] => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 61 }, (_, i) => {
      const year = currentYear - i;
      return {
        value: String(year),
        label: String(year),
      };
    });
    return years;
  }

  static getMonthName = (month: string): string => {
    const date = new Date(2000, parseInt(month) - 1);
    return date.toLocaleString("en-US", { month: "long" });
  }

  static getDuration = (startYear: string, startMonth: string, endYear: string, endMonth: string, isPresent: boolean): string => {
    const start = dayjs(`${startYear}-${startMonth}-01`);
    const end = isPresent ? dayjs() : dayjs(`${endYear}-${endMonth}-01`);
    const diff = dayjs.duration(end.diff(start));

    const years = Math.floor(diff.asYears());
    const months = diff.months();

    const yearText = years===1 ? "year" : "years";
    const monthText = months===1 ? "month" : "months";

    if (years && months) {
      return `${years} ${yearText} ${months} ${monthText}`
    } else if (years > 0) {
      return `${years} ${yearText}`
    } else if (months > 0) {
      return `${months} ${monthText}`
    } else {
      return ""
    }
  }
}