import type { CategoryType, StoreClassType, EventType } from '@/components/common/StoreTypeIcon';

export interface StoryItem {
  imageUrl: string;
  comment: string;
  date: string;
  storeName: string;
  amount: number;
  logoUrl: string;

  // 아래 세 가지가 누락되어 있었음
  category: CategoryType;
  storeClass: StoreClassType;
  eventType: EventType;
}
