const Web3 = require("web3");
const { newKitFromWeb3 } = require("@celo/contractkit");
require("dotenv").config();

// Connect to the Alfajores testnet
const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = newKitFromWeb3(web3);

const contractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tenant",
        type: "address",
      },
      {
        internalType: "string",
        name: "_propertyDetails",
        type: "string",
      },
      {
        internalType: "string",
        name: "_leaseTerms",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endDate",
        type: "uint256",
      },
    ],
    name: "createLease",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getLease",
    outputs: [
      {
        internalType: "address",
        name: "landlord",
        type: "address",
      },
      {
        internalType: "address",
        name: "tenant",
        type: "address",
      },
      {
        internalType: "string",
        name: "propertyDetails",
        type: "string",
      },
      {
        internalType: "string",
        name: "leaseTerms",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endDate",
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
    name: "leases",
    outputs: [
      {
        internalType: "address",
        name: "landlord",
        type: "address",
      },
      {
        internalType: "address",
        name: "tenant",
        type: "address",
      },
      {
        internalType: "string",
        name: "propertyDetails",
        type: "string",
      },
      {
        internalType: "string",
        name: "leaseTerms",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contractAddress = process.env.CONTRACT_ADDRESS;

const leaseContract = new kit.web3.eth.Contract(contractABI, contractAddress);

const createLeaseOnBlockchain = async (
  tenant,
  propertyDetails,
  leaseTerms,
  startDate,
  endDate
) => {
  const accounts = await kit.web3.eth.getAccounts();
  const tx = await leaseContract.methods
    .createLease(tenant, propertyDetails, leaseTerms, startDate, endDate)
    .send({ from: accounts[0] });

  return tx.transactionHash;
};

module.exports = { createLeaseOnBlockchain };
