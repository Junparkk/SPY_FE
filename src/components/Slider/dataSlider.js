import { v4 as uuidv4 } from 'uuid';

const dataSlider = [
  {
    id: uuidv4(),
    image: "https://dimg.donga.com/ugc/CDB/WEEKLY/Article/5b/b3/22/85/5bb32285000ed2738de6.jpg",
    heading: '산업 스파이의 룰',
    desc: `"work to life"의 기밀무너를 훔쳐가기 위해 "without working"에서 잠입한 스파이입니다.\n사원들을 속여서 서로에게 과반수 득표를 하게 만든 후 다득표를 한 사원의 퇴직서를 받아낸다.\n사원들이 투표를 이용해 3일동안에 산업 스파이를 찾아내서 쫒아내지 못한다면 산업 스파이의 승리!.\n\n 쉿! 정체를 들키지 않고 사원들의 퇴직서를 받아내세요.`,
  },
  {
    id: uuidv4(),
    image: "https://t1.daumcdn.net/cfile/tistory/9901A8495CEF7E0A14",
    heading: 'tutorial_2',
    desc: 'rule2',
  },
  {
    id: uuidv4(),
    image: "http://rgo4.com/files/attach/images/2681740/078/916/003/b3192069dadd05fec60d36879d742318.jpg",
    heading: 'tutorial_3',
    desc: 'rule3',
  },
];

export default dataSlider;
