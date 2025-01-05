import GetTransaction from "../../application/usecase/GetTransaction";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";

export default class TransactionController {
    @inject("httpServer")
    httpServer!: HttpServer;

    @inject("getTransaction")
    getTransaction!: GetTransaction;

    constructor() {
        this.httpServer.register("get", "/transactions/ride/:{rideId}", async (params: any, body: any) => {
            const output = await this.getTransaction.byRideId(params.rideId);
            return output;
        });
     }
    
}
