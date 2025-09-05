// src/components/junior/ProbabilityRoulette.tsx (수정된 최종 코드)

import { useState } from 'react';

// 상품의 타입을 정의합니다.
export interface Prize {
  id: number;
  prizeName: string;
  probability: number;
}

// 부모 컴포넌트로부터 받을 props의 타입을 정의합니다.
interface Props {
  onFinish: (prize: Prize) => void; // 룰렛이 멈추면 호출될 콜백 함수
}

// Tailwind 클래스명 → 실제 색상값 매핑
const tailwindColors: { [key: string]: string } = {
  'bg-white': '#FFFFFF',
  'bg-pink-100': '#FFFFFF',
};

// prizeData에 Prize[] 타입을 명시합니다.
const prizeData: Prize[] = [
  { id: 1, prizeName: '스타벅스\n아메리카노', probability: 90 },
  { id: 2, prizeName: '베스킨라빈스\n파인트', probability: 0.75 },
  { id: 3, prizeName: 'LG\ngram', probability: 0.15 },
  { id: 4, prizeName: '아이패드', probability: 0.04 },
  { id: 5, prizeName: 'CGV\n영화관람권', probability: 5 },
];

const sectionAngle = 360 / prizeData.length;

const ProbabilityRoulette: React.FC<Props> = ({ onFinish }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const getRandomResult = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < prizeData.length; i++) {
      cumulative += prizeData[i].probability;
      if (random <= cumulative) return i;
    }
    return 0; // 혹시 모를 예외 상황 대비
  };

  const handleClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const selectedIndex = getRandomResult();
    const minFullSpins = 4; // 최소 회전 바퀴 수
    // 최종 각도 계산: (최소 회전 수 * 360) + (목표 아이템 위치 각도) + (약간의 랜덤성)
    const targetRotation =
      360 * minFullSpins + (360 - selectedIndex * sectionAngle - sectionAngle / 2);

    setRotation(targetRotation);

    // CSS transition 시간과 동일하게 설정
    setTimeout(() => {
      const finalResult = prizeData[selectedIndex];
      // 애니메이션 종료 후, 부모에게 결과값을 전달
      onFinish(finalResult);

      // 스핀이 끝나면 UI 상태를 초기화할 수 있지만,
      // 모달이 닫히므로 굳이 isSpinning을 false로 바꿀 필요는 없습니다.
    }, 4000); // transition duration 4s
  };

  const generateConicGradient = () => {
    let gradient = '';
    let angleStart = 0;
    prizeData.forEach((_, index) => {
      const angleEnd = angleStart + sectionAngle;
      const colorClass = index % 2 === 0 ? 'bg-white' : 'bg-pink-100';
      const colorValue = tailwindColors[colorClass];
      gradient += `${colorValue} ${angleStart}deg ${angleEnd}deg${
        index < prizeData.length - 1 ? ', ' : ''
      }`;
      angleStart = angleEnd;
    });
    return `conic-gradient(${gradient})`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-black">
      <div className="relative w-80 h-80 max-w-sm rounded-full bg-gray-100 shadow-2xl mb-8">
        {/* 핀 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 rotate-180 z-20">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-pink-500" />
        </div>

        {/* 룰렛 판 */}
        <div
          className="absolute top-3 left-3 right-3 bottom-3 rounded-full border-4 border-pink-200 overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: 'transform 4s ease-out',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: generateConicGradient() }}
          />

          {/* 각 칸 텍스트 */}
          {prizeData.map((item, i) => (
            <div
              key={item.id}
              className="absolute inset-0 flex justify-center items-start text-center text-black text-xs"
              style={{ transform: `rotate(${i * sectionAngle + sectionAngle / 2}deg)` }}
            >
              <div className="flex flex-col items-center mt-4">
                {item.prizeName.split('\n').map((line, index) => (
                  <p key={index} className="text-black font-medium text-[11px] leading-tight px-1">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* 구분선 */}
          {prizeData.map((_, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-1/2 left-1/2 w-0.5 -ml-0.25 bg-pink-200"
              style={{
                transform: `rotate(${index * sectionAngle}deg)`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-pink-400 flex items-center justify-center shadow-lg">
          <button
            className="w-20 h-20 rounded-full bg-pink-500 text-white text-lg font-bold flex items-center justify-center hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClick}
            disabled={isSpinning}
          >
            {isSpinning ? '' : '도전'}
          </button>
        </div>
      </div>
      {isSpinning && (
        <div className="mt-4 flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full"></div>
          <span className="text-sm text-black">두근두근...</span>
        </div>
      )}
    </div>
  );
};

export default ProbabilityRoulette;
