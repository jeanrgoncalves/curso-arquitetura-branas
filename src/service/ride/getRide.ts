import AccountDAO from "../../account.data";

export default class GetRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideData: GetRideData){}

    async getRide(rideId: String): Promise<any> {
        const ride = await this.rideData.getRideById(rideId);
        const passenger = await this.accountDAO.getAccountById(ride.passengerId);
        const driver = await this.accountDAO.getAccountById(ride.driverId);
        
        ride.passenger = passenger;
        ride.driver = driver;

        return {ride: ride}
    }
}

export interface GetRideData {
    getRideById(rideId: String): Promise<any>
}