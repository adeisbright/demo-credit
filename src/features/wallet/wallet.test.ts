// import app from "../../app"
// import request from "supertest"
// import knexClient from "../../loader/knex-loader"


// describe("Wallet Resource Handlers Test", () => {
//     afterAll((done: any) => {
//         done()
//     })
//     const email = "ade@gmail.com"

//     interface IUser {
//         id: number 
//         email : string 
//     }

//     interface IWallet {
//         user_id : number 
//     }
//     afterEach(async () => {
//         const user : any = await knexClient<IUser>("users").where({ email }).first()
//         if (user && user.id) {
           
//             const wallet = await knexClient<IWallet>("wallets").del({ user_id: user.id })
//             await knexClient("users").del({ id: Number(user.id) })
//         }
//     })
//     it("Should not allow unathenticated user to get quote", async () => {
       
//         const res = await request(app)
//             .get(`/quote`)
       
        
//         expect(res.statusCode).toBe(400)
//         expect(res.body.success).toBeFalsy()
//     })

//     it("Should  allow authenticated user to get a quote", async () => {
       
//         const res = await request(app)
//             .get(`/quote`)
//             .set({authorization:`Bearer ${token}`})
       
        
//         expect(res.statusCode).toBe(200)
//         expect(res.body).toHaveProperty("success") 
//         expect(res.body.success).toBe(true)
//     })
// })