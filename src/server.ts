import signup from "../src/signup";
import account from "../src/account"
import rideApi from "./api/ride/ride.api"
import express from "express";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use(signup);
app.use(account);
app.use(rideApi);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
