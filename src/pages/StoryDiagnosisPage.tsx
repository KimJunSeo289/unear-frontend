//StoryDiagnosisPage.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StoryLayout from '@/components/story/StoryLayout';
import StoryButton from '@/components/common/StoryButton';

interface DiagnosisData {
  category: string;
  emoji: string;
  label: string;
  description: string[];
}

const StoryDiagnosisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const diagnosisMap = location.state?.diagnosisMap as Record<string, DiagnosisData>;
  const diagnosisResult = location.state?.diagnosisResult as { type: string; comment: string };

  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);

  useEffect(() => {
    if (!diagnosisMap || !diagnosisResult) return;

    const normalize = (str: string) => str.replace(/\s/g, '');
    const matched = Object.values(diagnosisMap).find(
      (item) => normalize(item.label) === normalize(diagnosisResult.type)
    );

    if (matched) {
      setDiagnosis(matched);
    } else {
    }
  }, [diagnosisMap, diagnosisResult]);

  return (
    <StoryLayout headerTitle="진단" bgColorClass="bg-storybackground3">
      <div className="flex flex-col items-center justify-between w-full h-full px-5 py-10">
        {diagnosis ? (
          <>
            <div className="flex flex-col items-center text-center">
              <p className="text-9xl mb-4">{diagnosis.emoji}</p>
              <p className="text-white text-lm font-semibold mb-1">나의 결제 타입은</p>
              <p className="text-white text-xl font-semibold mb-4">[{diagnosis.label}]</p>
              {diagnosis.description.map((line, index) => (
                <p key={index} className="text-white text-m font-regular mb-1">
                  {line}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <StoryButton
                text="소비 스토리 보기"
                onClick={() => navigate('/story/detail', { state: { diagnosis } })}
              />
              <StoryButton
                text="추천 매장"
                onClick={() => navigate('/story/recommend', { state: { diagnosis } })}
              />
            </div>
          </>
        ) : (
          <p className="text-white text-m font-regular">진단 결과가 없습니다.</p>
        )}
      </div>
    </StoryLayout>
  );
};

export default StoryDiagnosisPage;
