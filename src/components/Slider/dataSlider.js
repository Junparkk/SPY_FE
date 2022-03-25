import { v4 as uuidv4 } from 'uuid';
import Tutorial1 from '../../images/Tutorial1.png';
import Tutorial2 from '../../images/Tutorial2.png';
import Tutorial3 from '../../images/Tutorial3.png';
// import slider1 from '../images/slide1.png'

const dataSlider = [
  {
    id: uuidv4(),
    image: Tutorial1,
    heading: '산업스파이의 룰',
    desc: `"Work To Life"의 기밀문서를 훔쳐가기 위해 "Without Working"에서 잠입한 스파이입니다.
    
    사원들을 속여서 서로에게 과반수 득표를 하게 만든 후 다득표를 한 사원의 퇴직서를 받아낸다.
    
    사원들이 투표를 이용해 정해진 시간내에 산업스파이를 찾아내서 쫓아내지 못한다면 산업스파이의 승리!
    
    쉿! 정체를 들키지 않고 사원들의 퇴직서를 받아내세요.`,
  },
  {
    id: uuidv4(),
    image: Tutorial2,
    heading: '평사원들의 룰',
    desc: `우리 회사에 잠입한 정보를 가져가려고 하는 산업 스파이를 찾아내세요!

    사원들을 퇴직시키지 않고 산업 스파이를 잘 골라 투표로 쫓아내세요.

    만약 사원들이 승리할 경우 가고 싶은 지역으로 3일 동안의 휴가가 주어집니다.

    누가 거짓말을 하고 있는지 얼굴을 대면하면서 찾아내세요!`,
  },
  {
    id: uuidv4(),
    image: Tutorial3,
    heading: '특별한 직책을 가진 사원들의 룰',
    desc: `우리 회사에 잠입한 정보를 가져가려고 하는 산업 스파이가 숨어있습니다.

    당신들의 특별한 능력으로 산업 스파이를 가리고,
    직책을 가지고 있지 않은 평사원들을 지켜주세요.

    사원들을 퇴직시키지 않고 산업 스파이를 잘 골라 투표로 쫓아내세요.

    만약 사원들이 승리할 경우 가고 싶은 지역으로 3일 동안의 휴가가 주어집니다.  

    누가 거짓말을 하고 있는지 얼굴을 대면하면서 찾아내세요!`,
  },
  {
    id: uuidv4(),
    image: Tutorial1,
    heading: '게임 설정',
    desc: `INDUSTRIAL S.P.Y는 크롬 환경에서 플레이하는 것을 권장합니다.

    마이크와 카메라 설정 방법
    - 첫 화면 URL 왼쪽 자물쇠 버튼 누르기
    - 마이크, 카메라 활성화하기
    
    기본적으로 최소 6명으로 플레이할 수 있지만
    인원이 모자를 때 시작하기 버튼을 누르면 AI 플레이어가 자동 추가되어 시작합니다.
    
    `,
  },
];

export default dataSlider;
