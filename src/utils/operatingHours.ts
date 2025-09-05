/**
 * 매장 영업시간 유틸리티 함수들
 */

export interface OperatingStatus {
  isOpen: boolean;
  statusText: '영업중' | '영업종료';
  statusColor: 'text-green-500' | 'text-red-500';
}

/**
 * 시간 문자열을 분으로 변환
 * @param timeStr - "09:00" 형식의 시간 문자열
 * @returns 0시 0분부터의 총 분 수
 */
const parseTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * 현재 시간을 분으로 변환
 * @returns 0시 0분부터의 총 분 수
 */
const getCurrentTimeInMinutes = (): number => {
  const now = new Date();
  const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return parseTimeToMinutes(currentTimeStr);
};

/**
 * 영업시간 문자열을 파싱하여 시작/종료 시간을 반환
 * @param hours - "09:00 - 21:00", "24시간", "휴무" 등의 형식
 * @returns {start: number, end: number} 또는 null
 */
const parseOperatingHours = (hours: string): { start: number; end: number } | null => {
  // 24시간 운영
  if (hours.includes('24시간') || hours.includes('24H')) {
    return { start: 0, end: 24 * 60 }; // 전체 시간
  }

  // 휴무
  if (hours.includes('휴무') || hours.includes('CLOSED')) {
    return null;
  }

  // "09:00 - 21:00" 형식 파싱
  const timePattern = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;
  const match = hours.match(timePattern);

  if (match) {
    const [, startHour, startMin, endHour, endMin] = match;
    const startMinutes = parseTimeToMinutes(`${startHour}:${startMin}`);
    let endMinutes = parseTimeToMinutes(`${endHour}:${endMin}`);

    // 자정을 넘어가는 경우 (예: 22:00 - 02:00)
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60; // 다음날로 처리
    }

    return { start: startMinutes, end: endMinutes };
  }

  // 파싱할 수 없는 형식인 경우 24시간으로 처리
  return { start: 0, end: 24 * 60 };
};

/**
 * 매장의 영업 상태를 확인
 * @param hours - 영업시간 문자열 (예: "09:00 - 21:00")
 * @returns OperatingStatus 객체
 */
export const getOperatingStatus = (hours: string): OperatingStatus => {
  const parsedHours = parseOperatingHours(hours);

  // 휴무인 경우
  if (!parsedHours) {
    return {
      isOpen: false,
      statusText: '영업종료',
      statusColor: 'text-red-500',
    };
  }

  const currentMinutes = getCurrentTimeInMinutes();
  const { start, end } = parsedHours;

  let isOpen = false;

  // 자정을 넘어가지 않는 경우
  if (end <= 24 * 60) {
    isOpen = currentMinutes >= start && currentMinutes < end;
  } else {
    // 자정을 넘어가는 경우 (예: 22:00 - 02:00)
    isOpen = currentMinutes >= start || currentMinutes < end - 24 * 60;
  }

  return {
    isOpen,
    statusText: isOpen ? '영업중' : '영업종료',
    statusColor: isOpen ? 'text-green-500' : 'text-red-500',
  };
};

/**
 * 매장 상태 텍스트만 반환 (기존 컴포넌트 호환용)
 * @param hours - 영업시간 문자열
 * @returns '영업중' | '영업종료'
 */
export const getStatusText = (hours: string): '영업중' | '영업종료' => {
  return getOperatingStatus(hours).statusText;
};

/**
 * 매장 상태 색상만 반환 (기존 컴포넌트 호환용)
 * @param hours - 영업시간 문자열
 * @returns 'text-green-500' | 'text-red-500'
 */
export const getStatusColor = (hours: string): 'text-green-500' | 'text-red-500' => {
  return getOperatingStatus(hours).statusColor;
};

/**
 * 영업시간 예시들과 예상 결과
 *
 * 사용 예시:
 * - "09:00 - 21:00" → 9시-21시 사이면 영업중
 * - "24시간" → 항상 영업중
 * - "22:00 - 02:00" → 22시-다음날 2시 사이면 영업중
 * - "휴무" → 항상 영업종료
 * - "06:00 - 22:00" → 6시-22시 사이면 영업중
 */
