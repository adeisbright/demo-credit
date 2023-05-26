import { Router } from "express"
import {
    createUser,
    getTransactionsHandler,
    getTransactionHandler
} from "./user.controller"
import validateToken from "../../middleware/validate-token"
import { getBalanceHandler } from "../wallet/wallet.controller"

const userRouter = Router() 

userRouter.route("/v1/users")
    .post(createUser)

userRouter.use(validateToken)
userRouter.get("/users/:userId/transactions", getTransactionsHandler)
userRouter.get("/users/:userId/transactions/:transactionId", getTransactionHandler)
userRouter.get("/users/:userId/balance" , getBalanceHandler)

export default userRouter