import { Router } from 'express';
import UpdatePosition from '../../application/usecase/position/UpdatePosition';
import { PgPromiseAdapter } from "../database/DatabaseConnection";
import PositionRepository from '../repository/PositionRepository';
import RideRepository from "../repository/RideRepository";

const router = Router();

router.post("/position", async function (request, response) {
    const input = request.body;
    console.log(input)

    try {
        const databaseConnection = new PgPromiseAdapter()
        const rideRepository = new RideRepository(databaseConnection);
        const positionRepository = new PositionRepository(databaseConnection);
        const updatePosition = new UpdatePosition(rideRepository, positionRepository);
        await updatePosition.execute(input);
        response.sendStatus(200);      
    } catch(e: any) {
        response.status(422).json({ message: e.message });
    }
});

export default router;