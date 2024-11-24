import axios from "axios";
import pgp from "pg-promise";

describe('POST /signup', () => {
    it('should return 200 for successful signup a passenger', async () => {
        let payload = {
            name: 'Abel Ferreira',
            email: `abel${Math.random()}@hotmail.com`,
            cpf: "96889667034",
            isPassenger: true,
            password: "123"
        };

        const responseSignup = await requestSignup(payload);
        assertSignupResponse(responseSignup);

        let accountId = responseSignup.data.accountId;
        const responseAccount = await requestGetAccount(accountId);

        assertAccountCommonFields(responseAccount, accountId, payload);
        expect(responseAccount.data).toHaveProperty('isPassenger', payload.isPassenger);
    });

    it('should return 200 for successful signup a driver', async () => {
        let payload = {
            name: 'Raphael Veiga',
            email: `veiga${Math.random()}@hotmail.com`,
            cpf: "02268127079",
            isDriver: true,
            carPlate: "CUH9160",
            password: "123"
        };

        const responseSignup = await requestSignup(payload);
        assertSignupResponse(responseSignup);

        let accountId = responseSignup.data.accountId;
        const responseAccount = await requestGetAccount(accountId);

        assertAccountCommonFields(responseAccount, accountId, payload);
        expect(responseAccount.data).toHaveProperty('isDriver', payload.isDriver);
        expect(responseAccount.data).toHaveProperty('carPlate', payload.carPlate);
    });

    it('should return 422 for email already used', async () => {
        let payload = {
            name: 'Weveton Wev',
            email: `wev${Math.random()}@hotmail.com`,
            cpf: "96889667034",
            isPassenger: true,
            password: "123"
        }

        await requestSignup(payload);
        let response;
        try {
            await requestSignup(payload);
        } catch (error: any) {
            response = error.response;
        }

        expect(response.status).toBe(422);
        expect(response.data).toHaveProperty('message', 'It already exists an account for this email.');
    });

    test.each([
        null,
        undefined,
        "",
        "Alice"
    ])('should return 422 for invalid name', async (name: any) => {
        let payload = {
            name: name,
            email: 'wev@hotmail.com',
            cpf: "96889667034",
            isPassenger: true,
            password: "123"
        }

        let response;
        try {
            await requestSignup(payload);
        } catch (error: any) {
            response = error.response;
        }

        expect(response.status).toBe(422);
        expect(response.data).toHaveProperty('message', 'Ivalid name.');
    });

    test.each([
        null,
        undefined,
        "",
        "wev_hotmail.com"
    ])('should return 422 for invalid email', async (email: any) => {
        let payload = {
            name: 'Weveton Wev',
            email: email,
            cpf: "96889667034",
            isPassenger: true,
            password: "123"
        }

        let response;
        try {
            await requestSignup(payload);
        } catch (error: any) {
            response = error.response;
        }

        expect(response.status).toBe(422);
        expect(response.data).toHaveProperty('message', 'Invalid email.');
    });

    test.each([
        null,
        undefined,
        "",
        "40688413845"
    ])('should return 422 for invalid cpf', async (cpf: any) => {
        let payload = {
            name: 'Weverton Wev',
            email: 'wev@hotmail.com',
            cpf: cpf,
            isPassenger: true,
            password: "123"
        }

        let response;
        try {
            await requestSignup(payload);
        } catch (error: any) {
            response = error.response;
        }

        expect(response.status).toBe(422);
        expect(response.data).toHaveProperty('message', 'Invalid cpf.');
    });

    test.each([
        null,
        undefined,
        "",
        "CUH9i60"
    ])('should return 422 for invalid car plate', async (carPlate) => {
        let payload = {
            name: 'Weverton Wev',
            email: 'wev@hotmail.com',
            cpf: "96889667034",
            isDriver: true,
            carPlate: carPlate,
            password: "123"
        }

        let response;
        try {
            await requestSignup(payload);
        } catch (error: any) {
            response = error.response;
        }

        expect(response.status).toBe(422);
        expect(response.data).toHaveProperty('message', 'Invalid car plate.');
    });

});

async function requestSignup(payload: any): Promise<any> {
    return await axios.post("http://localhost:3000/signup", payload);
}

async function requestGetAccount(accountId: String): Promise<any> {
    return await axios.get("http://localhost:3000/account/" + accountId);
}

function assertSignupResponse(responseSignup: any) {
    expect(responseSignup.status).toBe(200);
    expect(responseSignup.data).toHaveProperty('accountId');
}

function assertAccountCommonFields(responseAccount: any, accountId: any, payload: any) {
    expect(responseAccount.data).toHaveProperty('id', accountId);
    expect(responseAccount.data).toHaveProperty('name', payload.name);
    expect(responseAccount.data).toHaveProperty('email', payload.email);
    expect(responseAccount.data).toHaveProperty('cpf', payload.cpf);
    expect(responseAccount.data).toHaveProperty('password', payload.password);
}

async function deleteAccounts() {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("delete from ccca.account");
    await connection.$pool.end();
}

