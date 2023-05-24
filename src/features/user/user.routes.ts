import { Router } from "express"
import {
    createUser,
    getTransactionsHandler,
    getTransactionHandler
} from "./user.controller"

const userRouter = Router() 

userRouter.route("/v1/users")
    .post(createUser)

userRouter.get("/v1/users/:userId/transactions", getTransactionsHandler)
userRouter.get("/v1/users/:userId/transactions/:transactionId", getTransactionHandler)

export default userRouter