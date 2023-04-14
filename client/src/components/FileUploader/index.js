import React, { Fragment, useState } from "react";
import Message from "../Message";
import Progress from "../Progress";
import axios from "axios";
import { ethers } from "ethers";
import { NFTABI, ERC20ABI } from "../../utils/ABI";
import { NFTAddress, TokenAddress } from "../../utils/address";
import "./fileuploader.scss";

const FileUpload = ({ feePaid, signer, setFeePaid, address }) => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    // Check file type
    if (
      e.target.files[0].name.split("").splice(-4).join("").toLowerCase() ===
      ".ifc"
    ) {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    } else {
      setMessage("Please make sure the file type is .ifc");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    const NFTContract = new ethers.Contract(NFTAddress, NFTABI, signer);
    const TokenContract = new ethers.Contract(TokenAddress, ERC20ABI, signer);

    try {
      setLoading(true);

      if (!feePaid && file) {
        // Handling Payments
        const tnx1 = await TokenContract.approve(
          NFTAddress,
          ethers.utils.parseUnits((10).toString(), "ether")
        );
        await tnx1.wait();
        const txn2 = await NFTContract.buy();
        await txn2.wait();
        setFeePaid(true);
      }

      // Handle Upload
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      // Clear percentage
      setTimeout(() => setUploadPercentage(0), 10000);

      const { fileName, fileURI, filePath } = res.data;

      setUploadedFile({ fileName, fileURI, filePath });

      setLoading(false);

      setMessage("File Uploaded");
    } catch (err) {
      setLoading(false);
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0);
    }
  };

  const handleMint = async (URI) => {
    try {
      setLoading(true);
      if (signer && feePaid && URI) {
        const NFTContract = new ethers.Contract(NFTAddress, NFTABI, signer);

        const txn = await NFTContract.mint(URI);

        setLoading(false);
        setMessage("Successfully Minted.");
      }
    } catch (error) {
      setLoading(false);
      setMessage("Something went wrong, Please try again");
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="file-uploader-container">
        {message ? <Message msg={message} /> : null}

        {uploadedFile.fileName ? (
          <div className="row mt-5 file-uploader">
            <div className="col-md-6 m-auto">
              <h3 className="text-center">{uploadedFile.fileName}</h3>
              <img
                style={{ width: "100%" }}
                src={uploadedFile.filePath}
                alt=""
              />
              <button
                className="btn btn-primary btn-block mt-4"
                onClick={() => {
                  handleMint(uploadedFile.fileURI);
                }}
              >
                {loading ? "Minting..." : "Mint"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="file-uploader">
            <div className="custom-file mb-4">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={onChange}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {filename}
              </label>
            </div>

            <Progress percentage={uploadPercentage} />

            <input
              type="submit"
              value={loading ? "Loading..." : "Pay and Upload"}
              className="btn btn-primary btn-block mt-4"
            />
          </form>
        )}
      </div>
    </Fragment>
  );
};

export default FileUpload;
