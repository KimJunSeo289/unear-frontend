export function getStoreStatus(hours: string): '영업중' | '영업종료' {
  if (!hours.includes('-')) return '영업종료';

  const [start, end] = hours.split('-').map((time) => time.trim());

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);

  // 영업 시간이 자정을 넘어가는 경우 (ex. 22:00 - 02:00)
  if (endMinutes < startMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes ? '영업중' : '영업종료';
  }

  return currentMinutes >= startMinutes && currentMinutes < endMinutes ? '영업중' : '영업종료';
}
