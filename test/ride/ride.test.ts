import axios from "axios";

test("It should return 200 for successfully requesting a ride", async function () {
    const payloadAccount = {
        name: 'Abel Ferreira',
        email: `abel${Math.random()}@hotmail.com`,
        cpf: "96889667034",
        isPassenger: true,
        password: "123"
    };

    const responseSignup = await axios.post("http://localhost:3000/signup", payloadAccount);

    const payload: any = {
        passengerId: responseSignup.data.accountId,
        fromLat: -22.665043051520566,
        fromLong: -50.432935706529165,
        toLat: -22.657417319063047,
        toLong: -50.41811279248574
    }

    const response = await axios.post("http://localhost:3000/ride", payload);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("rideId");
});