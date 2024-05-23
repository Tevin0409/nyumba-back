import Web3 from "web3";
import { newKitFromWeb3, ContractKit } from "@celo/contractkit";
import dotenv from "dotenv";

dotenv.config();

// Connect to the Alfajores testnet
const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit: ContractKit = newKitFromWeb3(web3);

const contractABI: any = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_landlord",
        type: "string",
      },
      {
        internalType: "string",
        name: "_tenant",
        type: "string",
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
        internalType: "string",
        name: "landlord",
        type: "string",
      },
      {
        internalType: "string",
        name: "tenant",
        type: "string",
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
        internalType: "string",
        name: "landlord",
        type: "string",
      },
      {
        internalType: "string",
        name: "tenant",
        type: "string",
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

const contractAddress = process.env.CONTRACT_ADDRESS as string;

const leaseContract = new kit.web3.eth.Contract(contractABI, contractAddress);

export const createLeaseOnBlockchain = async (
  tenant: string,
  propertyDetails: string,
  leaseTerms: string,
  startDate: number,
  endDate: number
): Promise<string> => {
  const accounts = await kit.web3.eth.getAccounts();
  const tx = await leaseContract.methods
    .createLease(tenant, propertyDetails, leaseTerms, startDate, endDate)
    .send({ from: accounts[0] });

  return tx.transactionHash;
};
