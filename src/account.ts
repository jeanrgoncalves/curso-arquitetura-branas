import pgp from "pg-promise";
import { Router } from 'express';
import { AccountModel } from "./account.model";

const router = Router();

const URL_DB = "postgres://postgres:123456@localhost:5432/app"

router.get("/account/:idAccount", async function (req, res) {
    const connection = pgp()(URL_DB);
    try {
        const idAccount = req.params.idAccount;
        let account = await connection.oneOrNone("select * from ccca.account where account_id = $1", [idAccount]);
        if (!account)
            return res.status(404).json({ error: "Account not found" });
        res.json(new AccountModel(
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

// ISP - Interface Segregation Principle
export interface GetAccountData {
	getAccountById (accountId: string): Promise<any>;
}

export default router;
