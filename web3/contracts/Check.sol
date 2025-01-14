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
}
