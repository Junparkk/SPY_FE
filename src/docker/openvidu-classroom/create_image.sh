#!/bin/bash

docker build --pull --no-cache --rm=true --build-arg OPENVIDU_TUTORIALS_VERSION="$1" -t openvidu/openvidu-classroom .
docker tag openvidu/openvidu-classroom:latest openvidu/openvidu-classroom:$1