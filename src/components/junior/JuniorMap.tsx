// src/components/JuniorPage/JuniorMap.tsx (수정된 코드)

import { forwardRef } from 'react';
import MapContainer, { type MapActions } from '@/components/junior/MapContainer';

// forwardRef를 사용하여 부모 컴포넌트로부터 ref를 전달받음
const JuniorMap = forwardRef<MapActions>((_props, ref) => {
  return (
    <div className="w-full p-5 bg-white">
      {/* 지도 위쪽 텍스트 */}
      <div className="mb-3">
        <p className="text-lm font-bold text-black">이번주니어 지역</p>
      </div>

      {/* 지도 - 모바일 터치 스크롤 개선 */}
      <div
        className="relative h-[280px] w-full overflow-hidden"
        style={{
          touchAction: 'pan-y', // 세로 스크롤만 허용
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            pointerEvents: 'none', // 지도 상호작용 비활성화
          }}
        >
          <MapContainer ref={ref} />
        </div>

        {/* 터치 스크롤을 위한 투명 오버레이 */}
        <div
          className="absolute inset-0 bg-transparent"
          style={{
            touchAction: 'pan-y',
            pointerEvents: 'auto',
            zIndex: 1,
          }}
          onTouchStart={(e) => {
            // 터치 시작 시 기본 지도 동작 방지
            e.preventDefault();
          }}
        />
      </div>
    </div>
  );
});

// displayName 설정 (React 개발자 도구에서 컴포넌트 이름을 쉽게 식별하기 위함)
JuniorMap.displayName = 'JuniorMap';

export default JuniorMap;
