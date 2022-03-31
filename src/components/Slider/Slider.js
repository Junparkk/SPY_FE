import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import '../../styles/slider.css';
import styled from 'styled-components';
import dataSlider from './dataSlider';
import { useDispatch, useSelector } from 'react-redux';
// import { actionCreators as roomActions } from '../../redux/modules/room';
import { actionCreators as roomActions } from '../../redux/modules/room';
//리액트 아이콘
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import { GrClose } from 'react-icons/gr';
import { current } from 'immer';

//효과음
import click from '../../sound/Click Sound.mp3';

const Slider = ({ showModal, setShowModal }) => {
  const history = useHistory();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = dataSlider.length;
  const [check, setCheck] = useState(false);
  //useSelector 튜토리얼 api 전용
  const tuto = useSelector((state) => state.room.tuto);
 
  //클릭 효과음
  const sound = new Audio(click);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
    sound.play();
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
    sound.play();
  };

  const moveDot = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="slider">
      <BsFillArrowLeftCircleFill className="arrow prev" onClick={prevSlide} />
      <BsFillArrowRightCircleFill className="arrow next" onClick={nextSlide} />

      {dataSlider.map((slide, index) => {
        return (
          <div
            key={slide.id}
            className={index === currentSlide ? 'slide current' : 'slide'}
          >
            {index === currentSlide && (
              <>
                <img src={slide.image} alt="slide" />
                <Desc className="content">
                  <SlideTitle>{slide.heading}</SlideTitle>
                  <br />
                  <br />
                  <div style={{ textAlign: 'start' }}>{slide.desc}</div>
                </Desc>
              </>
            )}
          </div>
        );
      })}
      <div className="container-dots">
        {Array.from({ length: 4 }).map((item, index) => (
          <div
            key={index}
            onClick={() => moveDot(index)}
            className={currentSlide === index ? 'dot active' : 'dot'}
          ></div>
        ))}
      </div>
    </div>
  );
};

const SlideTitle = styled.p`
  font-size: 2.25rem;
  color: #ffe179;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 763px) {
    font-size: 1.5rem;
  }
`;

const Desc = styled.div`
  margin: auto;
  width: '50%';
  font-size: 1.25rem;
  background-color: #00000000;
  line-height: 30px;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 763px) {
    font-size: 1rem;
    line-height: 25px;
    width: 35%;
  }
`;

export default Slider;
