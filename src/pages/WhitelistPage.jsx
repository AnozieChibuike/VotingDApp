// src/pages/WhitelistPage.js
import React, { useState } from "react";
import Web3 from "web3";
import { contractAddress, contractABI } from "../contract.js";

const WhitelistPage = () => {
  const [electionId, setElectionId] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const contractAddress = "0xad3F61A214bf4f9B25b94191CA516B9B9e1589b3";

  const whitelistUser = async () => {
    let OK = true;
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const accounts = await web3.eth.requestAccounts();

      await contract.methods
        .whitelistUser(electionId, registrationNumber)
        .call({ from: accounts[0], gas: 30000 });
      // await contract.methods
      //   .whitelistUser(electionId, registrationNumber)
      //   .send({ from: accounts[0], gas: 30000 });

      alert("You have been whitelisted for the election!");
    } catch (e) {
      OK = false;
      console.log(e);
      console.log(e.data);
      const data = e.data;
    }
    if (OK) {
      try {
        await contract.methods
          .whitelistUser(electionId, registrationNumber)
          .send({ from: accounts[0], gas: 30000 });
      } catch (e) {}
    }
  };

  return (
    <div>
      <h2>Whitelist for Election</h2>
      <input
        type="number"
        placeholder="Election ID"
        onChange={(e) => setElectionId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Registration Number"
        onChange={(e) => setRegistrationNumber(e.target.value)}
      />
      <button onClick={whitelistUser}>Whitelist Me</button>
    </div>
  );
};

export default WhitelistPage;
