import Image404 from '@/assets/common/404nubi.png';

export default function _404State() {
  return (
    <div className="w-[393px] h-[852px] bg-background flex flex-col items-center justify-center space-y-8">
      <p className="text-lg font-semibold text-black text-center px-4">
        요청하신 페이지를 찾을 수 없어요
      </p>
      <img src={Image404} alt="404-state" className="w-[268px] h-[262px] object-cover" />
    </div>
  );
}
