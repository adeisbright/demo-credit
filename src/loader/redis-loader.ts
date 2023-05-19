import {Tedis} from "tedis"
import Config from "../config"


let tedis = new Tedis({
    host: Config.redis.host ,
    password:Config.redis.password,
    port:Config.redis.port
});

tedis.on("connect", () => {
    console.log("Redis Connection Established")
})
export default tedis