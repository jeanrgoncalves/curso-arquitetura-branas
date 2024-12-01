import crypto from "crypto";

export default class Position {
    constructor(
        readonly positionId: string,
        readonly rideId: string,
        readonly lat: number,
        readonly long: number,
        readonly date: Date
    ) {}

    static create(rideId: string, lat: number, long: number) {
        const id = crypto.randomUUID();
        const date = new Date();
        return new Position(id, rideId, lat, long, date);
    }
}