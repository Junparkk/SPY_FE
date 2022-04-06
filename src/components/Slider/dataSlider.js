import { v4 as uuidv4 } from 'uuid';
import Tutorial1 from '../../images/Tutorial1.png';
import Tutorial2 from '../../images/Tutorial2.png';
import spyvote from '../../images/spy-vote.gif';
import lawyervote from '../../images/lawyer-vote.gif';
import detectivevote from '../../images/detective-vote.gif';
import day_night from '../../images/day-night-vote.gif';
import role from '../../images/role-give.gif';
import result from '../../images/result.gif';

const dataSlider = [
  {
    id: uuidv4(),
    image: Tutorial1,
    heading: '게임 시작 전 설정',
    desc: `INDUSTRIAL S.P.Y는 크롬 환경에서 플레이하는 것을 권장합니다.

    마이크와 카메라 설정 방법
    - 첫 화면 URL 왼쪽 자물쇠 버튼 누르기
    - 마이크, 카메라 활성화하기

    기본적으로 최소 6명으로 플레이할 수 있지만
    인원이 모자를 때 시작하기 버튼을 누르면 AI 플레이어가 자동 추가되어 시작합니다.

    추가로 게임이 시작 되면 퇴장 할 수 없으므로 인원 확인 후 시작 부탁드립니다.
    `,
    src: "",
  },
  {
    id: uuidv4(),
    image: Tutorial2,
    heading: '게임 세부방법',
    desc: `
      게임 시작 후 시간이 지남에 따라 투표창이 나오게 되며 
      
      의심되는 스파이를 선택 할 수 있습니다.

      결과발표는 낮투표, 밤투표가 각각 끝나는 시점에 나옵니다.

      플레이어가 선택하지 않게 되면 랜덤으로 선택되게 됩니다.
    
    `,
    src: "",
  },
  {
    id: uuidv4(),
    heading: '게임 영상 - 직업 부여',
    src:role,
  },
  {
    id: uuidv4(),
    heading: '게임 영상 - 낮, 밤 투표',
    src:day_night,
  },
  {
    id: uuidv4(),
    heading: '게임 영상 - 변호사 투표',
    src:lawyervote,
  },
  {
    id: uuidv4(),
    heading: '게임 영상 - 탐정 투표',
    src:detectivevote,
  },
  {
    id: uuidv4(),
    heading: '게임 영상 - 스파이 투표',
    src:spyvote,
  },
  {
    id: uuidv4(),
    heading: '게임 영상 - 결과',
    src:result,
  },
];

export default dataSlider;
