// src/apis/roulette.ts

// [신규] 룰렛 결과를 서버에 전송하는 함수
// ProbabilityRoulette 컴포넌트에 있던 fetch 로직을 가져와 재사용 가능한 함수로 만듭니다.
export const sendRouletteResult = async (eventId: number, prizeName: string) => {
  const token = sessionStorage.getItem('temp_access_token');
  if (!token) {
    // 실제 프로덕션에서는 로그인 페이지로 리디렉션하거나
    // 전역 상태 관리를 통해 토큰을 갱신하는 로직이 필요할 수 있습니다.
    throw new Error('로그인 정보가 없습니다. 다시 로그인해주세요.');
  }

  // API 요청 본문을 정의합니다.
  const body = {
    // 요구사항에 맞춰 prizeName에서 개행문자를 공백으로 치환합니다.
    reward: prizeName.replace('\n', ' '),
    participated: 1, // 필요 시 이 값도 파라미터로 받을 수 있습니다.
  };

  const response = await fetch(`https://dev.unear.site/api/app/roulette/spin/${eventId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  // 응답이 JSON인지 먼저 확인
  const contentType = response.headers.get('Content-Type');
  let responseData;

  try {
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const _textResponse = await response.text();
      throw new Error('서버에서 올바르지 않은 응답을 받았습니다.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (parseError) {
    throw new Error('서버 응답을 처리할 수 없습니다.');
  }

  if (!response.ok) {
    // ✨ 특정 에러 케이스 처리
    if (response.status === 400) {
      const errorMessage = responseData?.message || responseData?.error || '잘못된 요청입니다.';

      // 이미 참여한 경우의 다양한 메시지 패턴 확인
      if (
        errorMessage.includes('이미') ||
        errorMessage.includes('already') ||
        errorMessage.includes('participated') ||
        errorMessage.includes('duplicate')
      ) {
        throw new Error('ALREADY_PARTICIPATED'); // 특별한 에러 코드 사용
      }
    }

    // 서버에서 보내주는 에러 메시지를 사용하거나, 없을 경우 기본 메시지를 사용합니다.
    const errorMessage =
      responseData?.message || responseData?.error || '룰렛 결과 저장에 실패했습니다.';
    throw new Error(errorMessage);
  }

  // 성공 시 서버로부터 받은 데이터를 반환합니다.
  return responseData;
};

/**
 * 특정 이벤트의 룰렛 참여 여부를 확인하는 API
 * @param eventId - 확인할 이벤트 ID
 * @returns Promise<boolean> - 참여 여부 (true: 이미 참여함, false: 참여 안함)
 */
export const checkRouletteParticipation = async (eventId: number): Promise<boolean> => {
  try {
    const token = sessionStorage.getItem('temp_access_token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    // 룰렛 참여 확인을 위한 API - 보통 GET 요청으로 현재 상태를 확인
    const response = await fetch(`https://dev.unear.site/api/app/roulette/spin/${eventId}`, {
      method: 'GET', // 상태 확인용 GET 요청
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // 응답이 JSON인지 먼저 확인
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();

      // HTML 응답을 받은 경우 (404, 500 등의 에러 페이지)
      if (textResponse.includes('<!doctype') || textResponse.includes('<html>')) {
        throw new Error('API 엔드포인트를 찾을 수 없습니다. URL을 확인해주세요.');
      }

      throw new Error('서버에서 올바르지 않은 응답을 받았습니다.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `서버 오류: ${response.status}`);
    }

    const data = await response.json();
    // ✨ 서버 응답에서 isAlreadyParticipated 필드를 우선 확인
    if (data.hasOwnProperty('isAlreadyParticipated')) {
      return !!data.isAlreadyParticipated;
    }

    // ✨ 서버 응답 구조에 맞춰 참여 여부를 확인 (다양한 필드명 지원)
    return !!(
      data.hasParticipated ||
      data.participated ||
      data.isParticipated ||
      data.result ||
      data.roulette_result_id ||
      data.data?.roulette_result_id ||
      data.data?.isAlreadyParticipated
    );
  } catch (error) {
    // 네트워크 에러나 API 엔드포인트 문제인 경우 false 반환 (임시 조치)
    if (
      error instanceof TypeError ||
      (error instanceof Error && error.message.includes('API 엔드포인트'))
    ) {
      return false; // 임시로 false 반환하여 룰렛을 진행할 수 있게 함
    }

    throw error;
  }
};

/**
 * 간단한 대안: 룰렛 참여 확인을 생략하고 바로 룰렛을 실행하는 함수
 * API가 명확하지 않을 때 사용
 */
export const skipRouletteParticipationCheck = (): boolean => {
  return false; // 항상 false를 반환하여 룰렛을 진행할 수 있게 함
};
