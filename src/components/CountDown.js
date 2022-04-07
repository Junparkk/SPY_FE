import React from 'react';

const CountDown = ({ minsec }) => {
  const { minutes = 0, seconds = 60 } = minsec;
  const [[mins, secs], setTime] = React.useState([minutes, seconds]);

  const tick = () => {
    if (mins === 0 && secs === 0) reset();
    else if (secs === 0) {
      setTime([mins - 1, 59]);
    } else {
      setTime([mins, secs - 1]);
    }
  };

  const reset = () => setTime([parseInt(minutes), parseInt(seconds)]);

  React.useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
});

  return (
    <div>
      <p>남은 시간 : {`${mins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`}</p>
    </div>
  );
};

export default CountDown;
