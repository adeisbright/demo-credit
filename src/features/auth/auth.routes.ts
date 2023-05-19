import { Router } from "express"
import { validateUserCreation } from "../../middleware/validate-user-creation"
import {
    temporaryStoreUser, 
    verifyUserEmail,
    handleLogin, 
    handleLogout
} from "./auth.controller"

const authRouter = Router() 

authRouter.post("/auth/sign-up",validateUserCreation , temporaryStoreUser)
authRouter.post("/auth/account-verification", verifyUserEmail)
authRouter.post("/auth/login", handleLogin)
authRouter.post("/auth/logout",handleLogout)
export default authRouter