import { inject } from "../di/Registry";
import HttpClient from "../http/HttpClient";

export default interface TransactionGateway {
    getTransactionByRideId(rideId: string): Promise<GetTransactionOutput>;
}

export class TransactionGatewayHttp implements TransactionGateway {
	@inject("httpClient")
	httpClient!: HttpClient;

    constructor () {
    }

    async getTransactionByRideId(rideId: string): Promise<GetTransactionOutput> {
        return this.httpClient.get(`http://localhost:3001/transactions/ride/${rideId}`);
    }

}

type GetTransactionOutput = {
    transactionId: string
    rideId: string,
    amount: number,
    status: string,
    date: Date
}