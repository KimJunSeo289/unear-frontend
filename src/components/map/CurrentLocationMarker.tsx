const CurrentLocationMarker = () => {
  return (
    <div className="relative w-[30px] h-[30px]">
      {/* 바깥 흐린 붉은 원 (배경) */}
      <div className="absolute w-[30px] h-[30px] bg-red-500/20 rounded-full top-0 left-0 animate-blink-pulse" />
      {/* 가운데 흰색 반투명 원 */}
      <div className="absolute w-[16.02px] h-[16.02px] bg-white/80 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      {/* 중심 빨간 원 */}
      <div className="absolute w-[12.65px] h-[12.65px] bg-red-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default CurrentLocationMarker;
