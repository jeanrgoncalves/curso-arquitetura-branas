import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { TransactionGatewayHttp } from "./infra/gateway/TransactionGateway";
import ORM from "./infra/orm/ORM";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";

// Entry Point - Composition Root

(async () => {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    Registry.getInstance().provide("queue", queue);
    Registry.getInstance().provide("connection", new PgPromiseAdapter());
    Registry.getInstance().provide("orm", new ORM());
    Registry.getInstance().provide("transactionGateway", new TransactionGatewayHttp());
    Registry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
})();
