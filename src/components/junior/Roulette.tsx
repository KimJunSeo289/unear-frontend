import React, { useState } from 'react';
import { styled } from '@mui/system';

import { FiArrowRight } from 'react-icons/fi';

interface PrizeData {
  id: string;
  brandName: string;
  prizeName: string;
  prizeImg: string;
}

interface RouletteProps {
  prizeData: PrizeData[];
}

const Wrap = styled('div')({
  width: '100vw',
  height: '100vh',
  paddingTop: 80,
  backgroundColor: '#0080f1',
});

const Contents = styled('div')({
  width: '100%',
  padding: '16px 24px 0',
  color: '#fff',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

const RouletteOuter = styled('div')({
  position: 'relative',
  marginTop: 38,
  width: '95%',
  maxWidth: 327,
  minWidth: 270,
  borderRadius: '50%',
  backgroundColor: '#EAF2FA',
  boxShadow: `0px 12px 20px rgba(0, 0, 0, 0.25)`,
  aspectRatio: '1/1',
  '@media (max-width:400px)': {
    width: 300,
  },
});

const RouletteDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'spinning' && prop !== 'selectedItem' && prop !== 'nbTurn',
})<{ spinning: boolean; selectedItem: number | null; nbTurn: number }>(
  ({ spinning, selectedItem, nbTurn }) => ({
    position: 'absolute',
    overflow: 'hidden',
    top: '3%',
    left: '3%',
    right: '3%',
    bottom: '3%',
    borderRadius: '50%',
    border: `4px solid #B1C8DE`,
    transformOrigin: 'center',
    transitionTimingFunction: 'ease-in-out',
    transform: `rotate(0deg)`,
    ...(spinning && {
      animationName: 'ani',
      animationDuration: '4s',
      animationFillMode: 'forwards',
      animationIterationCount: 1,
      transitionTimingFunction: 'ease-in-out',
    }),
    '@keyframes ani': {
      from: {
        transform: `rotate(0deg)`,
      },
      to: {
        transform: `rotate(calc(${nbTurn} * 360deg + (-45deg * ${selectedItem || 0})))`,
      },
    },
  })
);

const RoulettePin = styled(FiArrowRight)({
  position: 'absolute',
  top: -16,
  left: '50%',
  marginLeft: '-15px',
});

const Item = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  paddingTop: '10px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  color: 'black',
  fontSize: '10px',
  '&:nth-child(1)': {
    background: `conic-gradient(from 337.5deg, #E7EFF3 45deg, #ffffff 45deg 90deg, #E7EFF3 90deg 135deg, #ffffff 135deg 180deg, #E7EFF3 180deg 225deg, #ffffff 225deg 270deg, #E7EFF3 270deg 315deg, #ffffff 315deg)`,
  },
});

const Line = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: '50%',
  left: '50%',
  width: '4px',
  marginLeft: '-2px',
  background: '#B1C8DE',
  transformOrigin: 'bottom',
});

const BrandName = styled('p')({
  fontWeight: 400,
  fontSize: '8px',
  lineHeight: '9px',
  color: '#6B778C',
});

const PrizeName = styled('p')({
  paddingTop: 3,
  paddingBottom: 8,
  fontWeight: 500,
  fontSize: '10px',
  lineHeight: '11px',
  color: '#1A1A1A',
  '@media (max-width:400px)': {
    paddingBottom: 3,
  },
});

const PrizeImg = styled('div')({
  width: 45,
  height: 45,
  margin: `5px auto`,
  '@media (max-width:400px)': {
    width: 40,
    height: 40,
  },
});

const PrizeImgUrl = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const RouletteOuterBtn = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%)`,
  width: 92,
  height: 92,
  borderRadius: '50%',
  backgroundColor: '#FFDB00',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width:400px)': {
    width: 80,
    height: 80,
  },
});

const RouletteBtn = styled('button')({
  width: 78,
  height: 78,
  borderRadius: '50%',
  backgroundColor: '#0080F1',
  border: 'none',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '@media (max-width:400px)': {
    width: 66,
    height: 66,
    fontSize: '15px',
  },
});

const Roulette: React.FC<RouletteProps> = ({ prizeData }) => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const nbTurn = 5;

  const handleClick = () => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * prizeData.length);
    setSelectedItem(randomIndex);
    setTimeout(() => {
      setSpinning(false);
    }, 4000); // 애니메이션 종료 시간
  };

  return (
    <Wrap>
      <Contents>
        <RouletteOuter>
          <RouletteDiv spinning={spinning} selectedItem={selectedItem} nbTurn={nbTurn}>
            <div>
              {prizeData.map((item, i) => {
                return (
                  <Item style={{ transform: `rotate(${(i + 1) * 45}deg)` }} key={item.id}>
                    <div>
                      <div>
                        <BrandName>{item.brandName}</BrandName>
                        <PrizeName>{item.prizeName}</PrizeName>
                      </div>
                      <PrizeImg>
                        <PrizeImgUrl src={item.prizeImg} alt={item.prizeName} />
                      </PrizeImg>
                    </div>
                  </Item>
                );
              })}
            </div>
            <div>
              {[...Array(8)].map((_n, index) => {
                return (
                  <Line
                    style={{
                      transform: `rotate(${(index + 1) * 45 - 22.5}deg)`,
                    }}
                    key={index}
                  />
                );
              })}
            </div>
          </RouletteDiv>
          <RoulettePin />
          <RouletteOuterBtn>
            <RouletteBtn onClick={handleClick} disabled={spinning}>
              <p>도전</p>
            </RouletteBtn>
          </RouletteOuterBtn>
        </RouletteOuter>
      </Contents>
    </Wrap>
  );
};

export default Roulette;
