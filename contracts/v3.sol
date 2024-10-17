// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingSystem is Ownable {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        string imageURL;
    }

    // Mappings
    mapping(address => bool) public isWhitelisted; // Track whitelisted addresses
    mapping(address => bool) public hasVoted;      // Track if an address has voted
    mapping(uint256 => Candidate) public candidates; // Track candidates by ID
    mapping(uint256 => address) public registrationToWallet; // Map registration numbers to wallet addresses

    // Counters and time variables
    uint256 public candidateCount;
    uint256 public voterCount;
    uint256 public votingStartTime;
    uint256 public votingEndTime;
    uint256 public whitelistStartTime;
    uint256 public whitelistEndTime;

    // Events
    event Whitelisted(address voter);
    event VoteCasted(address voter, uint256 candidateId);
    event CandidateAdded(uint256 candidateId, string name, string imageURL);

    // Constructor to initialize time periods
    constructor(
        uint256 _whitelistStartTime,
        uint256 _whitelistEndTime,
        uint256 _votingStartTime,
        uint256 _votingEndTime
    ) Ownable(msg.sender) {
        require(_whitelistStartTime < _whitelistEndTime, "Whitelist end time must be after start time");
        require(_votingStartTime < _votingEndTime, "Voting end time must be after start time");

        whitelistStartTime = _whitelistStartTime;
        whitelistEndTime = _whitelistEndTime;
        votingStartTime = _votingStartTime;
        votingEndTime = _votingEndTime;
    }

    // Modifiers
    modifier onlyDuringWhitelist() {
        require(block.timestamp >= whitelistStartTime && block.timestamp <= whitelistEndTime, "Whitelist period is closed");
        _;
    }

    modifier onlyDuringVoting() {
        require(block.timestamp >= votingStartTime && block.timestamp <= votingEndTime, "Voting period is closed");
        _;
    }

    modifier onlyWhitelisted() {
        require(isWhitelisted[msg.sender], "You are not whitelisted to vote");
        _;
    }

    // Whitelist function with registration number
    function whitelistUser(uint256 _registrationNumber) external onlyDuringWhitelist {
        require(!isWhitelisted[msg.sender], "User is already whitelisted");
        require(registrationToWallet[_registrationNumber] == address(0), "This registration number is already linked to a wallet");

        // Link registration number and whitelist the user
        registrationToWallet[_registrationNumber] = msg.sender;
        isWhitelisted[msg.sender] = true;
        voterCount++;

        emit Whitelisted(msg.sender);
    }

    // Voting function
    function vote(uint256 _candidateId) external onlyWhitelisted onlyDuringVoting {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");

        // Mark the voter as having voted and increment the vote count of the selected candidate
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount += 1;

        emit VoteCasted(msg.sender, _candidateId);
    }

    // Admin function to add candidates
    function addCandidate(string memory _name, string memory _imageURL) external onlyOwner {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0, _imageURL);
        emit CandidateAdded(candidateCount, _name, _imageURL);
    }

    // Function to get candidate information
    function getCandidate(uint256 _candidateId) external view returns (Candidate memory) {
        return candidates[_candidateId];
    }

    // Function to get all candidates
    function getCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory candidateArray = new Candidate[](candidateCount);
        for (uint256 i = 1; i <= candidateCount; i++) {
            candidateArray[i - 1] = candidates[i];
        }
        return candidateArray;
    }

    // Function to check if a registration number is linked to a wallet
    function getWalletForRegistration(uint256 _registrationNumber) public view returns (address) {
        return registrationToWallet[_registrationNumber];
    }

    // Function to get the total number of registered voters
    function getTotalRegisteredVoters() external view returns (uint256) {
        return voterCount; // Return the total registered voters count
    }
}
