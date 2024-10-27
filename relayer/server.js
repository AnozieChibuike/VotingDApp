// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const cors = require("cors");
const crypto = require("crypto");

// Initialize web3 and contract
const web3 = new Web3.Web3(process.env.INFURA_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "imageURL",
        type: "string",
      },
    ],
    name: "CandidateAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "serviceFee",
        type: "uint256",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "candidateCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voterCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "whitelistStartTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "whitelistEndTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votingStartTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votingEndTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "active",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "ElectionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "ElectionCreatorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "ElectionCreatorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
    ],
    name: "VoteCasted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "Whitelisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_imageURL",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
    ],
    name: "addElectionCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "imageURL",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_whitelistStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_whitelistEndTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_votingStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_votingEndTime",
        type: "uint256",
      },
    ],
    name: "createElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionID",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "deviceToWallet",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "electionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "electionIds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "elections",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "candidateCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voterCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "whitelistStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "whitelistEndTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "votingStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "votingEndTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "getCandidate",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "imageURL",
            type: "string",
          },
        ],
        internalType: "struct VotingSystem.Candidate",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getCandidates",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "imageURL",
            type: "string",
          },
        ],
        internalType: "struct VotingSystem.Candidate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
    ],
    name: "getElectionsByCreator",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "candidateCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "voterCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "whitelistStartTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "whitelistEndTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "votingStartTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "votingEndTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct VotingSystem.Election[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getGasReserve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getTotalRegisteredVoters",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_registrationNumber",
        type: "uint256",
      },
    ],
    name: "getWalletForRegistration",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isElectionCreator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isWhitelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "registrationToWallet",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
    ],
    name: "removeElectionCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "serviceFeePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_estimatedGas",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "deviceFingerprint",
        type: "string",
      },
      {
        internalType: "address",
        name: "_walletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_registrationNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_estimatedGas",
        type: "uint256",
      },
    ],
    name: "whitelistUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]; // Replace with your contract's ABI
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

// Initialize Express
const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Vote endpoint
app.post("/whitelist", async (req, res) => {
  const {
    deviceId,
    electionId,
    registrationNumber,
    userAddress,
    message,
    signature,
    gas,
  } = req.body;

  console.log(req.body)
  // console.log(req.body);
  // const nonce = await web3.eth.getTransactionCount(userAddress);

  // Verify the signature and recover the user's address
  //   const message = `I`;
  //   const messageHash = web3.utils.keccak256(message);
  //   const userAddress = web3.eth.accounts.recover(messageHash, signature);
  //   console.log(userAddress);

  // Optionally, validate the user address or perform additional checks here

  try {
    // Build the transaction
    const gasPrice = await web3.eth.getGasPrice();
    // const messageHash = web3.utils.sha3(message);
    const recoveredAddress = await web3.eth.accounts.recover(
      message,
      signature
    );

    // console.log(recoveredAddress);

    // Verify the recovered address matches the user's address
    if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return res
        .status(400)
        .json({ error: "Invalid signature or address mismatch" });
    }
    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.RELAYER_PRIVATE_KEY
    );
    const tx = {
      to: contractAddress,
      data: votingContract.methods
        .whitelistUser(
          deviceId,
          userAddress,
          electionId,
          registrationNumber,
          gas
        )
        .encodeABI(),
      // gas: 3000000,
      from: account.address,
      //   nonce: nonce,pppppp
      gasPrice,
      // Set an appropriate gas limit
    };

    // console.log("TX ", tx);

    // Sign the transaction with the relayer's private key

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      account.privateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    res.json({ success: true, transactionHash: receipt.transactionHash });
  } catch (error) {
    console.log(error);
    if (
      error.cause?.message ===
      "execution reverted: You are not authorized to create elections"
    ) {
      res.status(500).json({
        success: false,
        error: "You are not authorized to create elections",
      });
      return;
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/vote", async (req, res) => {
  const { gas, electionId, userAddress, message, signature, candidateId } =
    req.body;
  try {
    // Build the transaction
    const gasPrice = await web3.eth.getGasPrice();
    // const messageHash = web3.utils.sha3(message);
    const recoveredAddress = await web3.eth.accounts.recover(
      message,
      signature
    );

    // console.log(recoveredAddress);

    // Verify the recovered address matches the user's address
    if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return res
        .status(400)
        .json({ error: "Invalid signature or address mismatch" });
    }
    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.RELAYER_PRIVATE_KEY
    );
    const tx = {
      to: contractAddress,
      data: votingContract.methods
        .vote(userAddress, electionId, candidateId, gas)
        .encodeABI(),
      // gas: 3000000,
      from: account.address,
      //   nonce: nonce,pppppp
      gasPrice,
      // Set an appropriate gas limit
    };

    // console.log("TX ", tx);

    // Sign the transaction with the relayer's private key

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      account.privateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    res.json({ success: true, transactionHash: receipt.transactionHash });
  } catch (error) {
    console.log(error);
    if (
      error.cause.message ===
      "execution reverted: You are not authorized to create elections"
    ) {
      res.status(500).json({
        success: false,
        error: "You are not authorized to create elections",
      });
      return;
    }
    res.status(500).json({ success: false, error: error.cause.message });
  }
});

app.post("/store-face", (req, res) => {
  const { faceDescriptor } = req.body;

  // Convert faceDescriptor into a hash for secure storage
  const storedFaceDescriptor = hashFaceDescriptor(faceDescriptor);
  res.json({
    success: true,
    message: "Face data stored successfully",
    hashedFace: storedFaceDescriptor,
  });
});

function hashFaceDescriptor(faceDescriptor) {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(faceDescriptor));
  return hash.digest("hex");
}

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Relayer listening on port ${PORT}`);
});
