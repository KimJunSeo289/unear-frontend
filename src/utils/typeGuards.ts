// SignUpPage.tsx의 타입 오류 수정을 위한 간단한 타입 가드 함수들

// API 에러 응답 타입 확장
interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: any; // 유연한 타입으로 변경
  };
}

// 타입 가드 함수들
const isErrorWithMessage = (error: any): error is { message: string } => {
  return error && typeof error === 'object' && 'message' in error;
};

const isErrorWithCodeName = (error: any): error is { codeName: string } => {
  return error && typeof error === 'object' && 'codeName' in error;
};

const isErrorWithData = (error: any): error is { data: { fieldErrors?: Record<string, string> } } => {
  return error && typeof error === 'object' && 'data' in error;
};

// 사용 예시:
// if (isErrorWithMessage(responseData)) {
//   showErrorToast(responseData.message);
// }

export { isErrorWithMessage, isErrorWithCodeName, isErrorWithData };
export type { ApiErrorResponse };
