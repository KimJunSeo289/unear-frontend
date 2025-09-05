import MapLocationIcon from '@/assets/map/mapLocationIcon.svg?react';

interface Props {
  onClick?: () => void;
}

const MapLocationButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-[24px] right-[10px] z-20 w-[45px] h-[45px] p-[12px] bg-white rounded-full drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] flex items-center justify-center"
    >
      <MapLocationIcon className="w-full h-full" />
    </button>
  );
};

export default MapLocationButton;
