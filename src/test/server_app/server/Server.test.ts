import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Server } from "../../../app/server_app/server/Server";



jest.mock('../../../app/server_app/auth/Authorizer');

jest.mock('../../../app/server_app/data/ReservationsDataAccess');

jest.mock('../../../app/server_app/handlers/LoginHandler');


jest.mock('../../../app/server_app/handlers/RegisterHandler')

jest.mock('../../../app/server_app/handlers/ReservationsHandler');

jest.mock('http', () => ({
    createServer: (cb: Function) => {
        cb(requestMock, responseMock)
        return serverMock;
    },
}));


const requestMock = {
    headers: {
        'user-agent': 'some user agent'
    },
    url: '',
};

const responseMock = {
    end: jest.fn(),
    writeHead: jest.fn(),
    
};

const serverMock = {
    listen: jest.fn(),
    close: jest.fn()
};



describe('Server test suite', () => {

    let sut: Server;

    beforeEach(() => {
        sut = new Server();
        expect(Authorizer).toHaveBeenCalledTimes(1);
        expect(ReservationsDataAccess).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should start server on port 8080 and end the request', async () => {
        await sut.startServer();

        expect(serverMock.listen).toHaveBeenCalledWith(8080);
        expect(responseMock.end).toHaveBeenCalledTimes(1);
    });
    it('should handle register request', async () => { 
        requestMock.url = '/register';
        const handleRequestSpy = jest.spyOn(RegisterHandler.prototype, 'handleRequest');

        await sut.startServer();
        
        expect(handleRequestSpy).toHaveBeenCalledTimes(1);
        expect(RegisterHandler ).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer));
    });
    it('should handle login request', async () => { 
        requestMock.url = '/login';
        const handleLoginSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest');

        await sut.startServer();
        
        expect(handleLoginSpy).toHaveBeenCalledTimes(1);
        expect(LoginHandler ).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer));
    });
    it('should handle reservation request', async () => { 
        requestMock.url = '/reservation';
        const handleReservationSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');

        await sut.startServer();
        
        expect(handleReservationSpy).toHaveBeenCalledTimes(1);
        expect(ReservationsHandler ).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer), expect.any(ReservationsDataAccess));
    });

    it('should handle unknown request', async () => { 
        requestMock.url = '/unknown';
        const handleReservationSpy = jest.spyOn(ReservationsHandler.prototype, 'handleRequest');
        const handleLoginSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest');
        const handleRegisterSpy = jest.spyOn(RegisterHandler.prototype, 'handleRequest');

        await sut.startServer();
        
        expect(handleReservationSpy).not.toHaveBeenCalled();
        expect(handleLoginSpy).not.toHaveBeenCalled();
        expect(handleRegisterSpy).not.toHaveBeenCalled();
    });

    it('should handle request error', async () => { 
        requestMock.url = '/login';
        const handleLoginSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest').mockRejectedValueOnce(new Error('error message'));

        await sut.startServer();
        
        expect(handleLoginSpy).toHaveBeenCalledTimes(1);
        expect(responseMock.writeHead).toHaveBeenCalledWith(500, JSON.stringify('Internal server error: error message'));
    });
    it('should stop server', async () => {
        serverMock.close.mockImplementationOnce((cb: Function) => cb());
        await sut.startServer();
        await sut.stopServer();
        expect(serverMock.close).toHaveBeenCalledTimes(1);
    });

    it('should fail to close the server if any error occurs', async () => {
        const someError = new Error('some error');
        serverMock.close.mockImplementationOnce((cb: Function) => cb(someError));
        await sut.startServer();
        await expect(sut.stopServer()).rejects.toThrow(someError);
    });    
 });