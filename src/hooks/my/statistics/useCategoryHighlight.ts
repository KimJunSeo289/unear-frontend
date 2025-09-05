import { useState } from 'react';

export interface CategoryHighlight {
  category: string | null;
  position?: { x: number; y: number };
  percentage?: number;
  categoryName?: string;
}

export const useCategoryHighlight = () => {
  const [highlightedCategory, setHighlightedCategory] = useState<CategoryHighlight>({
    category: null,
  });

  const highlightCategory = (
    category: string,
    position: { x: number; y: number },
    percentage: number,
    categoryName: string
  ) => {
    setHighlightedCategory({
      category,
      position,
      percentage,
      categoryName,
    });
  };

  const clearHighlight = () => {
    setHighlightedCategory({
      category: null,
    });
  };

  const isHighlighted = (category: string): boolean => {
    return highlightedCategory.category === category;
  };

  const shouldBeTransparent = (category: string): boolean => {
    return highlightedCategory.category !== null && highlightedCategory.category !== category;
  };

  return {
    highlightedCategory,
    highlightCategory,
    clearHighlight,
    isHighlighted,
    shouldBeTransparent,
  };
};
