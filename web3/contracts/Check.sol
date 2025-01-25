// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title PropertyToken
 * @dev A smart contract for tokenizing real estate properties and managing investments
 * The contract allows property owners to list their properties and investors to purchase tokens
 * representing ownership shares. It includes features for return rate voting and property resale.
 */
contract Check is ERC20, Ownable {
    // Data Feed
    AggregatorV3Interface internal dataFeed;

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
        uint256 id;
    }

    struct ListingInfo {
        uint256 propertyId;
        uint256 tokenPrice;
    }

    struct InvestmentInfo {
        uint256 propertyId;
        uint256 investmentAmount;
        uint256 proposedRate;
        uint256 actualRate;
        uint256 tokenPrice;
        uint256 hikedPrice;
        bool forSale;
    }

    // Platform fee percentage (2%)
    uint256 public constant PLATFORM_FEE = 5;
    // Conversion rate between AVAX and PROP (NOT YET IMPLEMENTED)
    uint256 public constant ONE_PROP_IN_AVAX = 1;

    // Will Update
    uint256 public constant ONE_AVAX_IN_PROP = 1000;

    // Mapping to store properties
    mapping(uint256 => Property) public property;
    // Property ID counter
    uint256 private propertyCounter;
    // Mapping of property investments per address
    mapping(address => mapping(uint256 => Investment)) public investments;
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
    event PropertyBought(uint256 propertyId, address newOwner, uint256 price);

    constructor() ERC20("Property Token", "PROP") Ownable(msg.sender) {
        dataFeed = AggregatorV3Interface(
            0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
        );
    }

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

            uint256 profit = prop.resalePrice - prop.totalValue;
            uint256 fee = (profit * PLATFORM_FEE) / 100;

            prop.resalePrice = prop.resalePrice + fee;

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
        uint256 totalProperties = allPropertyIds.length; // Total properties in the system
        uint256 saleCount = 0;

        // First pass: Count the number of properties for sale
        for (uint256 i = 0; i < totalProperties; i++) {
            if (property[i].forSale) {
                saleCount++;
            }
        }

        // Create a fixed-size array for properties on sale
        PropertyOnSaleDetails[]
            memory propertiesOnSaleList = new PropertyOnSaleDetails[](
                saleCount
            );
        uint256 currentIndex = 0;

        // Second pass: Populate the array with properties for sale
        for (uint256 i = 0; i < totalProperties; i++) {
            if (property[i].forSale) {
                Property storage prop = property[i];
                propertiesOnSaleList[currentIndex] = PropertyOnSaleDetails({
                    owner: prop.owner,
                    totalValue: prop.totalValue,
                    resalePrice: prop.resalePrice,
                    finalReturnRate: prop.finalReturnRate,
                    id: i
                });
                currentIndex++;
            }
        }

        return propertiesOnSaleList;
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
     * @dev Allows a user to buy a property by paying the resale price in AVAX.
     * Transfers ownership to the buyer and marks the property as not for sale.
     * @param _propertyId The ID of the property to buy.
     */
    function buyProperty(uint256 _propertyId) external payable {
        Property storage prop = property[_propertyId];

        // Ensure the property exists and is for sale
        require(prop.forSale, "Property is not for sale");
        require(prop.resalePrice > 0, "Invalid resale price");

        // Ensure the buyer sends the exact resale price
        require(msg.value == prop.resalePrice, "Incorrect AVAX amount sent");

        // Transfer funds to the contract (this happens implicitly with msg.value)

        propertyLiquidity[_propertyId] = msg.value;

        // Transfer ownership to the buyer
        prop.owner = msg.sender;

        // Mark the property as no longer for sale
        prop.forSale = false;

        // Emit an event for the purchase
        emit PropertyBought(_propertyId, msg.sender, prop.resalePrice);
    }

    /**
     * @dev Allows token holders to burn their tokens and receive their share of property value
     * @param _propertyId The ID of the property
     */
    function burnTokensFromProperty(uint256 _propertyId) external {
        Property storage prop = property[_propertyId];
        require(prop.returnRateFinalized, "Return rate not finalized");

        Investment storage investment = investments[msg.sender][_propertyId];
        require(investment.exists, "No investment found");
        require(investment.tokenAmount > 0, "No tokens to burn");

        // Calculate original investment amount plus return
        uint256 originalInvestment = investment.investmentAmount;
        uint256 returnAmount = (originalInvestment * prop.finalReturnRate) /
            100;
        uint256 totalDue = originalInvestment + returnAmount;

        require(
            propertyLiquidity[_propertyId] >= totalDue,
            "Insufficient liquidity"
        );

        // Store token amount to burn
        uint256 tokensToBurn = investment.tokenAmount;

        // Clear investment record
        delete investments[msg.sender][_propertyId];

        // Update property liquidity
        propertyLiquidity[_propertyId] -= totalDue;

        // Burn tokens and transfer ETH
        _burn(msg.sender, tokensToBurn);

        (bool success, ) = payable(msg.sender).call{value: totalDue}("");
        require(success, "ETH transfer failed");

        emit TokensBurned(msg.sender, _propertyId, tokensToBurn, totalDue);
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    /**
     * @dev Retrieves overall statistics for a given wallet address
     * @param _wallet Address to get stats for
     * @return multiplier Current AVAX to USD multiplier
     * @return totalListings Number of properties listed by this wallet
     * @return totalSpentAVAX Total AVAX spent on investments
     */
    function getDashboardStats(
        address _wallet
    )
        external
        view
        returns (int multiplier, uint256 totalListings, uint256 totalSpentAVAX)
    {
        // Count listings and accumulate investments
        for (uint256 i = 0; i < allPropertyIds.length; i++) {
            uint256 propertyId = allPropertyIds[i];
            Property storage prop = property[propertyId];

            // Count if this wallet is the property owner
            if (prop.owner == _wallet) {
                totalListings++;
            }

            // Add up investments if they exist
            Investment storage investment = investments[_wallet][propertyId];
            if (investment.exists) {
                totalSpentAVAX += investment.investmentAmount;
            }
        }
        multiplier = getChainlinkDataFeedLatestAnswer();
        return (multiplier, totalListings, totalSpentAVAX);
    }

    /**
     * @dev Gets all active listings for a specific wallet
     * @param _wallet Address to get listings for
     * @return Array of ListingInfo structs containing property details
     */
    function getWalletListings(
        address _wallet
    ) external view returns (ListingInfo[] memory) {
        // First pass: count active listings
        uint256 activeListingCount = 0;
        for (uint256 i = 0; i < allPropertyIds.length; i++) {
            uint256 propertyId = allPropertyIds[i];
            Property storage prop = property[propertyId];
            if (prop.owner == _wallet && prop.isListed) {
                activeListingCount++;
            }
        }

        // Initialize return array with correct size
        ListingInfo[] memory listings = new ListingInfo[](activeListingCount);

        // Second pass: populate array
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < allPropertyIds.length; i++) {
            uint256 propertyId = allPropertyIds[i];
            Property storage prop = property[propertyId];
            if (prop.owner == _wallet && prop.isListed) {
                // Calculate token price: totalValue / totalTokens
                uint256 tokenPrice = (prop.totalValue * ONE_PROP_IN_AVAX) /
                    prop.totalTokens;

                listings[currentIndex] = ListingInfo({
                    propertyId: propertyId,
                    tokenPrice: tokenPrice
                });
                currentIndex++;
            }
        }

        return listings;
    }

    /**
     * @dev Gets all investments made by a specific wallet
     * @param _wallet Address to get investments for
     * @return Array of InvestmentInfo structs containing investment details
     */
    function getWalletInvestments(
        address _wallet
    ) external view returns (InvestmentInfo[] memory) {
        // First pass: count investments
        uint256 investmentCount = 0;
        for (uint256 i = 0; i < allPropertyIds.length; i++) {
            if (investments[_wallet][allPropertyIds[i]].exists) {
                investmentCount++;
            }
        }

        // Initialize return array
        InvestmentInfo[] memory investmentInfos = new InvestmentInfo[](
            investmentCount
        );

        // Second pass: populate array
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < allPropertyIds.length; i++) {
            uint256 propertyId = allPropertyIds[i];
            Investment storage investment = investments[_wallet][propertyId];

            if (investment.exists) {
                Property storage prop = property[propertyId];
                uint256 tokenPrice = (prop.totalValue * ONE_PROP_IN_AVAX) /
                    prop.totalTokens;

                // Find the hiked price from properties on sale
                uint256 hikedPrice = 0;
                for (uint256 j = 0; j < propertiesOnSale.length; j++) {
                    if (propertiesOnSale[j] == propertyId) {
                        hikedPrice = prop.resalePrice;
                        break;
                    }
                }

                investmentInfos[currentIndex] = InvestmentInfo({
                    propertyId: propertyId,
                    investmentAmount: investment.investmentAmount,
                    proposedRate: investment.proposedReturnRate,
                    actualRate: prop.returnRateFinalized
                        ? prop.finalReturnRate
                        : 0,
                    tokenPrice: tokenPrice,
                    hikedPrice: hikedPrice,
                    forSale: prop.forSale
                });
                currentIndex++;
            }
        }

        return investmentInfos;
    }
}
