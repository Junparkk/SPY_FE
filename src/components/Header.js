import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

import { GiSpeakerOff, GiSpeaker } from 'react-icons/gi';

const Header = () => {
  function Sound() {
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);

    return (
      <>
        <div style={{display: "flex"}}>
          <div onClick={() => setMuted((m) => !m)}>
            {volume === 0 || muted ? (
              <GiSpeakerOff size={36} />
            ) : (
              <GiSpeaker size={36} />
            )}
          </div>
          <div style={{ margin: "auto"}}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={(event) => {
                setVolume(event.target.valueAsNumber);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <React.Fragment>
      <Wrap>
        <SoundBar>
          <Sound />
        </SoundBar>
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  display: flex;
  background-color: #DFD880;
  
`;

const SoundBar = styled.div`
  color: white;
  margin: 10px;
`;

export default Header;
