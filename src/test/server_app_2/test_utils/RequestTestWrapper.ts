import { HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

export class RequestTestWrapper{
    public body: object;
    public method: HTTP_METHODS;
    public url: string;
    public headers = {};

    public on(event, cb) {
        if ( event === 'data' ) {
            cb(JSON.stringify(this.body));
        }
    }

    public clearFields() {
        this.body = undefined;
        this.method = undefined;
        this.url = undefined;
     }


}