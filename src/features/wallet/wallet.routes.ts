import { Router } from "express"
import {
    getBalanceHandler,
    getPaymentProcessors,
    generatePaymentLinkHandler,
    verifyFlutterwavePayment
} from "./wallet.controller"
import validateToken from "../../middleware/validate-token"
import validateFlutterwaveCallback from "../../middleware/validate-flutterwave-payment"

const walletRouter = Router() 

walletRouter.route("/v1/payment-processors")
    .get(getPaymentProcessors)

walletRouter.get("/v1/users/:userId/wallet-balance",getBalanceHandler)
walletRouter.post("/v1/wallet/fund-wallet", validateToken, generatePaymentLinkHandler)
walletRouter.get(
    "/v1/wallet/verify-flutterwave-payment",
    validateFlutterwaveCallback,
    verifyFlutterwavePayment
)

// walletRouter.get("/verify-paystack-payment",verifyPaystackPayment)
export default walletRouter