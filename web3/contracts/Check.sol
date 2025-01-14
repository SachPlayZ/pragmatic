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
    uint256 public constant BASIS_POINTS = 300;
    uint256 public constant ONE_PROP_IN_AVAX = 1;

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

    constructor() ERC20("Property Token", "PROP") Ownable(msg.sender) {}

    /**
     * @dev Lists a new property for tokenization
     * @param _totalValue The total value of the property in wei
     */
    function listProperty(uint256 _totalValue) external {
        require(_totalValue > 0, "Invalid property value");

        uint _totalTokens = _totalValue / ONE_PROP_IN_AVAX;

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

    /**
     * @dev Gets all properties that have been listed
     * @return An array of property IDs
     */
    function getAllListings() external view returns (uint256[] memory) {
        return allPropertyIds;
    }

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
        Property storage _property = property[_propertyId];
        require(_property.isListed, "Property not listed");

        return (
            _property.owner,
            _property.totalValue,
            _property.totalTokens,
            _property.isListed,
            _property.rentalIncome,
            _property.resalePrice,
            _property.forSale
        );
    }
}
