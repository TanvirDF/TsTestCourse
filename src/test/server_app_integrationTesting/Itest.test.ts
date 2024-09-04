import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";


describe(' Server app Integration tests', () => { 

    let server: Server;

    const someUser = {
        userName: 'user',
        password: 'pass'
    };
    
    beforeAll(() => { 
        server = new Server();
        server.startServer();
    });

    afterAll(() => { 
        server.stopServer();
    });

    it('it should register new users', async () => {
        const result = await fetch('http://localhost:8080/register', {
            method: HTTP_METHODS.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(someUser)
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.userId).toBeDefined();
        expect(resultBody).toEqual(expect.objectContaining({userId: expect.any(String)}));
        
    });
    it('it should login the new users', async () => {
        const result = await fetch('http://localhost:8080/login', {
            method: HTTP_METHODS.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(someUser)
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.token).toBeDefined();
        expect(resultBody.token).toEqual(expect.any(String));
        
    });
});