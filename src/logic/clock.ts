export interface ClockTimeText {
  hours: string;
  minutes: string;
  seconds: string;
}

const pad = (value: number) => String(value).padStart(2, "0");

export const formatTime = (date: Date): ClockTimeText => ({
  hours: pad(date.getHours()),
  minutes: pad(date.getMinutes()),
  seconds: pad(date.getSeconds()),
});

export const formatDate = (date: Date): string => {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return (
    String(date.getFullYear()) +
    "年" +
    String(date.getMonth() + 1) +
    "月" +
    String(date.getDate()) +
    "日（" +
    weekdays[date.getDay()] +
    "）"
  );
};

export const toIsoDate = (date: Date): string => date.toISOString();
