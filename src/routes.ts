import { Router, Request, Response } from "express"; 
import userRouter from "./features/user/user.routes";
import walletRouter from "./features/wallet/wallet.routes";
import authRouter from "./features/auth/auth.routes";
const router = Router() 

router.get("/health-check", (
    _: Request, 
    res : Response
) => {
    res.status(200).json({
        message: "Service Running Fine", 
        status: true, 
        statusCode: 200, 
        data : []
    })
})


router.use(authRouter)
router.use("/v1", userRouter)
router.use("/v1", walletRouter)


export default router