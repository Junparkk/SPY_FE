import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';
import styled from 'styled-components';

export default class UserVideoComponent extends Component {
  getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(this.props.streamManager.stream.connection.data)
      .clientData;
  }

  render() {
    return (
      <>
        {this.props.streamManager !== undefined ? (
          <VideoBox>
            <div className="streamcomponent">
              <OpenViduVideoComponent
                streamManager={this.props.streamManager}
              />
              <div>
                <p>{this.getNicknameTag()}</p>
              </div>
            </div>
          </VideoBox>
        ) : null}
      </>
    );
  }
}

const VideoBox = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  margin: 40px;
  overflow: hidden;
`;
