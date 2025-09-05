type CallButtonProps = {
  onClick?: () => void;
  width?: number | string;
};

const CallButton: React.FC<CallButtonProps> = ({ onClick, width }) => {
  // 명시적으로 지원할 width 클래스만 정적 분기
  let buttonWidthClass = 'w-[146px]';

  if (width === 169) buttonWidthClass = 'w-[169px]';
  else if (width === 180) buttonWidthClass = 'w-[180px]';
  else if (width === 'w-full') buttonWidthClass = 'w-full';
  else if (typeof width === 'string') buttonWidthClass = width;

  return (
    <button
      className={`group ${buttonWidthClass} h-[46px] relative bg-white hover:bg-green-50 transition-colors duration-200 rounded-lg flex-shrink-0`}
      onClick={onClick}
    >
      {/* 테두리 박스 */}
      <div className="absolute inset-0 rounded-lg border border-green-600 group-hover:border-green-600 transition-colors duration-200" />

      {/* 아이콘 + 텍스트 그룹 */}
      <div className="absolute inset-0 flex items-center justify-center space-x-2 z-10">
        <svg
          width={18}
          height={16}
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M16.3956 11.8238C15.7811 11.2926 14.2928 10.5173 13.5706 10.2048C12.6303 9.79844 12.5529 9.76524 11.8137 10.2364C11.3207 10.5508 10.9929 10.8317 10.4159 10.7261C9.83891 10.6205 8.58507 10.0252 7.48718 9.08623C6.3893 8.14725 5.65518 7.04026 5.53173 6.54686C5.40828 6.05346 5.74109 5.77555 6.10409 5.35155C6.61568 4.75389 6.57698 4.65428 6.13969 3.84744C5.79875 3.2199 4.86882 1.95487 4.24732 1.43026C3.58247 0.866799 3.58247 0.966408 3.15407 1.11914C2.8053 1.24502 2.4707 1.39806 2.15448 1.57635C1.5353 1.9293 1.19166 2.22248 0.951339 2.66309C0.711019 3.10369 0.603049 4.13664 1.84412 6.07106C3.08519 8.00547 3.95591 8.99459 5.75812 10.5365C7.56032 12.0785 8.94613 12.9076 10.972 13.8824C13.4781 15.0867 14.4394 14.852 14.9545 14.6461C15.4696 14.4402 15.8128 14.148 16.225 13.6168C16.4333 13.3459 16.6121 13.0592 16.759 12.7602C16.9374 12.3939 17.0535 12.3939 16.3956 11.8238Z"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fill-green-600 stroke-green-600 group-hover:fill-green-600 group-hover:stroke-green-600 transition-colors duration-200"
          />
        </svg>

        <p className="text-base font-semibold text-green-600 group-hover:text-green-600 transition-colors duration-200">
          전화 걸기
        </p>
      </div>
    </button>
  );
};

export default CallButton;
