// src/pages/VotePage.js
import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { contractAddress, contractABI } from "../contract.js";
import { AppContext } from "../context/AppContext.jsx";

const VotePage = () => {
  const [electionId, setElectionId] = useState(2);
  const [candidateId, setCandidateId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [gas, setGas] = useState(0);
  const { account } = useContext(AppContext);

  const contractAddress = "0x1e78ff9407dd881f9ab17320Afc15A49d626ae00";
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractABI, contractAddress, {
    handleRevert: true,
  });
  // const estGas = async () => {
  //   const estimatedGas = await contract.methods
  //     .vote()
  //     .estimateGas({ from: account });

  //   setGas(estimatedGas);
  //   console.log(estimatedGas);
  // };

  // useEffect(() => {
  //   estGas();
  // }, []);
  useEffect(() => {
    if (electionId) {
      loadCandidates();
    }
  }, [electionId]);

  const loadCandidates = async () => {
    try {
      // const accounts = await web3.eth.requestAccounts();
      // const estimatedGas = await contract.methods
      //   .vote(1,2)
      //   .estimateGas({ from: accounts[0] });

      // setGas(estimatedGas);
      const candidateCount = await contract.methods
        .getCandidates(electionId)
        .call();

      // const candidateList = [];
      // for (let i = 1; i <= candidateCount; i++) {
      //   const candidate = await contract.methods.getCandidate(electionId, i).call();
      //   candidateList.push(candidate);
      // }

      setCandidates(candidateCount);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  };

  const voteForCandidate = async () => {
    let OK = true;
    try {
      // const accounts = await web3.eth.requestAccounts();
      // const estimatedGas = await contract.methods
      //   .vote(electionId, candidateId)
      //   .estimateGas({
      //     from: accounts[0],
      //   });
      await contract.methods
        .vote(electionId, candidateId)
        .call({ from: account, gas: 30000 });
      alert("Your vote has been cast!");
    } catch (e) {
      OK = false;
      console.log(e);
      console.log(e.data);
      const data = e.data;
      // const txHash = Object.keys(data)[0]; // TODO improve
      // const reason = data[txHash].reason;

      console.log(e.data.message); // prints "This is error message"
      // alert("Failed to cast vote.");
    }
    if (OK) {
      try {
        await contract.methods
          .vote(electionId, candidateId)
          .send({ from: account, gas: 30000 });
        alert("Your vote has been cast!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <h2>Vote for a Candidate</h2>
      <input
        type="number"
        placeholder="Election ID"
        onChange={(e) => setElectionId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Candidate ID"
        onChange={(e) => setCandidateId(e.target.value)}
      />
      <button onClick={voteForCandidate}>Vote</button>

      <h3>Candidates:</h3>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>
            {candidate.name} (Votes: {candidate.voteCount})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotePage;
