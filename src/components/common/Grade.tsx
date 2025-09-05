type GradeType = 'VIP' | 'VVIP' | '우수';

type GradeProps = {
  grade: GradeType;
};

const gradeStyles: Record<GradeType, { bg: string; text: string }> = {
  VIP: {
    bg: 'bg-purple-100',
    text: 'text-purple-500',
  },
  VVIP: {
    bg: 'bg-pink-100',
    text: 'text-primary',
  },
  우수: {
    bg: 'bg-blue-100',
    text: 'text-blue-500',
  },
};

export default function Grade({ grade }: GradeProps) {
  const { bg, text } = gradeStyles[grade];

  return (
    <div className="relative w-[61px] h-5">
      <div className={`absolute left-0 top-0 w-[61px] h-5 rounded-[20px] ${bg}`} />
      <p
        className={`absolute pt-[1px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-center ${text}`}
      >
        {grade}
      </p>
    </div>
  );
}
