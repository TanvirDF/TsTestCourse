import { DataBase } from "../../app/server_app/data/DataBase";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";


jest.mock('../../app/server_app/data/DataBase');

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();
let server: Server

const fakeServer = {
    listen: () => { },
    close: () => { }
};

jest.mock('http', () => ({
    createServer: (cb: Function) => { 
        cb(requestWrapper, responseWrapper);
        return fakeServer;
    },
}));

describe.skip('Register request test suite', () => { 
    beforeEach(() => {
        server = new Server();
    });
    afterEach(() => { 
        requestWrapper.clearFields();
        responseWrapper.clearFields();
    });

    it('it should register new users', async () => { 
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName: 'user',
            password: 'pass'
        };
        requestWrapper.url = '/register';
        jest.spyOn(DataBase.prototype, 'insert').mockResolvedValueOnce('1234');

        await server.startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual(expect.objectContaining({ userId: expect.any(String) }));
        
    });
    it('it should reject request with no userName and Password', async () => { 
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {};
        requestWrapper.url = '/register';

        await server.startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseWrapper.body).toEqual('userName and password required');
        
    });
    it('it should do nothing for unsupported method', async () => { 
        requestWrapper.method = HTTP_METHODS.DELETE;
        requestWrapper.url = '/register';

        await server.startServer();
        await new Promise(process.nextTick);

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.body).toBeUndefined();
        
    });
});