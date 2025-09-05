export type CategoryType =
  | 'FOOD'
  | 'ACTIVITY'
  | 'EDUCATION'
  | 'CULTURE'
  | 'BAKERY'
  | 'LIFE'
  | 'SHOPPING'
  | 'CAFE'
  | 'BEAUTY'
  | 'POPUP';

export type StoreClassType = 'LOCAL' | 'FRANCHISE' | 'BASIC';

export type EventType = 'NONE' | 'GENERAL' | 'REQUIRE';

export interface Place {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  categoryCode: CategoryType;
  markerCode: StoreClassType;
  eventCode: EventType;
  benefitCategory: string;
  favorite: boolean;
}
