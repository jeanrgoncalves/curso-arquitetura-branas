import signup from "../src/signup";
import account from "../src/account";
import request from 'supertest';
import pgp from "pg-promise";

beforeEach(async () => {
    await deleteAccounts();
});


describe('POST /signup', () => {
    it('should return 200 for successful signup a passenger', async () => {
        let payload = {
            name: 'Jean Rafael Gonçalves',
            email: 'jeanrgoncalves@hotmail.com',
            cpf: "40688413811",
            isPassenger: true,
            password: "123"
        };

        const responseSignup = await requestSignup(payload);
        assertSignupResponse(responseSignup);

        let accountId = responseSignup.body.accountId;
        const responseAccount = await requestGetAccount(accountId);

        assertAccountCommonFields(responseAccount, accountId, payload);
        expect(responseAccount.body).toHaveProperty('isPassenger', payload.isPassenger);
    });

    it('should return 200 for successful signup a driver', async () => {
        let payload = {
            name: 'Leticia Bernusse Gonçalves',
            email: 'bernusse@hotmail.com',
            cpf: "40146896890",
            isDriver: true,
            carPlate: "CUH9160",
            password: "123"
        };

        const responseSignup = await requestSignup(payload);
        assertSignupResponse(responseSignup);

        let accountId = responseSignup.body.accountId;
        const responseAccount = await requestGetAccount(accountId);

        assertAccountCommonFields(responseAccount, accountId, payload);
        expect(responseAccount.body).toHaveProperty('isDriver', payload.isDriver);
        expect(responseAccount.body).toHaveProperty('carPlate', payload.carPlate);
    });

    it('should return 422 for email already used', async () => {
        let payload = {
            name: 'Alice Gonçalves',
            email: 'alice@hotmail.com',
            cpf: "40688413811",
            isPassenger: true,
            password: "123"
        }

        await requestSignup(payload);
        const response = await requestSignup(payload);

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('message', 'It already exists an account for this email.');
    });

    test.each([
        null,
        undefined,
        "",
        "Alice"
    ])('should return 422 for invalid name', async (name: any) => {
        let payload = {
            name: name,
            email: 'alice@hotmail.com',
            cpf: "40688413811",
            isPassenger: true,
            password: "123"
        }

        const response = await requestSignup(payload);

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('message', 'Ivalid name.');
    });

    test.each([
        null,
        undefined,
        "",
        "alice_hotmail.com"
    ])('should return 422 for invalid email', async (email: any) => {
        let payload = {
            name: 'Alice Gonçalves',
            email: email,
            cpf: "40688413811",
            isPassenger: true,
            password: "123"
        }

        const response = await requestSignup(payload);

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('message', 'Invalid email.');
    });

    test.each([
        null,
        undefined,
        "",
        "40688413845"
    ])('should return 422 for invalid cpf', async (cpf: any) => {
        let payload = {
            name: 'Alice Gonçalces',
            email: 'alice@hotmail.com',
            cpf: cpf,
            isPassenger: true,
            password: "123"
        }

        const response = await requestSignup(payload);

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('message', 'Invalid cpf.');
    });

    test.each([
        null,
        undefined,
        "",
        "CUH9i60"
    ])('should return 422 for invalid car plate', async (carPlate) => {
        let payload = {
            name: 'Alice Gonçalces',
            email: 'alice@hotmail.com',
            cpf: "40688413811",
            isDriver: true,
            carPlate: carPlate,
            password: "123"
        }

        const response = await requestSignup(payload);

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('message', 'Invalid car plate.');
    });

});

async function requestSignup(payload: any): Promise<any> {
    return await request(signup)
        .post('/signup')
        .send(payload);
}

async function requestGetAccount(accountId: String): Promise<any> {
    return await request(account)
        .get('/account/' + accountId);
}

function assertSignupResponse(responseSignup: any) {
    expect(responseSignup.status).toBe(200);
    expect(responseSignup.body).toHaveProperty('accountId');
}

function assertAccountCommonFields(responseAccount: any, accountId: any, payload: any) {
    expect(responseAccount.body).toHaveProperty('id', accountId);
    expect(responseAccount.body).toHaveProperty('name', payload.name);
    expect(responseAccount.body).toHaveProperty('email', payload.email);
    expect(responseAccount.body).toHaveProperty('cpf', payload.cpf);
    expect(responseAccount.body).toHaveProperty('password', payload.password);
}

async function deleteAccounts() {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("delete from ccca.account");
}

