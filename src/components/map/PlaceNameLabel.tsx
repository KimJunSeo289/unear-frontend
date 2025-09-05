interface PlaceNameLabelProps {
  placeName: string;
  className?: string;
  onClick?: () => void;
}

const PlaceNameLabel: React.FC<PlaceNameLabelProps> = ({ placeName, className = '', onClick }) => {
  return (
    <div
      className={`
        bg-black/80 text-white px-2 py-1 rounded-md
        text-xs font-semibold whitespace-nowrap text-center
        select-none shadow-sm max-w-[120px] overflow-hidden
        ${onClick ? 'cursor-pointer hover:bg-black/90 transition-colors' : 'pointer-events-none'}
        ${className}
      `}
      style={{
        textOverflow: 'ellipsis',
        lineHeight: '1.2',
        paddingTop: '7px',
        paddingBottom: '6px',
      }}
      onClick={onClick}
    >
      {placeName}
    </div>
  );
};

export default PlaceNameLabel;
