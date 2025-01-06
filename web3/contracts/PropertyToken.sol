// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PropertyToken is ERC20, Ownable, ReentrancyGuard {
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

    constructor() ERC20("Property Token", "PROP") {}

    function listProperty(uint256 _totalValue, uint256 _totalTokens) external {
        require(_totalValue > 0, "Invalid property value");
        require(_totalTokens > 0, "Invalid token amount");

        uint256 propertyId = propertyCounter++;

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

        emit PropertyListed(propertyId, msg.sender, _totalValue, _totalTokens);
    }

    function invest(
        uint256 _propertyId,
        uint256 _proposedReturnRate
    ) external payable nonReentrant {
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

        // Update or create investment
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
            // Update existing investment with weighted average of return rates
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

        // Update property stats
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

    function updateWeightedReturnRate(
        uint256 _propertyId,
        uint256 _tokenAmount,
        uint256 _proposedRate
    ) internal {
        Property storage property = properties[_propertyId];
        uint256 weightedVote = _tokenAmount * _proposedRate;
        totalWeightedVotes[_propertyId] += weightedVote;

        // Update final return rate based on weighted average
        property.finalReturnRate =
            totalWeightedVotes[_propertyId] /
            property.totalInvestedTokens;

        // Check if all tokens are invested and finalize return rate
        if (property.totalInvestedTokens == property.totalTokens) {
            property.returnRateFinalized = true;
            property.resalePrice = calculateResalePrice(_propertyId);
            emit ReturnRateFinalized(_propertyId, property.finalReturnRate);
        }
    }

    function calculateResalePrice(
        uint256 _propertyId
    ) internal view returns (uint256) {
        Property storage property = properties[_propertyId];
        uint256 returnAmount = (property.totalValue *
            property.finalReturnRate) / BASIS_POINTS;
        return property.totalValue + returnAmount;
    }

    function burnTokensFromProperty(
        uint256 _propertyId,
        uint256 _amount
    ) external nonReentrant {
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

        // Update state
        investment.tokenAmount -= _amount;
        burnLimits[_propertyId] -= _amount;
        propertyLiquidity[_propertyId] -= shareOfResale;

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(shareOfResale);

        emit TokensBurned(msg.sender, _propertyId, _amount, shareOfResale);
    }

    function listForResale(uint256 _propertyId) external {
        Property storage property = properties[_propertyId];
        require(msg.sender == property.owner, "Not property owner");
        require(property.returnRateFinalized, "Return rate not finalized");
        require(!property.forSale, "Already listed for resale");

        property.forSale = true;
        property.resalePrice = calculateResalePrice(_propertyId);
    }

    // View functions
    function getProperty(
        uint256 _propertyId
    )
        external
        view
        returns (
            bool isListed,
            uint256 totalValue,
            uint256 totalTokens,
            uint256 totalInvestedTokens,
            uint256 finalReturnRate,
            bool returnRateFinalized,
            uint256 resalePrice,
            bool forSale
        )
    {
        Property storage property = properties[_propertyId];
        return (
            property.isListed,
            property.totalValue,
            property.totalTokens,
            property.totalInvestedTokens,
            property.finalReturnRate,
            property.returnRateFinalized,
            property.resalePrice,
            property.forSale
        );
    }

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
