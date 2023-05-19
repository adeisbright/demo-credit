import app from "./app"
import Config from "./config";
import Constant from "./constant";

app.listen(Config.serverPort, () =>
    console.log(Constant.messages.serverUp)
);