// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lock is ERC20, Ownable {
    struct Property {
        address owner;
        uint256 totalValue; // AVAX
        uint256 totalTokens; // PROP
        bool isListed;
        uint256 rentalIncome;
        uint256 resalePrice;
        bool forSale;
        uint256 finalReturnRate;
        uint256 totalInvestedTokens;
        bool returnRateFinalized;
    }

    struct PropertyDetails {
        address owner;
        uint256 totalValue;
        uint256 totalTokens;
        bool isListed;
        uint256 rentalIncome;
        uint256 resalePrice;
        bool forSale;
    }

    struct Investment {
        uint256 tokenAmount;
        uint256 investmentAmount;
        uint256 proposedReturnRate;
        bool hasVoted;
        bool exists;
    }

    uint256 public constant ONE_AVAX_IN_PROP = 1000;

    mapping(uint256 => Property) public property;
    uint256 private propertyCounter;
    mapping(address => mapping(uint256 => Investment)) public investments;
    mapping(uint256 => uint256) public burnLimits;
    mapping(uint256 => uint256) public propertyLiquidity;

    uint256[] private allPropertyIds;

    event PropertyListed(
        uint256 indexed propertyId,
        address owner,
        uint256 totalValue,
        uint256 totalTokens
    );
    event InvestmentMade(
        uint256 indexed propertyId,
        address investor,
        uint256 tokens,
        uint256 amount,
        uint256 proposedRate
    );
    event Debug(string message, uint256 value);

    constructor() ERC20("Property Token", "PROP") Ownable(msg.sender) {}

    function listProperty(uint256 _totalValue) external {
        require(_totalValue > 0, "Invalid property value");

        uint _totalTokens = _totalValue * ONE_AVAX_IN_PROP;
        uint256 propertyId = propertyCounter++;

        property[propertyId] = Property({
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
        });

        propertyLiquidity[propertyId] = _totalValue;
        allPropertyIds.push(propertyId);

        emit PropertyListed(propertyId, msg.sender, _totalValue, _totalTokens);
    }

    function getAllProperties() external view returns (Property[] memory) {
        uint256 totalProperties = allPropertyIds.length;
        Property[] memory properties = new Property[](totalProperties);

        for (uint256 i = 0; i < totalProperties; i++) {
            properties[i] = property[allPropertyIds[i]];
        }

        return properties;
    }

    function getListingById(
        uint256 _propertyId
    ) external view returns (PropertyDetails memory) {
        Property storage _property = property[_propertyId];
        require(_property.isListed, "Property not listed");

        return
            PropertyDetails({
                owner: _property.owner,
                totalValue: _property.totalValue,
                totalTokens: _property.totalTokens,
                isListed: _property.isListed,
                rentalIncome: _property.rentalIncome,
                resalePrice: _property.resalePrice,
                forSale: _property.forSale
            });
    }

    function invest(
        uint256 _propertyId,
        uint256 _proposedReturnRate
    ) external payable {
        Property storage prop = property[_propertyId];

        require(prop.isListed, "Property not listed");
        emit Debug("Passed: Property is listed", _propertyId);

        require(!prop.returnRateFinalized, "Return rate already finalized");
        emit Debug("Passed: Return rate not finalized", _propertyId);

        require(msg.value > 0, "Invalid investment amount");
        emit Debug("Passed: Investment amount is valid", msg.value);

        require(_proposedReturnRate > 0, "Invalid return rate");
        emit Debug("Passed: Return rate is valid", _proposedReturnRate);

        uint256 tokenAmount = (msg.value * prop.totalTokens) / prop.totalValue;
        emit Debug("Calculated tokenAmount", tokenAmount);

        require(tokenAmount > 0, "Investment too small");
        emit Debug("Passed: Investment not too small", tokenAmount);

        require(
            prop.totalInvestedTokens + tokenAmount <= prop.totalTokens,
            "Exceeds available tokens"
        );
        emit Debug(
            "Passed: Token amount within limits",
            prop.totalInvestedTokens + tokenAmount
        );

        Investment storage investment = investments[msg.sender][_propertyId];
        if (!investment.exists) {
            investments[msg.sender][_propertyId] = Investment({
                tokenAmount: tokenAmount,
                investmentAmount: msg.value,
                proposedReturnRate: _proposedReturnRate,
                hasVoted: true,
                exists: true
            });
        } else {
            uint256 totalTokens = investment.tokenAmount + tokenAmount;
            uint256 weightedOldRate = investment.proposedReturnRate *
                investment.tokenAmount;
            uint256 weightedNewRate = _proposedReturnRate * tokenAmount;
            investment.proposedReturnRate =
                (weightedOldRate + weightedNewRate) /
                totalTokens;
            investment.tokenAmount = totalTokens;
            investment.investmentAmount += msg.value;
        }

        prop.totalInvestedTokens += tokenAmount;

        _mint(msg.sender, tokenAmount);

        emit InvestmentMade(
            _propertyId,
            msg.sender,
            tokenAmount,
            msg.value,
            _proposedReturnRate
        );
    }
}
