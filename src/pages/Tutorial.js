import React, { useState } from 'react';
// import BtnSlider from "./BtnSlider"
import Slider from '../components/Slider/Slider';
import TutoSlider from '../components/TutoSlider';

// 총 3페이지로 구성되며 각 페이지마다 룰 설명페이지
// 슬라이드 가능하고, 다시 보지않기 버튼(체크박스) 사용

const Tutorial = () => {
  return (
    <>
      <Slider/>
      {/* <TutoSlider/> */}
    </>
  );
};

export default Tutorial;
