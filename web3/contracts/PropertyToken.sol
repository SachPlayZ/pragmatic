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
contract PropertyToken is ERC20, Ownable {
    struct Property {
        address owner;
        uint256 totalValue;
        uint256 totalTokens;
        bool isListed;
        uint256 rentalIncome;
        uint256 resalePrice;
        bool forSale;
        uint256 finalReturnRate; // Weighted average return rate
        uint256 totalInvestedTokens; // Track total tokens invested
        bool returnRateFinalized; // Whether return rate voting is complete
    }

    struct Investment {
        uint256 tokenAmount;
        uint256 investmentAmount;
        uint256 proposedReturnRate; // Investor's proposed return rate
        bool hasVoted; // Track if investor has voted on return rate
        bool exists;
    }

    // Platform fee percentage (2%)
    uint256 public constant PLATFORM_FEE = 2;
    uint256 public constant BASIS_POINTS = 10000;

    // Mapping to store properties
    mapping(uint256 => Property) public properties;
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
     * @param _totalTokens The total number of tokens to be issued for the property
     */
    function listProperty(uint256 _totalValue, uint256 _totalTokens) external {
        require(_totalValue > 0, "Invalid property value");
        require(_totalTokens > 0, "Invalid token amount");

        uint256 propertyId = ++propertyCounter;

        properties[propertyId] = Property({
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

    /**
     * @dev Allows users to invest in a property and propose a return rate
     * @param _propertyId The ID of the property to invest in
     * @param _proposedReturnRate The proposed return rate in basis points
     */
    function invest(
        uint256 _propertyId,
        uint256 _proposedReturnRate
    ) external payable {
        Property storage property = properties[_propertyId];
        require(property.isListed, "Property not listed");
        require(!property.returnRateFinalized, "Return rate already finalized");
        require(msg.value > 0, "Invalid investment amount");
        require(
            _proposedReturnRate > 0 && _proposedReturnRate <= BASIS_POINTS,
            "Invalid return rate"
        );

        uint256 tokenAmount = (msg.value * property.totalTokens) /
            property.totalValue;
        require(tokenAmount > 0, "Investment too small");
        require(
            property.totalInvestedTokens + tokenAmount <= property.totalTokens,
            "Exceeds available tokens"
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

        property.totalInvestedTokens += tokenAmount;
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
        Property storage property = properties[_propertyId];
        uint256 weightedVote = _tokenAmount * _proposedRate;
        totalWeightedVotes[_propertyId] += weightedVote;

        property.finalReturnRate =
            totalWeightedVotes[_propertyId] /
            property.totalInvestedTokens;

        if (property.totalInvestedTokens == property.totalTokens) {
            property.returnRateFinalized = true;
            property.resalePrice = calculateResalePrice(_propertyId);
            emit ReturnRateFinalized(_propertyId, property.finalReturnRate);
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
        Property storage property = properties[_propertyId];
        uint256 returnAmount = (property.totalValue *
            property.finalReturnRate) / BASIS_POINTS;
        return property.totalValue + returnAmount;
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
        Property storage property = properties[_propertyId];
        require(property.returnRateFinalized, "Return rate not finalized");
        require(property.forSale, "Property not for sale");

        Investment storage investment = investments[msg.sender][_propertyId];
        require(
            investment.exists && investment.tokenAmount >= _amount,
            "Insufficient tokens"
        );
        require(burnLimits[_propertyId] >= _amount, "Burn limit exceeded");

        uint256 shareOfResale = (property.resalePrice * _amount) /
            property.totalTokens;
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

    /**
     * @dev Lists a property for resale
     * @param _propertyId The ID of the property to list for resale
     */
    function listForResale(uint256 _propertyId) external {
        Property storage property = properties[_propertyId];
        require(msg.sender == property.owner, "Not property owner");
        require(property.returnRateFinalized, "Return rate not finalized");
        require(!property.forSale, "Already listed for resale");

        property.forSale = true;
        property.resalePrice = calculateResalePrice(_propertyId);
        propertiesOnSale.push(_propertyId);
    }

    /**
     * @dev Gets all properties that have been listed
     * @return An array of property IDs
     */
    function getAllListings() external view returns (uint256[] memory) {
        return allPropertyIds;
    }

    /**
     * @dev Gets all properties that are currently on sale
     * @return An array of property IDs
     */
    function getAllPropertiesOnSale() external view returns (uint256[] memory) {
        return propertiesOnSale;
    }

    /**
     * @dev Gets detailed information about a specific listing
     * @param _propertyId The ID of the property
     * @return owner The address of the property owner
     * @return totalValue The total value of the property
     * @return totalTokens The total number of tokens issued
     * @return isListed Whether the property is listed
     * @return rentalIncome The rental income generated
     * @return resalePrice The resale price if listed for resale
     * @return forSale Whether the property is for sale
     */
    function getListingById(
        uint256 _propertyId
    )
        external
        view
        returns (
            address owner,
            uint256 totalValue,
            uint256 totalTokens,
            bool isListed,
            uint256 rentalIncome,
            uint256 resalePrice,
            bool forSale
        )
    {
        Property storage property = properties[_propertyId];
        require(property.isListed, "Property not listed");

        return (
            property.owner,
            property.totalValue,
            property.totalTokens,
            property.isListed,
            property.rentalIncome,
            property.resalePrice,
            property.forSale
        );
    }

    /**
     * @dev Gets detailed information about a property that is on sale
     * @param _propertyId The ID of the property
     * @return owner The address of the property owner
     * @return totalValue The total value of the property
     * @return resalePrice The resale price
     * @return finalReturnRate The finalized return rate
     * @return availableLiquidity The available liquidity for token burns
     */
    function getPropertyOnSaleById(
        uint256 _propertyId
    )
        external
        view
        returns (
            address owner,
            uint256 totalValue,
            uint256 resalePrice,
            uint256 finalReturnRate,
            uint256 availableLiquidity
        )
    {
        Property storage property = properties[_propertyId];
        require(property.forSale, "Property not for sale");

        return (
            property.owner,
            property.totalValue,
            property.resalePrice,
            property.finalReturnRate,
            propertyLiquidity[_propertyId]
        );
    }

    /**
     * @dev Gets investment details for a specific property and investor
     * @param _investor The address of the investor
     * @param _propertyId The ID of the property
     * @return tokenAmount The amount of tokens owned
     * @return investmentAmount The amount invested in wei
     * @return proposedReturnRate The return rate proposed by the investor
     * @return hasVoted Whether the investor has voted on the return rate
     * @return exists Whether the investment exists
     */
    function getInvestmentDetails(
        address _investor,
        uint256 _propertyId
    )
        external
        view
        returns (
            uint256 tokenAmount,
            uint256 investmentAmount,
            uint256 proposedReturnRate,
            bool hasVoted,
            bool exists
        )
    {
        Investment storage investment = investments[_investor][_propertyId];
        return (
            investment.tokenAmount,
            investment.investmentAmount,
            investment.proposedReturnRate,
            investment.hasVoted,
            investment.exists
        );
    }
}
