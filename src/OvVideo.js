import React, { Component } from 'react';
import styled from 'styled-components';
import Loading from './images/VideoLoading.png';
import SubUserProfile from '../src/components/SubUserProfile';
import BasicProfileDeath from './images/BasicProfile_Death.png';

export default class OpenViduVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  getNicknameTag() {
    return JSON.parse(this.props.streamManager.stream.connection.data)
      .clientData;
  }

  componentDidUpdate(props) {
    if (props && !!this.videoRef) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  componentDidMount() {
    if (this.props && !!this.videoRef) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  render() {
    const DeathInfo = this.props.deathinfo;
    return (
      <>
        <div>
          <div>
            {DeathInfo === true ? (
              <div>
                <VideoBox src={Loading}>
                  <video autoPlay={true} ref={this.videoRef} />
                </VideoBox>
                <SubUserProfile deathinfo={DeathInfo} />
              </div>
            ) : DeathInfo === false ? (
              <div>
                <DeathVideoBox src={BasicProfileDeath}>
                  <div style={{ display: 'none' }}>
                    <video autoPlay={true} ref={this.videoRef} muted={true} />
                  </div>
                </DeathVideoBox>
                <SubUserProfile deathinfo={DeathInfo} />
              </div>
            ) : (
              <VideoBox src={Loading}>
                <video autoPlay={true} ref={this.videoRef} />
              </VideoBox>
            )}
          </div>
        </div>
        <Text>
          <span>{this.getNicknameTag()}</span>
        </Text>
      </>
    );
  }
}

const Text = styled.div`
  position: absolute;
  font-size: 18px;
  margin: 25px 0px 0px 25px;
  color: #6164ce;
  text-align: center;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 1416px) {
    margin: 20px 0px 0px 20px;
    font-size: 14px;
  }
`;

const DeathVideoBox = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 1416px) {
    width: 200px;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 200px;
  }
`;

const VideoBox = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 1416px) {
    width: 200px;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 200px;
  }
`;
