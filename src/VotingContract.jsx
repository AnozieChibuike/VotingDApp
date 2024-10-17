import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Web3 from "web3";

const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_imageUrl",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "endVoting",
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
    ],
    name: "registerVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "CandidateAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
    ],
    name: "Voted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "VoterRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "VotingEnded",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
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
    name: "getAllCandidates",
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
            internalType: "string",
            name: "imageUrl",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Candidate[]",
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
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "getCandidate",
    outputs: [
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
    name: "registeredVoters",
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
    name: "totalCandidates",
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
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "voted",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "vote",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingEndTime",
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
    inputs: [],
    name: "votingOpen",
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
    name: "votingStartTime",
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
];
const contractAddress = "0x3cf9a25e29bb1a63cdcb87764cd7a15f1608f0b2";
const MINATO_CHAIN_ID = "0x79A"; // Replace with the actual Minato chain ID
const MINATO_RPC_URL = "https://rpc.minato.soneium.org"; // Replace with the Minato RPC URL
const MINATO_EXPLORER_URL = "https://explorer-testnet.soneium.org"; // Replace with Minato Explorer URL

function VotingContract() {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState(false);
  const [deleteBtn, showDel] = useState(false);
  useEffect(() => {
    // Load Web3, account, and contract details
    if (candidates.length > 0) console.log(Number(BigInt(candidates[1]?.id)));
    // console.log(BigInt("1n"))
    // loadWeb3();
  }, [candidates]);

  // async function switchToMinato() {
  //   if (window.ethereum) {
  //     try {
  //       // Request account access if needed
  //       await window.ethereum.request({ method: "eth_requestAccounts" });

  //       // Check current chain ID
  //       const web3 = new Web3(window.ethereum);
  //       const chainId = await web3.eth.getChainId();

  //       // If not connected to Minato Testnet, prompt to switch
  //       if (chainId !== parseInt(MINATO_CHAIN_ID, 16)) {
  //         try {
  //           // Prompt MetaMask to switch to Minato Testnet
  //           await window.ethereum.request({
  //             method: "wallet_switchEthereumChain",
  //             params: [{ chainId: MINATO_CHAIN_ID }], // Minato Testnet Chain ID
  //           });
  //           console.log("Switched to Minato Testnet!");
  //         } catch (error) {
  //           // If the chain is not added to MetaMask, add it
  //           if (error.code === 4902) {
  //             try {
  //               await window.ethereum.request({
  //                 method: "wallet_addEthereumChain",
  //                 params: [
  //                   {
  //                     chainId: MINATO_CHAIN_ID,
  //                     chainName: "Minato Testnet",
  //                     rpcUrls: [MINATO_RPC_URL],
  //                     nativeCurrency: {
  //                       name: "ETH",
  //                       symbol: "ETH",
  //                       decimals: 18,
  //                     },
  //                     blockExplorerUrls: [MINATO_EXPLORER_URL],
  //                   },
  //                 ],
  //               });
  //               console.log("Minato Testnet added and switched!");
  //             } catch (addError) {
  //               console.error("Failed to add Minato Testnet", addError);
  //             }
  //           } else {
  //             console.error("Failed to switch to Minato Testnet", error);
  //           }
  //         }
  //       } else {
  //         console.log("Already connected to Minato Testnet");
  //       }
  //     } catch (err) {
  //       console.error("User denied account access", err);
  //     }
  //   } else {
  //     console.log("MetaMask is not installed!");
  //   }
  // }

  async function loadWeb3() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const chainId = await web3.eth.getChainId();
        console.log(chainId);
        if (chainId !== parseInt(MINATO_CHAIN_ID, 16)) {
          try {
            // Prompt MetaMask to switch to Minato Testnet
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: MINATO_CHAIN_ID }], // Minato Testnet Chain ID
            });
            console.log("Switched to Minato Testnet!");
          } catch (error) {
            // If the chain is not added to MetaMask, add it
            if (error.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: MINATO_CHAIN_ID,
                      chainName: "Minato Testnet",
                      rpcUrls: [MINATO_RPC_URL],
                      nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      blockExplorerUrls: [MINATO_EXPLORER_URL],
                    },
                  ],
                });
                console.log("Minato Testnet added and switched!");
              } catch (addError) {
                console.error("Failed to add Minato Testnet", addError);
              }
            } else {
              console.error("Failed to switch to Minato Testnet", error);
            }
          }
        }
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        // Load contract
        const votingContract = new web3.eth.Contract(
          contractABI,
          contractAddress
        );
        console.log(votingContract);
        setWeb3(web3);
        setContract(votingContract);
        checkVotingStatus(votingContract);
        loadCandidates(votingContract);
      } catch (error) {
        console.error("Error connecting to Web3:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  // Check if voting is active
  const checkVotingStatus = async (contract) => {
    const isVotingOpen = await contract.methods.votingOpen().call();
    setVotingStatus(isVotingOpen);
  };

  // Load all candidates
  const loadCandidates = async (contract) => {
    const candidatesArray = await contract.methods.getAllCandidates().call();
    // console.log(candidates[1]);
    setCandidates(candidatesArray);
  };

  const voterRegistered = async (contract) => {
    const t = await contract.methods.votingOpen().call();
  };

  // Cast vote
  const castVote = async (candidateId) => {
    try {
      await contract.methods.vote(candidateId).send({ from: account });
      alert(`You have successfully voted for candidate ${candidateId}`);
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote.");
    }
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "7px",
          right: "7px",
        }}
      >
        {!account ? (
          <button onClick={loadWeb3}>Connect Account</button>
        ) : (
          <div className="accBtn">
            <span
              onClick={() => {
                showDel(!deleteBtn);
              }}
            >
              {account.slice(0, 4) + "***" + account.slice(-4)}
            </span>
            <button
              style={{
                display: !deleteBtn ? "none" : "block",
              }}
              className="del"
              onClick={() => setAccount(null)}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
      <h1>Voting DApp</h1>
      {/* <p>
        <strong>Connected Account:</strong> {account}
      </p> */}
      <p>
        <strong>Voting Status:</strong> {votingStatus ? "Open" : "Closed"}
      </p>

      <h2>Candidates</h2>
      <ul>
        {candidates.length > 0 ? (
          candidates.map((candidate, index) => (
            <div key={index} className="grid">
              <div className="grid2">
                <div className="imgFather">
                  <img src={candidate.imageUrl} alt="image" />
                </div>
                <p>
                  <strong>{candidate.name}</strong> - Votes:{" "}
                  {Number(candidate.voteCount)}
                </p>
                <button
                  onClick={() => castVote(Number(candidate.id))}
                  disabled={!votingStatus}
                >
                  Vote
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No candidates available</p>
        )}
      </ul>
    </div>
  );
}

export default VotingContract;
