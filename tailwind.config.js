/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // font-[지정명]
        thin: ['LGEIHeadline-Thin', 'sans-serif'],
        light: ['LGEIHeadline-Light', 'sans-serif'],
        regular: ['LGEIHeadline-Regular', 'sans-serif'],
        semibold: ['LGEIHeadline-Semibold', 'sans-serif'],
        bold: ['LGEIHeadline-Bold', 'sans-serif'],
      },
      colors: {
        // bg-[지정명]
        // text-[지정명]
        background: '#F6F7FB', //배경용 연한 회색
        primary: '#E6007E', // 핑크
        black: '#333333', // 검정
        white: '#FFFFFF', // 흰색
        story: '#0F0034', // 스토리 네이비
        storycard: '#251A49', // 스토리 카드 네이비
      },
      backgroundImage: {
        // bg-[지정명]
        storyicon: 'linear-gradient(180deg, #094275 0%, #0F0034 100%)', //하단바 스토리 아이콘
        storybackground1: 'linear-gradient(180deg, #0F0034 0%, #094275 100%)', //스토리 페이지 배경1
        storybackground2: 'radial-gradient(ellipse 90% 40% at center, #094275 20%, #0F0034 60%)', //스토리 페이지 배경2
        storybackground3: 'radial-gradient(ellipse at center, #0F0034 20%, #094275 60%)', //스토리 페이지 배경3
      },
      fontSize: {
        // text-[지정명]
        xs: '0.625rem', // 10px
        s: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        m: '1rem', // 기본값(16px)
        lm: '1.125rem', // 18px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        xxl: '2.25rem', //36px
      },
      keyframes: {
        blinkPulse: {
          '0%': { opacity: '0.1' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0.1' },
        },
        zoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'blink-pulse': 'blinkPulse 2.5s ease-in-out infinite',
        zoom: 'zoom 6s ease-in-out forwards',
        slideLeft: 'slideLeft 20s linear infinite',
      },
    },
  },
  plugins: [],
};
