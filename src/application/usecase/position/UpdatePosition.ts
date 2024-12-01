import Position from "../../../domain/Position";
import PositionRepository from "../../../infra/repository/PositionRepository"
import RideRepository from "../../../infra/repository/RideRepository"

export default class UpdatePosition {
    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {}

    async execute(input: Input) {
        await this.validateRide(input.rideId);
        const position = Position.create(input.rideId, input.lat, input.long);
        await this.positionRepository.save(position);
    }

    async validateRide(rideId: string) {
        const ride = await this.rideRepository.getRideById(rideId);
        if (ride.status != "IN_PROGRESS")
            throw new Error("Ride must be in the IN_PROGRESS status")
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number
}