import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import '../../styles/slider.css';
import dataSlider from './dataSlider';

//리액트 아이콘
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import { AiOutlineCloseSquare } from 'react-icons/ai';

const Slider = () => {
  // const [slideIndex, setSlideIndex] = useState(1); // 18분 유튜브
  const history = useHistory();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = dataSlider.length;
  const [check, setCheck] = useState(false);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);
  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
    console.log(setCurrentSlide);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  const moveDot = (index) => {
    setCurrentSlide(index);
  };

  const tutorial = () => {
    setCheck(true)
  };
  return (
    <div className="slider">
      <BsFillArrowLeftCircleFill className="arrow prev" onClick={prevSlide} />
      <BsFillArrowRightCircleFill className="arrow next" onClick={nextSlide} />
      {dataSlider.map((slide, index) => {
        return (
          <div
            className={index === currentSlide ? 'slide current' : 'slide'}
            key={index}
          >
            {index === currentSlide && (
              <>
                <img src={slide.image} alt="slide" />
                <div className="content">
                  <h1>{slide.heading}</h1>
                  <p>{slide.desc}</p>

                  <div className="closeBtn">
                    <button
                      className="skipBtn"
                      onClick={() => {
                        history.push('/');
                      }}
                    >
                      SKIP
                    </button>
                    <button className="neverBtn" onClick={tutorial}>
                      다시 열지 않기 <AiOutlineCloseSquare />
                    </button>
                  </div>
                  {/* 인덱스가 3이면 시작하기로 바꾸기 */}
                </div>
              </>
            )}
          </div>
        );
      })}

      <div className="container-dots">
        {Array.from({ length: 3 }).map((item, index) => (
          <div
            onClick={() => moveDot(index)}
            className={currentSlide === index ? 'dot active' : 'dot'}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
