import { useNavigate } from 'react-router-dom';

export const useStatisticsHandlers = (
  currentMonth: number,
  setCurrentMonth: (month: number) => void,
  setShowAllCategories: (show: boolean) => void
) => {
  const navigate = useNavigate();

  // 월 변경 함수
  const handlePrevMonth = () => {
    if (currentMonth > 1) {
      setCurrentMonth(currentMonth - 1);
      setShowAllCategories(false);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < 7) {
      setCurrentMonth(currentMonth + 1);
      setShowAllCategories(false);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 더보기 토글
  const handleToggleCategories = (showAllCategories: boolean) => {
    setShowAllCategories(!showAllCategories);
  };

  return {
    handlePrevMonth,
    handleNextMonth,
    handleBack,
    handleToggleCategories,
  };
};
