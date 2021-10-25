//@ts-ignore
import { environment } from "@env"


var url : string | undefined = "http://127.0.0.1:8000";

if  (environment === "dev") {
    url = "http://127.0.0.1:8000"
} else if (environment === "prod") {
    /* TODO: add later for deployment */
    url = "placeholder"
}
console.log(url)

export default url;