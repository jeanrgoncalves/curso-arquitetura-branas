import AccountDAO from "../../../account.data";
import RideRepository from "../../../infra/repository/RideRepository";

export default class GetRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideRepository: RideRepository){}

    async getRide(rideId: String): Promise<any> {
        const ride = await this.rideRepository.getRideById(rideId);
        const passenger = await this.accountDAO.getAccountById(ride.passengerId);
        const driver = await this.accountDAO.getAccountById(ride.driverId);
        
        ride.passenger = passenger;
        ride.driver = driver;

        return {ride: ride}
    }
}