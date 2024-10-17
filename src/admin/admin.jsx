// import React, { useContext, useEffect } from "react";
// import WalletButton from "../components/WalletButton";
// import { MdDeleteForever } from "react-icons/md";
// import Header from "../components/header";
// import { AppContext } from "../context/AppContext";
// import DatePicker from "../components/datePicker";
// import dayjs from "dayjs";
// import contractAddress from "../helper/checkContract";
// import CandidateCard from "../components/candidateCard";
// import { FaPlus } from "react-icons/fa";
// import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
// import { Carousel } from "flowbite-react";
// // import { useTheme } from '@mui/material/styles';

// // const theme = useTheme();

// function Admin() {
//   const { account, setAccount } = useContext(AppContext);
//   console.log(contractAddress);
//   return (
//     <div>
//       <Header />
//       {account ? (
//         !contractAddress ? (
//           <CandidateMgnt />
//         ) : (
//           <Deploy />
//         )
//       ) : (
//         <p>Connect your wallet to create new Election</p>
//       )}
//     </div>
//   );
// }

// function Deploy() {
//   const [date, setDates] = React.useState({
//     voteStart: null,
//     voteEnd: null,
//     RegistrationStart: null,
//     ResgistrationEnd: null,
//   });
//   const updateDate = (dat, item) => {
//     const newDate = { ...date };
//     newDate[item] = dat;
//     console.log("p", newDate);

//     setDates(newDate);
//   };
//   return (
//     <>
//       <div className="dark:bg-[#363434] bg-[#bababa] rounded-lg p-3">
//         <h1 className="text-center font-semibold font-mono">Deploy Election</h1>
//         <div>
//           <h1 className="font-semibold font-mono mt-5">Set Voting time:</h1>
//           <DatePicker
//             changeValue={(e) => updateDate(e, "voteStart")}
//             label={"Voting Start Time"}
//             value={date.voteStart}
//           />
//           <DatePicker
//             changeValue={(e) => updateDate(e, "voteEnd")}
//             label={"Voting End Time"}
//             value={date.voteEnd}
//             disabled={!date.voteStart}
//             minDate={date.voteStart}
//           />
//           <h1 className="font-semibold font-mono mt-5">
//             Set Voter registration deadline:
//           </h1>
//           <DatePicker
//             changeValue={(e) => updateDate(e, "RegistrationStart")}
//             label={"Registration Start Time"}
//             value={date.RegistrationStart}
//           />
//           <DatePicker
//             changeValue={(e) => updateDate(e, "RegistrationEnd")}
//             label={"Registration End Time"}
//             value={date.RegistrationEnd}
//             disabled={!date.RegistrationStart}
//             minDate={date.RegistrationStart}
//           />
//         </div>
//         <div className="p-3 bg-blue-700 text-white rounded-lg my-5">
//           <p className="text-center">Deploy Contract</p>
//         </div>
//       </div>
//     </>
//   );
// }

// function CandidateMgnt() {
//   const [openModal, setOpenModal] = React.useState(false);
//   const [name, setName] = React.useState("");
//   const [imageUrl, setImageUrl] = React.useState("");

//   function onCloseModal() {
//     setOpenModal(false);
//     setName("");
//     setImageUrl("");
//   }
//   return (
//     <div className="flex flex-col">
//       <h1 className="text-center font-semibold font-mono">Candidates</h1>
//       <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 mb-10">
//         <Carousel>
//           <CandidateCard />
//           <CandidateCard />
//         </Carousel>
//       </div>
//       <div
//         className="h-32 flex justify-center items-center bg-gray-400 hover:bg-gray-300 cursor-pointer"
//         onClick={() => setOpenModal(true)}
//       >
//         <FaPlus size={30} />
//       </div>
//       <Modal show={openModal} size="md" onClose={onCloseModal} popup>
//         <Modal.Header />
//         <Modal.Body>
//           <div className="space-y-6">
//             <h3 className="text-xl font-medium text-gray-900 dark:text-white">
//               Create new candidate
//             </h3>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="name" value="Candidate's name" />
//               </div>
//               <TextInput
//                 id="name"
//                 placeholder="Candidate name"
//                 value={name}
//                 onChange={(name) => setName(event.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="imageUrl" value="Candidate's Image Url" />
//               </div>
//               <TextInput
//                 id="imageUrl"
//                 type="text"
//                 value={imageUrl}
//                 onChange={(url) => setImageUrl(event.target.value)}
//                 required
//                 placeholder="Link to the Candidate's picture"
//               />
//             </div>

