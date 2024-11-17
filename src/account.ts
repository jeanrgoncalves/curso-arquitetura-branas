import pgp from "pg-promise";
import express from "express";
import { Account } from "./model/account";

const app = express();
app.use(express.json());

const URL_DB = "postgres://postgres:123456@localhost:5432/app"

app.get("/account/:idAccount", async function (req, res) {
    const connection = pgp()(URL_DB);
    try {
        const idAccount = req.params.idAccount;
        let account = await connection.oneOrNone("select * from ccca.account where account_id = $1", [idAccount]);
        if (!account)
            return res.status(404).json({ error: "Account not found" });
        res.json(new Account(
            account.account_id,
            account.name,
            account.email,
            account.cpf,
            account.car_plate,
            account.is_passenger,
            account.is_driver,
            account.password
        ));
    } finally {
        await connection.$pool.end();
    }
});

export default app;
