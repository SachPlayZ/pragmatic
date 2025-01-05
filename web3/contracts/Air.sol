// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Air {
    uint256 public airQualityIndex;

    function setAirQualityIndex(uint256 _airQualityIndex) public {
        airQualityIndex = _airQualityIndex;
    }
}
