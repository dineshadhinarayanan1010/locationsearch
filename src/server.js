// server.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/bdo-branches", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.applynow.bdo.com.ph/_api/infy_branchs?$select=infy_branchid,infy_name,infy_branchaddress,infy_longitude,infy_latitude&$filter=statecode eq 0 and bdo_branch eq 1",{
      headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
    "Referer": "https://www.applynow.bdo.com.ph/",
  },
  timeout: 15000,
   } );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching data");
  }
});

app.listen(5010, () => console.log("Server running on port 5010"));