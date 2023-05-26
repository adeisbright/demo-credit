import { Router } from "express"
import {
    getPaymentProcessors,
    generatePaymentLinkHandler,
    verifyFlutterwavePayment, 
    verifyPaystackPayment,
    transferHander,
    withdrawalHandler,
    getBanksHandler
} from "./wallet.controller"
import validateToken from "../../middleware/validate-token"
import validateFlutterwaveCallback from "../../middleware/validate-flutterwave-payment"
import validatePaystackCallback from "../../middleware/validate-paystack-payment"
import validateWithdrawal from "../../middleware/validate-withdrawal"
const walletRouter = Router() 




walletRouter.get(
    "/wallet/verify-flutterwave-payment",
    validateFlutterwaveCallback,
    verifyFlutterwavePayment
)

walletRouter.get(
    "/wallet/verify-paystack-payment",
    validatePaystackCallback,
    verifyPaystackPayment
)
walletRouter.use(validateToken)
walletRouter.get("/payment-processors",getPaymentProcessors)
walletRouter.get("/wallet/get-banks",getBanksHandler)
walletRouter.post("/wallet/transfer", transferHander)
walletRouter.post("/wallet/withdraw", validateWithdrawal, withdrawalHandler)
walletRouter.post("/wallet/fund", generatePaymentLinkHandler)

export default walletRouter