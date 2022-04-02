import React, { Component } from 'react';
import styled from 'styled-components';
import Loading from './images/VideoLoading.png';
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
    console.log(DeathInfo);
    return (
      <>
        <div>
          <div>
            {DeathInfo === true ? (
              <VideoBox src={Loading}>
                <video autoPlay={true} ref={this.videoRef} />
              </VideoBox>
            ) : DeathInfo === false ? (
              <DeathVideoBox src={BasicProfileDeath}>
                <div style={{ display: 'none' }}>
                  <video autoPlay={true} ref={this.videoRef} muted={true} />
                </div>
              </DeathVideoBox>
            ) : (
              <VideoBox src={Loading}>
                <video autoPlay={true} ref={this.videoRef} />
              </VideoBox>
            )}
          </div>
          <Text>
            <span>{this.getNicknameTag()}</span>
          </Text>
        </div>
      </>
    );
  }
}

const Text = styled.div`
  position: absolute;
  font-size: 18px;
  margin: 20px 0px 0px 30px;
  color: #6164ce;
  text-align: center;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 1251px) {
    margin: 20px;
  }
`;

const DeathVideoBox = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 1251px) {
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
  @media screen and (max-width: 1251px) {
    width: 200px;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 200px;
  }
`;