//             <div className="w-full">
//               <Button className="bg-blue-600">Create Candidate</Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }

// export default Admin;

import React, { useState, useEffect } from "react";
import Web3 from "web3";
// import VotingContract from './contracts/VotingContract.json';
import { ABI } from "./abi";
import CONTRACT_BYTECODE from "./bytes";

function Admin() {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [votingStart, setVotingStart] = useState("");
  const [votingEnd, setVotingEnd] = useState("");
  const [whitelistStart, setWhitelistStart] = useState("");
  const [whitelistEnd, setWhitelistEnd] = useState("");
  const [voters, setVoters] = useState([]);
  const [deployed, setDeployed] = useState(false);

  // Connect to wallet
  useEffect(() => {
    console.log(contract);
    async function loadWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      }
    }
    loadWeb3();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const voterList = text.split("\n").map((voter) => voter.trim());
      setVoters(voterList);
    };
    reader.readAsText(file);
  };

  const deployContract = async () => {
    console.log(
      Math.floor(new Date(whitelistStart).getTime() / 1000),
      Math.floor(new Date(whitelistEnd).getTime() / 1000),
      Math.floor(new Date(votingStart).getTime() / 1000),
      Math.floor(new Date(votingEnd).getTime() / 1000)
    );
    if (validateDates()) {
      const contractData = new web3.eth.Contract(ABI);
      // console.log(CONTRACT_BYTECODE)
      const deploy = await contractData
        .deploy({
          data: CONTRACT_BYTECODE,
          arguments: [
            Math.floor(new Date(whitelistStart).getTime() / 1000),
            Math.floor(new Date(whitelistEnd).getTime() / 1000),
            Math.floor(new Date(votingStart).getTime() / 1000),
            Math.floor(new Date(votingEnd).getTime() / 1000),
            // voters,
          ],
        })
        .send({ from: account });
      setContract(deploy);
      setDeployed(true);
    } else {
      alert("Invalid date ranges");
    }
  };

  const validateDates = () => {
    return (
      new Date(whitelistStart) < new Date(votingStart) &&
      new Date(votingStart) < new Date(votingEnd)
    );
  };

  const addCandidate = async (candidateAddress) => {
    if (contract) {
      await contract.methods
        .addCandidate(candidateAddress)
        .send({ from: account });
    }
  };

  return (
    <div>
      <h1>Voting DApp</h1>
      {account ? (
        <div>
          <h3>Connected Wallet: {account}</h3>

          {!deployed ? (
            <>
              <div>
                <h4>Set Voting and Whitelisting Dates</h4>
                <label htmlFor="">Voting Start</label>
                <input
                  type="date"
                  onChange={(e) => setVotingStart(e.target.value)}
                  placeholder="Voting Start"
                  className="w-full"
                />
                <label htmlFor="">Voting End</label>
                <input
                  type="date"
                  onChange={(e) => setVotingEnd(e.target.value)}
                  placeholder="Voting End"
                  className="w-full"
                />
                <label htmlFor="">Voter's Whitelist Start</label>
                <input
                  type="date"
                  onChange={(e) => setWhitelistStart(e.target.value)}
                  placeholder="Whitelist Start"
                  className="w-full"
                />
                <label htmlFor="">Voter's Whitelist End</label>
                <input
                  type="date"
                  onChange={(e) => setWhitelistEnd(e.target.value)}
                  placeholder="Whitelist End"
                  className="w-full"
                />
              </div>

              <div>
                <h4>Upload Voter List</h4>
                <input type="file" onChange={handleFileUpload} />
              </div>

              <button onClick={deployContract}>Deploy Contract</button>
            </>
          ) : (
            <div>
              <h4>Add Candidates</h4>
              <input
                type="text"
                id="candidateAddress"
                placeholder="Candidate Address"
              />
              <button
                onClick={() =>
                  addCandidate(
                    document.getElementById("candidateAddress").value
                  )
                }
              >
                Add Candidate
              </button>
            </div>
          )}

          <div>
            <h4>FAQs</h4>
            <p>
              Deposit is required to cover the gas fees for adding candidates
              and voters.
            </p>
            {/* Add more FAQs as needed */}
          </div>
        </div>
      ) : (
        <h3>Please connect your wallet.</h3>
      )}
    </div>
  );
}

export default Admin;
