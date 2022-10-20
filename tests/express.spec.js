const request = require("supertest");
// const {app} = require("../app")
const baseURL = "http://localhost:3000";


test("GET /", async () => {
    const response = await request(baseURL).get("/");
    expect(response.statusCode).toBe(200); 
    expect(response.headers["Content-Type"]).toMatch("text/html");
});


