import { Router } from "express"
import { createUser } from "./user.controller"

const userRouter = Router() 

userRouter.route("/v1/users")
    .post(createUser)

export default userRouter