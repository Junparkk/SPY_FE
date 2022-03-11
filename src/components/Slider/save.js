import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import '../../styles/slider.css';
import dataSlider from './dataSlider';
import { useDispatch, useSelector } from 'react-redux';
// import { actionCreators as roomActions } from '../../redux/modules/room';
import { actionCreators as roomActions } from '../../redux/modules/room';
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
  //useSelector 튜토리얼 api 전용
  const tuto = useSelector((state) => state.room.tuto);
  console.log(tuto);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  const nextSlide = () => {
    // setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
    // console.log(setCurrentSlide);
    if (currentSlide <= 0) {
      setCurrentSlide(slideLength - 1);
      return;
    }
    setCurrentSlide(currentSlide - 1);
  };

  const prevSlide = () => {
    // setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
    if (currentSlide >= slideLength - 1) {
      setCurrentSlide(0);
      return;
    }
    setCurrentSlide(currentSlide + 1);
  };

  const moveDot = (index) => {
    setCurrentSlide(index);
  };

  //다시보지않기
  const tutorial = () => {
    setCheck(true);
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
                </div>
              </>
            )}
          </div>
        );
      })}

      <div className="container-dots">
        {Array.from({ length: 3 }).map((item, index) => (
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

export default Slider;
