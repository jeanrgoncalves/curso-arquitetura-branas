import ProcessPayment from "../src/application/usecase/ProcessPayment";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Registry from "../src/infra/di/Registry";
import ORM from "../src/infra/orm/ORM";
import { RabbitMQAdapter } from "../src/infra/queue/Queue";
import { TransactionRepositoryDatabase } from "../src/infra/repository/TransactionRepository";
import GetTransaction from "./application/usecase/GetTransaction";
import TransactionController from "./infra/controller/TransactionController";
import { ExpressAdapter } from "./infra/http/HttpServer";

const httpServer = new ExpressAdapter();
httpServer.listen(3001);

(async () => {
    
    const queue = new RabbitMQAdapter();
    await queue.connect();
    Registry.getInstance().provide("queue", queue);
    Registry.getInstance().provide("connection", new PgPromiseAdapter());
    Registry.getInstance().provide("orm", new ORM());
    Registry.getInstance().provide("transactionRepository", new TransactionRepositoryDatabase());
    Registry.getInstance().provide("processPayment", new ProcessPayment());
    Registry.getInstance().provide("getTransaction", new GetTransaction());
    Registry.getInstance().provide("httpServer", httpServer);
    Registry.getInstance().provide("transactionController", new TransactionController());
    queue.consume("rideCompleted.processPayment", async function (data: any) {
        console.log("Fila processPayment: " + JSON.stringify(data))        
        await Registry.getInstance().inject("processPayment").execute(data);
    });
})();
