import { Router } from "express"
import {
    getBalanceHandler,
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

walletRouter.route("/v1/payment-processors")
    .get(getPaymentProcessors)

walletRouter.get("/v1/users/:userId/wallet-balance",validateToken,getBalanceHandler)
walletRouter.post("/v1/wallet/fund-wallet", validateToken, generatePaymentLinkHandler)
walletRouter.get(
    "/v1/wallet/verify-flutterwave-payment",
    validateFlutterwaveCallback,
    verifyFlutterwavePayment
)

walletRouter.get(
    "/v1/wallet/verify-paystack-payment",
    validatePaystackCallback,
    verifyPaystackPayment
)
walletRouter.get("/v1/wallet/get-banks",getBanksHandler)
walletRouter.post("/v1/wallet/transfer", validateToken, transferHander)
walletRouter.post("/v1/wallet/withdraw", validateToken, validateWithdrawal, withdrawalHandler)

export default walletRouter