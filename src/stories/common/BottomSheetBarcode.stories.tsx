import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import BottomSheetBarcode from '@/components/common/BottomSheetBarcode';

// BottomSheetBarcode props 타입 정의
interface BottomSheetBarcodeProps {
  userName?: string;
  userGrade?: 'VIP' | 'VVIP' | '우수';
  barcodeValue?: string;
  isOpen: boolean;
  onClose: () => void;
}

const meta: Meta<typeof BottomSheetBarcode> = {
  title: 'Common/BottomSheetBarcode',
  component: BottomSheetBarcode,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[393px] min-h-screen bg-background mx-auto flex flex-col relative px-5">
        <div className="pt-[40px] pb-[65px]">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 바코드 바텀시트 컴포넌트입니다. 사용자 정보와 바코드를 표시하는 모달 형태의 바텀시트를 제공합니다. 외부에서 상태를 제어해야 합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    userName: {
      control: 'text',
      description: '사용자 이름',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"홍길동"' },
      },
    },
    userGrade: {
      control: 'select',
      options: ['VIP', 'VVIP', '우수'],
      description: '사용자 등급',
      table: {
        type: { summary: '"VIP" | "VVIP" | "우수"' },
        defaultValue: { summary: '"VVIP"' },
      },
    },
    barcodeValue: {
      control: 'text',
      description: '바코드 값',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"344BA876Y89"' },
      },
    },
    isOpen: {
      control: 'boolean',
      description: '바텀시트 열림 상태 (필수)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onClose: {
      action: 'closed',
      description: '바텀시트 닫기 함수 (필수)',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BottomSheetBarcode>;

// 상태 관리를 포함한 래퍼 컴포넌트
const BottomSheetBarcodeWithState = (props: Partial<BottomSheetBarcodeProps>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-primary text-white py-3 rounded-xl text-m font-semibold mb-4"
      >
        바코드 보기
      </button>
      <BottomSheetBarcode {...props} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export const Default: Story = {
  render: (args) => <BottomSheetBarcodeWithState {...args} />,
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본 바코드 바텀시트입니다. 버튼을 클릭하면 홍길동님, VVIP 등급으로 표시됩니다.',
      },
    },
  },
};

export const VipUser: Story = {
  render: (args) => <BottomSheetBarcodeWithState {...args} />,
  args: {
    userName: '김철수',
    userGrade: 'VIP',
    barcodeValue: '123456789',
  },
  parameters: {
    docs: {
      description: {
        story: 'VIP 등급 사용자의 바코드 바텀시트입니다.',
      },
    },
  },
};

export const ExcellentUser: Story = {
  render: (args) => <BottomSheetBarcodeWithState {...args} />,
  args: {
    userName: '이영희',
    userGrade: '우수',
    barcodeValue: 'EXCELLENT123',
  },
  parameters: {
    docs: {
      description: {
        story: '우수 등급 사용자의 바코드 바텀시트입니다.',
      },
    },
  },
};

export const LongUserName: Story = {
  render: (args) => <BottomSheetBarcodeWithState {...args} />,
  args: {
    userName: '김영수박사',
    userGrade: 'VVIP',
    barcodeValue: 'LONGNAME456',
  },
  parameters: {
    docs: {
      description: {
        story: '긴 이름을 가진 사용자의 바코드 바텀시트입니다.',
      },
    },
  },
};

export const CustomBarcode: Story = {
  render: (args) => <BottomSheetBarcodeWithState {...args} />,
  args: {
    userName: '최민수',
    userGrade: 'VIP',
    barcodeValue: 'CUSTOM789ABC',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 바코드 값을 사용하는 바텀시트입니다.',
      },
    },
  },
};

export const AllGrades: Story = {
  render: () => {
    const [openStates, setOpenStates] = useState({
      vip: false,
      vvip: false,
      excellent: false,
    });

    const handleOpen = (grade: 'vip' | 'vvip' | 'excellent') => {
      setOpenStates((prev) => ({ ...prev, [grade]: true }));
    };

    const handleClose = (grade: 'vip' | 'vvip' | 'excellent') => {
      setOpenStates((prev) => ({ ...prev, [grade]: false }));
    };

    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleOpen('vip')}
          className="w-full bg-primary text-white py-3 rounded-xl text-m font-semibold"
        >
          VIP 사용자 바코드 보기
        </button>
        <button
          onClick={() => handleOpen('vvip')}
          className="w-full bg-primary text-white py-3 rounded-xl text-m font-semibold"
        >
          VVIP 사용자 바코드 보기
        </button>
        <button
          onClick={() => handleOpen('excellent')}
          className="w-full bg-primary text-white py-3 rounded-xl text-m font-semibold"
        >
          우수 사용자 바코드 보기
        </button>

        <BottomSheetBarcode
          userName="VIP사용자"
          userGrade="VIP"
          barcodeValue="VIP123"
          isOpen={openStates.vip}
          onClose={() => handleClose('vip')}
        />
        <BottomSheetBarcode
          userName="VVIP사용자"
          userGrade="VVIP"
          barcodeValue="VVIP456"
          isOpen={openStates.vvip}
          onClose={() => handleClose('vvip')}
        />
        <BottomSheetBarcode
          userName="우수사용자"
          userGrade="우수"
          barcodeValue="EXCELLENT789"
          isOpen={openStates.excellent}
          onClose={() => handleClose('excellent')}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '모든 등급의 바코드 바텀시트를 각각 보여줄 수 있습니다. 각 버튼을 클릭하면 해당 등급의 바텀시트가 열립니다.',
      },
    },
  },
};
