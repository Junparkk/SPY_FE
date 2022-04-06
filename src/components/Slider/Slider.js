import React, { useState, useEffect } from 'react';
import '../../styles/slider.css';
import styled from 'styled-components';
import dataSlider from './dataSlider';
//리액트 아이콘
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';

//효과음
import click from '../../sound/Click Sound.mp3';

const Slider = ({ showModal, setShowModal }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = dataSlider.length;

  //클릭 효과음
  const sound = new Audio(click);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  const close = () => {
    setShowModal((prev) => !prev);
    sound.play();
  };

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

  const Gif = currentSlide > 1;

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
                <img src={Gif ? slide.src : slide.image} alt="slide" />
                <Desc className="content">
                  <SlideTitle>{slide.heading}</SlideTitle>
                  <DescSrc>{slide.desc}</DescSrc>
                </Desc>
              </>
            )}
          </div>
        );
      })}
      <div className="container-dots">
        {Array.from({ length: 8 }).map((item, index) => (
          <div
            key={index}
            onClick={() => moveDot(index)}
            className={currentSlide === index ? 'dot active' : 'dot'}
          ></div>
        ))}
      </div>
      <CloseModal onClick={close}>SKIP</CloseModal>
    </div>
  );
};

const SlideTitle = styled.p`
  font-size: 3rem;
  color: #ffff00;
  height: 5rem;
  text-align: center;
  align-items: center;
  font-family: 'yg-jalnan';
  margin-bottom: 4rem;
  @media screen and (max-width: 763px) {
    font-size: 1.5rem;
  }
`;

const Desc = styled.div`
  margin: auto;
  width: '50%';
  font-size: 1.25rem;
  background-color: #00000000;
  background: url('${(props) => props.src}') no-repeat center/contain;

  line-height: 30px;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 763px) {
    font-size: 1rem;
    line-height: 25px;
    width: 35%;
  }
`;

const CloseModal = styled.button`
  cursor: pointer;
  border: none;
  position: absolute;
  background-color: #9296fd;
  bottom: 60px;
  left: 45.5%;
  width: 11%;
  min-width: 60px;
  height: 55px;
  border-radius: 30px;
  box-shadow: 5px 5px 5px #bbbbbbbb;
  font-family: 'yg-jalnan';
  color: #dddddd;
  font-size: 1.5rem;
  padding: 0;
  z-index: 10;
`;
const DescSrc = styled.div`
  width: 100%;
  background: url('${(props) => props.src}') no-repeat center/contain;
  height: 80%;
  @media screen and (max-width: 763px) {
    font-size: 1rem;
    line-height: 25px;
    width: 35%;
  }
`;

export default Slider;
