const express = require("express");
const fileUpload = require("express-fileupload");
var cors = require("cors");
const path = require("path");
const { ethers } = require("ethers");

const app = express();

app.use(fileUpload());
app.use(cors());

app.use(express.static("public"));

const PORT = process.env.PORT || 5000;

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  if (file.name.split("").splice(-4).join("").toLowerCase() !== ".ifc") {
    return res.status(400).json({ msg: "Invalid file type" });
  }

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    console.log(`${PORT}/images/${file.name}`);

    res.json({
      fileName: file.name,
      fileURI: `${req.protocol}://${req.get("host")}/images/${file.name}`,
      filePath: `/uploads/${file.name}`,
    });
  });
});

app.get("/images/:filename", (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(
    __dirname,
    "client",
    "public",
    "uploads",
    filename
  );

  res.sendFile(imagePath);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
