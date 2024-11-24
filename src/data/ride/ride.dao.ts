import { GetRideData } from "../../service/ride/getRide";
import { RequestRideData } from "../../service/ride/requestRide";
import pgp from "pg-promise";

export default interface RideDAO extends RequestRideData, GetRideData {
    passengerHasRideInProgress(passengerId: String): Promise<Boolean>
    createRide(ride: any): Promise<any>
    getRideById(rideId: String): Promise<any>
    //perguntar pq define novamente os metodos se está herdando
}

export default class RideDAODatabase implements RideDAO {
    private POSTGRES_URL = "postgres://postgres:123456@localhost:5432/app";

    async passengerHasRideInProgress(passengerId: String): Promise<Boolean> {
        const connection = pgp()(this.POSTGRES_URL);
        const [rides] = await connection.query("select * from ccca.ride where passenger_id = $1 and status != $2", [passengerId, "COMPLETED"]);
        await connection.$pool.end();
        return rides;
    }

    async createRide(ride: any): Promise<any> {
        const connection = pgp()(this.POSTGRES_URL);
        await connection.query("insert into ccca.ride " +
            "(ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values " +
            "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [ride.id, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date])
        await connection.$pool.end();
    }

    async getRideById(rideId: String): Promise<any> {
        const connection = pgp()(this.POSTGRES_URL);
        const [ride] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
        return {
            rideId: ride.ride_id,
            passengerId: ride.passenger_id,
            driverId: ride.driver_id,
            status: ride.status,
            fare: ride.fare,
            distance: ride.distance,
            fromLat: ride.from_lat,
            fromLong: ride.from_long,
            toLat: ride.to_lat,
            toLong: ride.to_long,
            date: ride.date
        }
    }

}