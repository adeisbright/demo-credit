import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import httpLogger from "./common/logging/http-logger";
import errorHandler from "./middleware/error-handler";
import userRouter from "./features/user/user.routes";
import authRouter from "./features/auth/auth.routes";
import walletRouter from "./features/wallet/wallet.routes";

const app: express.Application = express();

app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(httpLogger)

app.use(authRouter)
app.use(userRouter)
app.use(walletRouter)

app.use(errorHandler)
export default app 