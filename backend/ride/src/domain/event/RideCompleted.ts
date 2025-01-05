export default class RideCompleted {
    event = "rideCompleted";

    constructor (
        readonly rideId: string,
        readonly amount: number) {
    }

}
