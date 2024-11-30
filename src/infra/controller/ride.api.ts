import { Router } from 'express';
import { AccountDAODatabase } from "../../account.data";
import GetRide from "../../application/usecase/getRide";
import { PgPromiseAdapter } from "../database/DatabaseConnection";
import RideRepository from "../repository/RideRepository";
import RequestRide from '../../application/usecase/requestRide';

const router = Router();

router.post("/ride", async function (request, response) {
    const input = request.body;
    console.log(input)

    try {
        const databaseConnection = new PgPromiseAdapter()
        const accountDAO = new AccountDAODatabase();
        const rideRepository = new RideRepository(databaseConnection);
        const requestRide = new RequestRide(accountDAO, rideRepository);
        const output = await requestRide.requestRide(input);
        response.json(output);        
    } catch(e: any) {
        response.status(422).json({ message: e.message });
    }
});

router.get("/ride/:rideId", async function (request, response) {
    const rideId = request.params.rideId;
    console.log(rideId);

    const databaseConnection = new PgPromiseAdapter()
    const getRide = new GetRide(new AccountDAODatabase(), new RideRepository(databaseConnection));
    const output = await getRide.getRide(rideId)
    response.json(output);
});

export default router;