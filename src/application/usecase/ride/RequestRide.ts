import AccountDAO from "../../../account.data";
import RideRepository from "../../../infra/repository/RideRepository";
import RideUtils from "../../../utils/ride.utils";

export default class RequestRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideRepository: RideRepository) {}

    async requestRide(input: any) {
        const ride: any = {
            id: crypto.randomUUID(),
            passengerId: input.passengerId,
            fromLat: input.fromLat,
            fromLong: input.fromLong,
            toLat: input.toLat,
            toLong: input.toLong
        }

        await this.validatePassenger(ride);
        await this.validateRideInProgress(ride);

        ride.status = "REQUESTED";
        ride.fare = 10;
        ride.distance = RideUtils.calcDistance(ride.fromLat, ride.fromLong, ride.toLat, ride.toLong);
        ride.date = new Date();

        await this.rideRepository.createRide(ride)

        return {rideId: ride.id}
    }

    async validatePassenger(ride: any) {
        let account = await this.accountDAO.getAccountById(ride.passengerId);
        if (!account.isPassenger)
            throw new Error("User is not a passenger");
    }

    async validateRideInProgress(ride: any) {
        if (await this.rideRepository.passengerHasRideInProgress(ride.passengerId))
            throw new Error("Passenger already has a ride in progress")
    }
    
}

