import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { getRequestBody } from "../../../app/server_app/utils/Utils";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();
jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
})); 


describe('RegisterHandler test suite', () => { 
    let sut: RegisterHandler;
    
    const request: any = {
        method: undefined 
    };
    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn(),
        statusCode: undefined
    }

    const authorizerMock = {
        registerUser: jest.fn()
    }

    const someAccount = {
        id: '',
        password: 'password',
        userName: 'test'
    };

    const someId = '1234';

    beforeEach(() => { 
        sut = new RegisterHandler(request as IncomingMessage, responseMock as any as ServerResponse , authorizerMock as any as Authorizer);
    });

    afterEach(() => { 
        jest.clearAllMocks();
    });
    it('handleRequest - it should register valid accounts in request', async () => { 
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.registerUser.mockResolvedValueOnce(someId);

        await sut.handleRequest();

        expect(getRequestBodyMock).toHaveBeenCalledTimes(1);
        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ userId: someId }));

    });

    it('handleRequest - it should return bad request if account is invalid', async () => { 
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce({});
        await sut.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' });
        expect(responseMock.write(JSON.stringify('userName and password required')));
    });

    it('handleRequest - it should do nothing for unsupported http method', async () => { 
        request.method = 'UNSUPPORTED';
        await sut.handleRequest();
        expect(responseMock.writeHead).not.toHaveBeenCalled();
        expect(responseMock.write).not.toHaveBeenCalled();
    });

});