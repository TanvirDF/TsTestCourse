import { HTTP_CODES } from "../../../app/server_app/model/ServerModel";

export class ResponseTestWrapper { 
    public statusCode: HTTP_CODES;
    public headers = new Array<object>();
    public body: object;

    
    public end() {
        return;
    }

    public writeHead(statusCode: HTTP_CODES, headers: object) {
        this.statusCode = statusCode;
        this.headers.push(headers);
    }

    public write(data: string) {
        this.body = JSON.parse(data);
    }

    public clearFields() {
        this.statusCode = undefined;
        this.headers = new Array<object>();
        this.body = undefined;
    }   

}