/**
 * JWT 토큰 관련 유틸리티 함수들
 */

// JWT 페이로드 타입 정의
interface JwtPayload {
  exp?: number; // 만료 시간 (Unix timestamp)
  iat?: number; // 발급 시간 (Unix timestamp)
  iss?: string; // 발급자
  sub?: string; // 주제 (보통 사용자 ID)
  aud?: string | string[]; // 대상
  jti?: string; // JWT ID
  nbf?: number; // 유효 시작 시간
  [key: string]: unknown; // 기타 커스텀 클레임들
}

/**
 * JWT 토큰을 디코딩하여 페이로드를 반환합니다.
 * @param token JWT 토큰
 * @returns 디코딩된 페이로드 또는 null
 */
export const decodeJwtToken = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      throw new Error('Invalid token format');
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload) as JwtPayload;
    return payload;
  } catch (error: unknown) {
    return null;
  }
};

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 * @param token JWT 토큰
 * @returns 만료 여부 (true: 만료됨, false: 유효함)
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return true;
  }

  const payload = decodeJwtToken(token);
  if (!payload || typeof payload.exp !== 'number') {
    return true; // 페이로드가 없거나 만료 시간이 없으면 만료된 것으로 간주
  }

  const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초)
  const expirationTime = payload.exp; // 만료 시간 (초)

  return currentTime >= expirationTime;
};

/**
 * JWT 토큰의 남은 유효 시간을 반환합니다.
 * @param token JWT 토큰
 * @returns 남은 시간 (초), 만료되었거나 유효하지 않으면 0
 */
export const getTokenRemainingTime = (token: string): number => {
  if (!token || typeof token !== 'string') {
    return 0;
  }

  const payload = decodeJwtToken(token);
  if (!payload || typeof payload.exp !== 'number') {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;
  const remainingTime = expirationTime - currentTime;

  return remainingTime > 0 ? remainingTime : 0;
};

/**
 * 토큰이 곧 만료될지 확인합니다. (기본: 5분 이내)
 * @param token JWT 토큰
 * @param thresholdSeconds 임계값 (초, 기본값: 300초 = 5분)
 * @returns 곧 만료될지 여부
 */
export const isTokenExpiringSoon = (token: string, thresholdSeconds: number = 300): boolean => {
  const remainingTime = getTokenRemainingTime(token);
  return remainingTime > 0 && remainingTime <= thresholdSeconds;
};

/**
 * JWT 토큰에서 특정 클레임 값을 안전하게 추출합니다.
 * @param token JWT 토큰
 * @param claimName 클레임 이름
 * @returns 클레임 값 또는 null
 */
export const getTokenClaim = (token: string, claimName: string): unknown => {
  const payload = decodeJwtToken(token);
  if (!payload) {
    return null;
  }

  return payload[claimName] ?? null;
};

/**
 * JWT 토큰에서 사용자 ID를 추출합니다.
 * @param token JWT 토큰
 * @returns 사용자 ID 또는 null
 */
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeJwtToken(token);
  if (!payload) {
    return null;
  }

  // 일반적인 사용자 ID 클레임들 확인
  const userId = payload.sub || payload.userId || payload.id;
  return typeof userId === 'string' ? userId : null;
};

/**
 * JWT 토큰의 발급 시간을 반환합니다.
 * @param token JWT 토큰
 * @returns 발급 시간 (Date 객체) 또는 null
 */
export const getTokenIssuedAt = (token: string): Date | null => {
  const payload = decodeJwtToken(token);
  if (!payload || typeof payload.iat !== 'number') {
    return null;
  }

  return new Date(payload.iat * 1000);
};

/**
 * JWT 토큰의 만료 시간을 반환합니다.
 * @param token JWT 토큰
 * @returns 만료 시간 (Date 객체) 또는 null
 */
export const getTokenExpirationDate = (token: string): Date | null => {
  const payload = decodeJwtToken(token);
  if (!payload || typeof payload.exp !== 'number') {
    return null;
  }

  return new Date(payload.exp * 1000);
};
