import crypto from "crypto";
import { Router } from 'express';
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

const router = Router();

const URL_DB = "postgres://postgres:123456@localhost:5432/app"

router.post("/signup", async function (request, response) {
	const connection = pgp()(URL_DB);
	try {
		const input = request.body;

		if (!validName(input.name)) return errorResponse(response, "Ivalid name.");
		if (!validEmail(input.email)) return errorResponse(response, "Invalid email.");
		if (!await validExistingEmail(connection, input.email)) return errorResponse(response, "It already exists an account for this email.");
		if (!validateCpf(input.cpf)) return errorResponse(response, "Invalid cpf.");
		if (input.isDriver && !validCarPlate(input.carPlate)) return errorResponse(response, "Invalid car plate.");

		let result = await insertAccountAndCreateResult(connection, input);
		response.json(result);
	} finally {
		await connection.$pool.end();
	}
});

function errorResponse(response: any, message: String) {
	return response.status(422).json({ message: message });
}

async function validExistingEmail(connection: any, email: String) {
	const [accounts] = await connection.query("select * from ccca.account where email = $1", [email]);
	return !accounts;
}

function validName(name: String) {
	return !!(name && name.match(/[a-zA-Z] [a-zA-Z]+/));
}

function validEmail(email: String) {
	return !!(email && email.match(/^(.+)@(.+)$/));
}

function validCarPlate(carPlate: String) {
	return !!(carPlate && carPlate.match(/[A-Z]{3}[0-9]{4}/));
}

async function insertAccountAndCreateResult(connection: any, input: any) {
	const id = crypto.randomUUID();
	await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
	return {
		accountId: id
	};
}

// ISP - Interface Segregation Principle
export interface SignupData {
	saveAccount (account: any): Promise<any>;
	getAccountByEmail (email: string): Promise<any>;
}

export default router;
