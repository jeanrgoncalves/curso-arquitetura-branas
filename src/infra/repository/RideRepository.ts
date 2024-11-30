import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository  {
    passengerHasRideInProgress(passengerId: String): Promise<Boolean>
    createRide(ride: any): Promise<any>
    getRideById(rideId: String): Promise<any>
    hasActiveRideByDriverId(driverId: String): Promise<Boolean>
    driverAcceptsRide(rideId: string, driverId: string): Promise<void>
}

export default class RideRepositoryDatabase implements RideRepository {
    constructor (readonly connection: DatabaseConnection) {}

    async passengerHasRideInProgress(passengerId: String): Promise<Boolean> {
        const [rides] = await this.connection.query("select * from ccca.ride where passenger_id = $1 and status != $2", [passengerId, "COMPLETED"]);
        return rides;
    }

    async createRide(ride: any): Promise<any> {
        await this.connection.query("insert into ccca.ride " +
            "(ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values " +
            "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [ride.id, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date])
    }

    async getRideById(rideId: String): Promise<any> {
        const [ride] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        if (!ride) return null;
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

    async hasActiveRideByDriverId(driverId: String): Promise<Boolean> {
        const [rides] = await this.connection.query("select * from ccca.ride where driver_id = $1 and status in ('ACCEPTED', 'IN_PROGRESS')", [driverId]);
        return !!rides; 
    }

    async driverAcceptsRide(rideId: string, driverId: string): Promise<void> {
        await this.connection.query("update ccca.ride set driver_id = $1, status = 'ACCEPTED' where ride_id = $2", [driverId, rideId])
    }
    
}

