import app from "../../app"
import request from "supertest"
import Constant from "../../constant"
import knexClient from "../../loader/knex-loader"
import tedis from "../../loader/redis-loader"

//Re-usable values 
let password= "abcdefgh"
let email = "example@foo.com" 


describe("Auth  Resource Handlers", () => {
  
    afterAll((done : any) => {
        tedis.close(); 
        knexClient.destroy()
        done()
    })

    it.skip("Should not register user as field is incomplete", async () => {
        const res = await request(app)
            .post("/auth/sign-up")
            .send({
                first_name: "John",
                email,
                password
            })
            
            expect(res.statusCode).toBe(400)   
    })

        
    it.skip("Should store user data temporarily and generate a reference", async () => {

        const userData = {
            first_name: "John", 
            last_name : "Doe",
            email,
            password,
            confirm_password: password
        }

        const res = await request(app)
            .post("/auth/sign-up")
            .send(userData)
        
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toEqual(Constant.messages.emailVerificationSent)
    })

    it.skip("Should  not register user when a user already exists", async () => {

        const userData = {
            first_name: "John", 
            last_name : "Doe",
            email,
            password,
            confirm_password: password
        }

        const res = await request(app)
            .post("/auth/sign-up")
            .send(userData)
        
        expect(res.statusCode).toBe(400)
    })

    it("Should  store a user temporirly, and create a wallet on email verification", async () => {

        const userData = {
            first_name: "John", 
            last_name : "Doe",
            email : "correct1@foo.com",
            password,
            confirm_password: password
        }

        const res = await request(app)
            .post("/auth/sign-up")
            .send(userData)
        console.log(res.body)
        const reference = res.body.data.verificationURL

        const emailConfirmationRequest = await request(app)
            .get(reference)
        
        expect(emailConfirmationRequest.statusCode).toBe(200)
    })

    it.skip("Should allow the user login", async () => {
        const loginData = {
            email, 
            password
        }

        const res = await request(app)
            .post("/auth/login")
            .send(loginData)
       
        //let token = res.body.data.token  
        
        expect(res.statusCode).toBe(200) 
        expect(res.body).toHaveProperty("data")
    })

   
})