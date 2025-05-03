// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// contract New is ERC20, Ownable {
contract New is ERC20, Ownable {
    AggregatorV3Interface internal dataFeed;
    struct Property {
        uint256 id;
        address owner;
        uint256 totalValue;
        uint256 totalTokens;
        bool isListed;
        uint256 rentalIncome;
        uint256 resalePrice;
        bool forSale;
        uint256 finalReturnRate;
        uint256 totalInvestedTokens;
        bool returnRateFinalized;
    }

    uint256 public constant ONE_PROP_IN_AVAX = 1;
    uint256 public constant ONE_AVAX_IN_PROP = 1000;

    mapping(uint256 => Property) public property;
    uint256 private propertyCounter = 0;
    // mapping(address => mapping(uint256 => Investment)) public investments;
    mapping(uint256 => uint256) public propertyLiquidity;
    mapping(uint256 => uint256) public totalWeightedVotes;
    uint256[] private allPropertyIds;
    uint256[] private propertiesOnSale;
    Property[] private propertiesAll;

    event PropertyListed(
        uint256 indexed propertyId,
        address owner,
        uint256 totalValue,
        uint256 totalTokens
    );

    constructor() ERC20("Property Token", "PROP") Ownable(msg.sender) {
        dataFeed = AggregatorV3Interface(
            0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
        );
    }

    function listProperty(uint256 _totalValue) external {
        require(_totalValue > 0, "Invalid property value");

        uint256 _totalTokens = _totalValue * ONE_AVAX_IN_PROP;
        uint256 propertyId = propertyCounter++;

        propertiesAll.push(
            property[propertyId] = Property({
                id: propertyId,
                owner: msg.sender,
                totalValue: _totalValue,
                totalTokens: _totalTokens,
                isListed: true,
                rentalIncome: 0,
                resalePrice: 0,
                forSale: false,
                finalReturnRate: 0,
                totalInvestedTokens: 0,
                returnRateFinalized: false
            })
        );

        propertyLiquidity[propertyId] = _totalValue;
        allPropertyIds.push(propertyId);

        emit PropertyListed(propertyId, msg.sender, _totalValue, _totalTokens);
    }

    function getAllProperties() external view returns (Property[] memory) {
        return propertiesAll;
    }
}
