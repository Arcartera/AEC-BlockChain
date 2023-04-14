import { useState } from "react";
import { ethers } from "ethers";
import "./nav.scss";

function Navbar({ setAddress, setSigner, address, signer }) {
  // Connect to Metamask and set the signer
  const connectToMetamask = async () => {
    // Check if Metamask is installed
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Get network information
        const network = await provider.getNetwork();
        // Check if the user is on the Polygon mainnet
        if (network.chainId !== 137) {
          // If not, ask the user to switch to the Polygon mainnet
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x89" }], // Polygon mainnet chain ID
          });
        }
        // Get the signer
        const signer = provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        setAddress(address);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Metamask is not installed");
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          {!signer ? (
            <button
              onClick={connectToMetamask}
              className="btn btn-primary btn-block mt-4"
            >
              Connect Metamask
            </button>
          ) : (
            <>
              Connected as <span className="address">${address}</span>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
