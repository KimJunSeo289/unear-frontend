type CouponButtonProps = {
  label?: string;
  onClick?: () => void;
};

const CouponButton: React.FC<CouponButtonProps> = ({ label = '쿠폰 5개', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full h-[80px] rounded-xl border border-zinc-400 bg-white hover:bg-zinc-100 transition-colors duration-200" // Added transition for hover effect
    >
      {/* Absolute positioning for perfect centering */}
      <div className="absolute left-1/2 top-[42px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
        <svg
          width={28}
          height={23}
          viewBox="0 0 28 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet" // Changed to 'xMidYMid meet' for better centering if SVG isn't exact
          className=""
        >
          <path
            d="M17.4129 5.75L19.0454 7.475L9.79477 17.25L8.16231 15.525L17.4129 5.75ZM2.72077 0H24.4869C25.997 0 27.2077 1.27937 27.2077 2.875V8.625C26.4861 8.625 25.7941 8.9279 25.2838 9.46707C24.7736 10.0062 24.4869 10.7375 24.4869 11.5C24.4869 12.2625 24.7736 12.9938 25.2838 13.5329C25.7941 14.0721 26.4861 14.375 27.2077 14.375V20.125C27.2077 21.7206 25.997 23 24.4869 23H2.72077C1.99918 23 1.30714 22.6971 0.796895 22.1579C0.286652 21.6188 0 20.8875 0 20.125V14.375C1.51003 14.375 2.72077 13.0956 2.72077 11.5C2.72077 10.7375 2.43412 10.0062 1.92387 9.46707C1.41363 8.9279 0.721593 8.625 0 8.625V2.875C0 2.1125 0.286652 1.38123 0.796895 0.842068C1.30714 0.302901 1.99918 0 2.72077 0ZM2.72077 2.875V6.52625C3.54745 7.02995 4.234 7.75483 4.71136 8.62795C5.18872 9.50107 5.44004 10.4916 5.44004 11.5C5.44004 12.5084 5.18872 13.4989 4.71136 14.3721C4.234 15.2452 3.54745 15.9701 2.72077 16.4737V20.125H24.4869V16.4737C23.6602 15.9701 22.9737 15.2452 22.4963 14.3721C22.019 13.4989 21.7677 12.5084 21.7677 11.5C21.7677 10.4916 22.019 9.50107 22.4963 8.62795C22.9737 7.75483 23.6602 7.02995 24.4869 6.52625V2.875H2.72077ZM10.2029 5.75C11.332 5.75 12.2435 6.71313 12.2435 7.90625C12.2435 9.09937 11.332 10.0625 10.2029 10.0625C9.07377 10.0625 8.16231 9.09937 8.16231 7.90625C8.16231 6.71313 9.07377 5.75 10.2029 5.75ZM17.0048 12.9375C18.1339 12.9375 19.0454 13.9006 19.0454 15.0938C19.0454 16.2869 18.1339 17.25 17.0048 17.25C15.8757 17.25 14.9642 16.2869 14.9642 15.0938C14.9642 13.9006 15.8757 12.9375 17.0048 12.9375Z"
            className="fill-black"
          />
        </svg>
        {/* Added whitespace-nowrap to prevent text wrapping and maintain single line */}
        <p className="text-lm font-semibold text-black whitespace-nowrap">{label}</p>
      </div>
    </button>
  );
};

export default CouponButton;
