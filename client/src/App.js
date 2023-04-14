import { useState, useEffect } from "react";
import "./App.scss";
import FileUploader from "./components/FileUploader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { NFTABI, ERC20ABI } from "./utils/ABI";
import { NFTAddress, TokenAddress } from "./utils/address";
import { ethers } from "ethers";

function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [feePaid, setFeePaid] = useState(false);

  useEffect(() => {
    const getBuyCount = async () => {
      if (signer) {
        const NFTContract = new ethers.Contract(NFTAddress, NFTABI, signer);
        const buyCount = await NFTContract.getBuyCount(address);
        if (Number(buyCount) > 0) {
          setFeePaid(true);
        }
      }
    };

    getBuyCount();
  }, [feePaid, address]);

  return (
    <div>
      <Navbar
        setAddress={setAddress}
        setSigner={setSigner}
        address={address}
        signer={signer}
      />
      {signer ? (
        <FileUploader
          feePaid={feePaid}
          setFeePaid={setFeePaid}
          signer={signer}
          address={address}
        />
      ) : (
        <Hero />
      )}
    </div>
  );
}

export default App;
