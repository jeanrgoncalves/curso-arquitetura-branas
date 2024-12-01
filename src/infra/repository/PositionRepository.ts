import Position from "../../domain/Position";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface PositionRepository {
    save(position: Position): Promise<void>
}

export default class PositionRepositoryDatabase implements PositionRepository {

    constructor(readonly connection: DatabaseConnection) {}
    
    async save(position: Position): Promise<void> {
        await this.connection.query(
            "insert into ccca.position (position_id, ride_id, lat, long, date) "
            + "values ($1, $2, $3, $4, $5)", 
            [position.positionId, position.rideId, position.lat, position.long, position.date]
        );
    }

}