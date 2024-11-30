import AccountDAO from "../../account.data";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideRepository: RideRepository) {}

    async execute(input: Input) {
        await this.validateDriver(input.driverId);
        await this.validateRide(input.rideId);
        await this.validateDriverRides(input.driverId);
        await this.rideRepository.driverAcceptsRide(input.rideId, input.driverId);
    }

    async validateDriver(driverId: string) {
        const account = await this.accountDAO.getAccountById(driverId);
        if (!account.isDriver)
            throw new Error("User is not a driver")
    }

    async validateRide(rideId: string) {
        const ride = await this.rideRepository.getRideById(rideId);
        if (ride.status != "REQUESTED")
            throw new Error("The ride must be in the REQUESTED status")
    }

    async validateDriverRides(driverId :string) {
        if (await this.rideRepository.hasActiveRideByDriverId(driverId))
            throw new Error("Driver already has an active ride")
    }
}

type Input = {
    rideId: string,
    driverId: string
}