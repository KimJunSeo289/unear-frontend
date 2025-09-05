import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import SearchBar from '@/components/common/SearchBar';
import CategoryFilter from '@/components/membership/CategoryFilter';
import MembershipCard from '@/components/common/MembershipCard';
import type { FranchiseBenefitItem, GradeType } from '@/types/franchise';
import { getFranchiseBenefits } from '@/apis/getFranchiseBenefits';

export default function MembershipPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [franchiseList, setFranchiseList] = useState<FranchiseBenefitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFranchiseBenefits = async () => {
      try {
        const res = await getFranchiseBenefits({ page: 0, size: 100 }); // 전체 조회
        setFranchiseList(res.content);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchFranchiseBenefits();
  }, []);
  const filterByCategory = (category: string) => {
    if (category === '전체') return franchiseList;
    // categoryCode -> 한글 매핑
    const categoryMap: Record<string, string> = {
      FOOD: '푸드',
      CAFE: '카페',
      BAKERY: '베이커리',
      CULTURE: '문화/여가',
      LIFE: '생활/편의',
      SHOPPING: '쇼핑',
      ACTIVITY: '액티비티',
      BEAUTY: '뷰티/건강',
      EDUCATION: '교육',
    };
    return franchiseList.filter((item) => categoryMap[item.categoryCode] === category);
  };
  // 검색 기능 개선 - 실시간 검색 및 빈 값 처리
  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      // 검색어가 없으면 전체 리스트 다시 불러오기
      try {
        const res = await getFranchiseBenefits({ page: 0, size: 100 });
        setFranchiseList(res.content);
      } catch (error) {}
      return;
    }

    try {
      const res = await getFranchiseBenefits({
        page: 0,
        size: 100,
        franchiseName: keyword,
      });
      setFranchiseList(res.content);
    } catch (error) {}
  };

  // 검색어 변경 시 실시간 처리
  const handleSearchChange = (keyword: string) => {
    setSearchKeyword(keyword);

    // 검색어가 비어있으면 즉시 전체 목록으로 복원
    if (!keyword.trim()) {
      handleSearch('');
    }
  };
  const filteredList = filterByCategory(selectedCategory);
  return (
    <div className="w-full max-w-[600px] bg-background mx-auto">
      <Header title="혜택 안내" />
      {/* SearchBar */}
      <div className="mt-4 px-5">
        <SearchBar
          value={searchKeyword}
          onSearch={handleSearch}
          onChange={handleSearchChange}
          placeholder="브랜드명을 입력하세요"
        />
      </div>
      {/* 필터 + 결과 + 카드 리스트 묶음 */}
      <div className="bg-white mt-4">
        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
        {/* 결과 개수 */}
        <div className="px-5">
          <div className="text-sm text-black font-semibold my-2.5">
            총 <span className="text-primary font-semibold">{filteredList.length}개</span>
          </div>
          {/* 카드 리스트 */}
          <div className="flex flex-col gap-3 items-center pb-5">
            {loading ? (
              <div className="text-black text-sm">로딩 중...</div>
            ) : filteredList.length > 0 ? (
              filteredList.map((card) => {
                // 타입 에러 방지용 as const 적용
                const gradeList: GradeType[] = [
                  ...(card.hasVvip ? (['VVIP'] as const) : []),
                  ...(card.hasVip ? (['VIP'] as const) : []),
                  ...(card.hasBasic ? (['우수'] as const) : []),
                ];
                return (
                  <MembershipCard
                    key={card.franchiseId}
                    name={card.franchiseName}
                    description={card.description}
                    grade={gradeList}
                    imageUrl={`https://unear-uploads.s3.ap-southeast-2.amazonaws.com/${card.franchiseImageUrl}`}
                    onClick={() =>
                      navigate(`/membership/detail/${card.franchiseId}`, {
                        state: {
                          franchiseId: card.franchiseId,
                          franchiseName: card.franchiseName,
                          franchiseImageUrl: card.franchiseImageUrl,
                          description: card.franchiseName,
                          categoryCode: card.categoryCode,
                          hasVvip: card.hasVvip,
                          hasVip: card.hasVip,
                          hasBasic: card.hasBasic,
                        },
                      })
                    }
                  />
                );
              })
            ) : (
              // 검색 결과가 없을 때 안내 메시지
              filteredList.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {searchKeyword.trim() !== '' ? (
                    <div>
                      <p className="text-m font-semibold mb-2">
                        "{searchKeyword}" 검색 결과가 없습니다.
                      </p>
                      <p className="text-sm text-gray-400">다른 검색어로 시도해보세요.</p>
                    </div>
                  ) : (
                    <p className="text-m">등록된 혜택이 없습니다.</p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
