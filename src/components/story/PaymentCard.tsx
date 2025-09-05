interface PaymentInfoBoxProps {
  date: string;
  title: string;
  price: string;
  imageSrc?: string; // 이미지 선택적
  customIcon?: React.ReactNode; // 아이콘 컴포넌트도 가능
}

const PaymentCard = ({ date, title, price, imageSrc, customIcon }: PaymentInfoBoxProps) => {
  return (
    <div className="w-full h-[74px] bg-blue-50 rounded-xl p-2.5 flex items-center">
      {/* 이미지 또는 아이콘 */}
      {customIcon ? (
        <div className="w-[54px] h-[54px]">{customIcon}</div>
      ) : (
        <img
          src={imageSrc}
          alt="결제 이미지"
          className="w-[54px] h-[54px] rounded-lg object-cover"
        />
      )}

      {/* 텍스트 영역 */}
      <div className="ml-[10px] flex flex-col justify-center">
        <span className="text-xs font-semibold text-gray-600 mb-0.5">{date}</span>
        <span className="text-sm font-semibold text-black">{title}</span>
        <span className="text-sm font-semibold text-black">{price}</span>
      </div>
    </div>
  );
};

export default PaymentCard;
