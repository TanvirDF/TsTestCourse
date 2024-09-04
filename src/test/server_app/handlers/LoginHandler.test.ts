import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../../../app/server_app/auth/Authorizer';
import { Account } from '../../../app/server_app/model/AuthModel';
import { HTTP_CODES, HTTP_METHODS } from '../../../app/server_app/model/ServerModel';
import { getRequestBody } from '../../../app/server_app/utils/Utils';

const getRequestBodyMock = jest.fn();
jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}));


describe('LoginHandler test suite', () => { 
    let sut: LoginHandler;
    const requestMock = {
        method: undefined
    };

    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn(),
        statusCode: undefined
    }

    const authorizerMock = {
        login: jest.fn()
    }


    const someAccount: Account = {
        id: '',
        userName: 'test',
        password: 'password'
    } 

    const someToken = '1234';

    beforeEach(() => { 
        sut = new LoginHandler(requestMock as any , responseMock as any as ServerResponse, authorizerMock as any as Authorizer);
    });

    afterEach(() => { 
        jest.clearAllMocks();
    });

    it('handleRequest - it should login valid accounts in request', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.login.mockResolvedValueOnce(someToken);

        await sut.handleRequest();

        expect(getRequestBodyMock).toHaveBeenCalledTimes(1);
        expect(authorizerMock.login).toHaveBeenCalledTimes(1);
        expect(authorizerMock.login).toHaveBeenCalledWith(someAccount.userName, someAccount.password);
        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ token: someToken }));

    });

    it('handleRequest- should response not found with invalid login ', async () => {
        requestMock.method = HTTP_METHODS.POST;
        const handlePostSpy = jest.spyOn(sut as any, 'handlePost')
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.login.mockResolvedValueOnce(undefined);
        
        await sut.handleRequest();
        expect(handlePostSpy).toHaveBeenCalledTimes(1);
        expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_FOUND);
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('wrong username or password'));


    });
    
    it('handleRequest- should response bad request with missing userName or password', async () => { 
        requestMock.method = HTTP_METHODS.POST;
        const handlePostSpy = jest.spyOn(sut as any, 'handlePost')
        getRequestBodyMock.mockResolvedValueOnce({});

        await sut.handleRequest();

        expect(handlePostSpy).toHaveBeenCalledTimes(1);
        expect(getRequestBodyMock).toHaveBeenCalledTimes(1);

        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' });
        expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('userName and password required'));
    });

    it('handleRequest- should do nothing with invalid method', async () => { 
        requestMock.method = 'INVALID';
        const handlePostSpy = jest.spyOn(sut as any, 'handlePost')
        await sut.handleRequest();
        expect(handlePostSpy).toHaveBeenCalledTimes(0);
    });


});