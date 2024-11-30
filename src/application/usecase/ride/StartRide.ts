import RideRepository from "../../../infra/repository/RideRepository";

export default class StartRide {
    constructor(readonly rideRepository: RideRepository) {}

    async execute(rideId: string) {
        await this.validateRide(rideId);
        await this.rideRepository.updateStatus(rideId, "IN_PROGRESS");
    }

    async validateRide(rideId: string) {
        const ride = await this.rideRepository.getRideById(rideId);
        if (ride.status != "ACCEPTED")
            throw new Error("Ride must be in the ACCEPTED status")
    }
}
