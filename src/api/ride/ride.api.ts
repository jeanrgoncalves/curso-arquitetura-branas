import { AccountDAODatabase } from "../../account.data";
import RideDAODatabase from "../../data/ride/ride.dao";
import GetRide from "../../service/ride/getRide";
import RequestRide from "../../service/ride/requestRide";
import { Router } from 'express';

const router = Router();

router.post("/ride", async function (request, response) {
    const input = request.body;
    console.log(input)

    try {
        const accountDAO = new AccountDAODatabase();
        const rideDAODatabase = new RideDAODatabase();
        const requestRide = new RequestRide(accountDAO, rideDAODatabase);
        const output = await requestRide.requestRide(input);
        response.json(output);        
    } catch(e: any) {
        response.status(422).json({ message: e.message });
    }
});

router.get("/ride/:rideId", async function (request, response) {
    const rideId = request.params.rideId;
    console.log(rideId);

    const getRide = new GetRide(new AccountDAODatabase(), new RideDAODatabase())
    const output = await getRide.getRide(rideId)
    response.json(output);
});

export default router;