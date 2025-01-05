import ProcessPayment from "../src/application/usecase/ProcessPayment";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Registry from "../src/infra/di/Registry";
import ORM from "../src/infra/orm/ORM";
import { RabbitMQAdapter } from "../src/infra/queue/Queue";
import { TransactionRepositoryDatabase } from "../src/infra/repository/TransactionRepository";

// Entry Point - Composition Root

(async () => {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    Registry.getInstance().provide("queue", queue);
    Registry.getInstance().provide("connection", new PgPromiseAdapter());
    Registry.getInstance().provide("orm", new ORM());
    Registry.getInstance().provide("transactionRepository", new TransactionRepositoryDatabase());
    Registry.getInstance().provide("processPayment", new ProcessPayment());
    queue.consume("rideCompleted.processPayment", async function (data: any) {        
        await Registry.getInstance().inject("processPayment").execute(data);
    });
})();
