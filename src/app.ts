import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import httpLogger from "./common/logging/http-logger";
import errorHandler from "./middleware/error-handler";
import router from "./routes";

const app: express.Application = express();

app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(httpLogger)

app.use(router)

app.use(errorHandler)
export default app 