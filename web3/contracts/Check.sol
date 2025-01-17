// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PropertyToken
 * @dev A smart contract for tokenizing real estate properties and managing investments
 * The contract allows property owners to list their properties and investors to purchase tokens
 * representing ownership shares. It includes features for return rate voting and property resale.
 */
contract Check is ERC20, Ownable {
    struct Property {
        address owner;
        uint256 totalValue; // AVAX
        uint256 totalTokens; // PROP
        bool isListed; // Can be removed
        uint256 rentalIncome; // Later
        uint256 resalePrice;
        bool forSale; // Ensure this line is present in the Property struct
        uint256 finalReturnRate; // Weighted average return rate
        uint256 totalInvestedTokens; // Track total tokens invested
        bool returnRateFinalized; // Whether return rate voting is complete
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
        uint256 proposedReturnRate; // Investor's proposed return rate
        bool hasVoted; // Track if investor has voted on return rate
        bool exists;
    }

    struct PropertyOnSaleDetails {
        address owner;
        uint256 totalValue;
        uint256 resalePrice;
        uint256 finalReturnRate;
    }

    // Platform fee percentage (2%)
    uint256 public constant PLATFORM_FEE = 2;
    uint256 public constant BASIS_POINTS = 300;
    uint256 public constant ONE_PROP_IN_AVAX = 1;

    // Will Update
    uint256 public constant ONE_AVAX_IN_PROP = 1000;

    // Mapping to store properties
    mapping(uint256 => Property) public property;
    // Property ID counter
    uint256 private propertyCounter;
    // Mapping of property investments per address
    mapping(address => mapping(uint256 => Investment)) public investments;
    // Burn limits per property
    mapping(uint256 => uint256) public burnLimits;
    // Available liquidity per property
    mapping(uint256 => uint256) public propertyLiquidity;
    // Track total weighted votes per property
    mapping(uint256 => uint256) public totalWeightedVotes;
    // Array to store all property IDs
    uint256[] private allPropertyIds;
    // Array to store IDs of properties on sale
    uint256[] private propertiesOnSale;

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
    event ReturnRateProposed(
        uint256 indexed propertyId,
        address investor,
        uint256 proposedRate,
        uint256 weight
    );
    event ReturnRateFinalized(uint256 indexed propertyId, uint256 finalRate);
    event TokensBurned(
        address indexed investor,
        uint256 propertyId,
        uint256 amount,
        uint256 returnAmount
    );

    constructor() ERC20("Property Token", "PROP") Ownable(msg.sender) {}

    /**
     * @dev Lists a new property for tokenization
     * @param _totalValue The total value of the property in wei
     */

    // Value needs to be sent in WEI
    function listProperty(uint256 _totalValue) external {
        require(_totalValue > 0, "Invalid property value");

        // One AVAX = 1000 PROP here for testing purposes
        uint256 _totalTokens = _totalValue * ONE_AVAX_IN_PROP;

        uint256 propertyId = propertyCounter++;

        property[propertyId] = Property({
            owner: msg.sender,
            totalValue: _totalValue, // Assume _totalValue is provided in wei
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

    /**
     * @dev Returns all properties with their complete details
     * @return An array of Property structs where the array index corresponds to the property ID
     * This simplified format allows the frontend to use array indices as property IDs
     * while maintaining all the necessary property information
     */
    function getAllProperties() external view returns (Property[] memory) {
        uint256 totalProperties = allPropertyIds.length;
        Property[] memory properties = new Property[](totalProperties);

        for (uint256 i = 0; i < totalProperties; i++) {
            properties[i] = property[allPropertyIds[i]];
        }

        return properties;
    }

    /**
     * @dev Returns property details in a structured format
     * @param _propertyId The ID of the property to retrieve
     * @return A PropertyDetails struct containing all property information
     */
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

    event Debug(string message, uint256 value);

    // INVEST FOR CONTRACT
    // msg.value IN AVAX
    function invest(
        uint256 _propertyId,
        uint256 _proposedReturnRate
    ) external payable {
        Property storage prop = property[_propertyId];

        require(prop.isListed, "Property not listed");
        emit Debug("Passed: Property is listed", 0);

        require(!prop.returnRateFinalized, "Return rate already finalized");
        emit Debug("Passed: Return rate not finalized", 0);

        require(msg.value > 0, "Invalid investment amount");
        emit Debug("Passed: Investment amount is valid", msg.value);

        require(_proposedReturnRate > 0, "Invalid return rate");
        emit Debug("Passed: Return rate is valid", _proposedReturnRate);

        uint256 tokenAmount = (msg.value * prop.totalTokens) / prop.totalValue;
        require(tokenAmount > 0, "Investment too small");

        Investment storage investment = investments[msg.sender][_propertyId];
        if (!investment.exists) {
            investments[msg.sender][_propertyId] = Investment({
                tokenAmount: tokenAmount,
                investmentAmount: msg.value, // Correctly use msg.value
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
            investment.investmentAmount += msg.value; // Correctly use msg.value
        }

        prop.totalInvestedTokens += tokenAmount;
        updateWeightedReturnRate(_propertyId, tokenAmount, _proposedReturnRate);

        _mint(msg.sender, tokenAmount);

        emit InvestmentMade(
            _propertyId,
            msg.sender,
            tokenAmount,
            msg.value,
            _proposedReturnRate
        );
    }

    /**
     * @dev Updates the weighted return rate for a property based on new investment
     * @param _propertyId The ID of the property
     * @param _tokenAmount The amount of tokens invested
     * @param _proposedRate The proposed return rate
     */
    function updateWeightedReturnRate(
        uint256 _propertyId,
        uint256 _tokenAmount,
        uint256 _proposedRate
    ) internal {
        Property storage prop = property[_propertyId];
        uint256 weightedVote = _tokenAmount * _proposedRate;
        totalWeightedVotes[_propertyId] += weightedVote;

        prop.finalReturnRate =
            totalWeightedVotes[_propertyId] /
            prop.totalInvestedTokens;

        if (prop.totalInvestedTokens == prop.totalTokens) {
            prop.returnRateFinalized = true;
            prop.resalePrice = calculateResalePrice(_propertyId);
            prop.forSale = true;
            propertiesOnSale.push(_propertyId);

            (bool success, ) = payable(prop.owner).call{value: prop.totalValue}(
                ""
            );
            require(success, "Transfer failed.");

            // // Set the contract as the new owner of the property
            // prop.owner = address(this);
            emit ReturnRateFinalized(_propertyId, prop.finalReturnRate);
        }
    }

    /**
     * @dev Calculates the resale price for a property based on return rate
     * @param _propertyId The ID of the property
     * @return The calculated resale price
     */
    function calculateResalePrice(
        uint256 _propertyId
    ) internal view returns (uint256) {
        Property storage prop = property[_propertyId];
        uint256 returnAmount = (prop.totalValue * prop.finalReturnRate) / 100;
        return prop.totalValue + returnAmount;
    }

    /**
     * @dev Gets detailed information about a property that is on sale
     * @return PropertyOnSaleDetails struct containing property details
     */
    function getPropertiesOnSale()
        external
        view
        returns (PropertyOnSaleDetails[] memory)
    {
        PropertyOnSaleDetails[]
            memory propertiesOnSaleDetails = new PropertyOnSaleDetails[](
                propertiesOnSale.length
            );
        for (uint256 i = 0; i < propertiesOnSale.length; i++) {
            Property storage prop = property[propertiesOnSale[i]];
            propertiesOnSaleDetails[i] = PropertyOnSaleDetails({
                owner: prop.owner,
                totalValue: prop.totalValue,
                resalePrice: prop.resalePrice,
                finalReturnRate: prop.finalReturnRate
            });
        }
        return propertiesOnSaleDetails;
    }

    /**
     * @dev Retrieves all investments made by a user across all properties.
     * @param _investor The address of the investor.
     * @return An array of Investment details and an array of property IDs associated with those investments.
     */
    function getUserInvestments(
        address _investor
    ) external view returns (Investment[] memory, uint256[] memory) {
        uint256 totalProperties = allPropertyIds.length;
        uint256 investmentCount = 0;

        // First pass: Count the number of investments
        for (uint256 i = 0; i < totalProperties; i++) {
            if (investments[_investor][allPropertyIds[i]].exists) {
                investmentCount++;
            }
        }

        // Allocate arrays for investments and property IDs
        Investment[] memory userInvestments = new Investment[](investmentCount);
        uint256[] memory propertyIds = new uint256[](investmentCount);

        // Second pass: Populate the arrays
        uint256 index = 0;
        for (uint256 i = 0; i < totalProperties; i++) {
            uint256 propertyId = allPropertyIds[i];
            if (investments[_investor][propertyId].exists) {
                userInvestments[index] = investments[_investor][propertyId];
                propertyIds[index] = propertyId;
                index++;
            }
        }

        return (userInvestments, propertyIds);
    }

    /**
     * @dev Allows token holders to burn their tokens and receive their share of property value
     * @param _propertyId The ID of the property
     * @param _amount The amount of tokens to burn
     */
    function burnTokensFromProperty(
        uint256 _propertyId,
        uint256 _amount
    ) external {
        Property storage prop = property[_propertyId];
        require(prop.returnRateFinalized, "Return rate not finalized");
        require(prop.forSale, "Property not for sale");

        Investment storage investment = investments[msg.sender][_propertyId];
        require(
            investment.exists && investment.tokenAmount >= _amount,
            "Insufficient tokens"
        );
        require(burnLimits[_propertyId] >= _amount, "Burn limit exceeded");

        uint256 shareOfResale = (prop.resalePrice * _amount) / prop.totalTokens;
        require(
            propertyLiquidity[_propertyId] >= shareOfResale,
            "Insufficient liquidity"
        );

        investment.tokenAmount -= _amount;
        burnLimits[_propertyId] -= _amount;
        propertyLiquidity[_propertyId] -= shareOfResale;

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(shareOfResale);

        emit TokensBurned(msg.sender, _propertyId, _amount, shareOfResale);
    }
}
