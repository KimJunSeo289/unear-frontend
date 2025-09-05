export const formatDateToKorean = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return ''; // 유효하지 않은 날짜 방지

  const formatted = date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '.')
    .replace(/\s/g, ' ')
    .trim();

  return formatted.endsWith('.') ? formatted.slice(0, -1) : formatted;
};
