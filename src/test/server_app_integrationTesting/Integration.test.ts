import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";


describe(' Server app Integration tests', () => { 

    let server: Server;

    const someUser = {
        userName: 'user',
        password: 'pass'
    };
    let authToken;
    let reservationId;

    const someReservation = {
        id: '',
        room: 'room',
        user: 'user',
        startDate: '2021-01-01',
        endDate: '2021-01-02'
    }
    
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
    it('it should reject new user registration with incomplete inputs ', async () => {
        const result = await fetch('http://localhost:8080/register', {
            method: HTTP_METHODS.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.BAD_REQUEST);
        expect(resultBody.userId).toBeUndefined();
        expect(resultBody).toEqual('userName and password required');
        
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
        authToken = resultBody.token;
        
    });
    it('it should not login user with invalid credential', async () => {
        const result = await fetch('http://localhost:8080/login', {
            method: HTTP_METHODS.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...someUser, password: 'invalidPass' })
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.NOT_FOUND);
        expect(resultBody.token).toBeUndefined();
        expect(resultBody).toEqual('wrong username or password');
        
    });
    it('it should not login user with empty or incomplete credential', async () => {
        const result = await fetch('http://localhost:8080/login', {
            method: HTTP_METHODS.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.BAD_REQUEST);
        expect(resultBody.token).toBeUndefined();
        expect(resultBody).toEqual('userName and password required');
        
    });
    it('it should create a reservation', async () => {
        const result = await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
            body: JSON.stringify(someReservation)
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.reservationId).toBeDefined();
        expect(resultBody.reservationId).toEqual(expect.any(String));  
        reservationId = resultBody.reservationId;
    });
    it('it should get a reservation with id', async () => {
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/${reservationId}`, {
            method: HTTP_METHODS.GET,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual({...someReservation, id: reservationId});  
    });
    it('it should reject with invalid reservation id', async () => {
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/invalidID`, {
            method: HTTP_METHODS.GET,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.NOT_FOUND);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual('Reservation with id invalidID not found');
    });  
    it('it should get all reservations', async () => {

        const reservation2 = { ...someReservation, room: 'room2' };
        const reservation3 = { ...someReservation, room: 'room3' };

        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
            body: JSON.stringify(reservation2)
        });
        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
            body: JSON.stringify(reservation3)
        });
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/all`, {
            method: HTTP_METHODS.GET,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual([someReservation, reservation2, reservation3].map(x => ({...x, id: expect.any(String)})));  
    });

    it('it should reject update reservation with invalid fields', async () => { 
        const updateReservation = { door: 'newRoom' };
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/${reservationId}`, {
            method: HTTP_METHODS.PUT,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
            body: JSON.stringify(updateReservation)
        });
        
        const resultBody = await result.json();
        console.log(resultBody);
        expect(result.status).toBe(HTTP_CODES.BAD_REQUEST);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual(`Please provide valid fields to update!`);  
    });
    it('it should reject update reservation with invalid id', async () => { 
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/invalidId`, {
            method: HTTP_METHODS.PUT,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
            body: JSON.stringify({ room: 'newRoom' })
        });
        
        const resultBody = await result.json();
        console.log(resultBody);
        expect(result.status).toBe(HTTP_CODES.NOT_FOUND);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual(`Reservation with id invalidId not found`);  
    });
    it('it should reject update reservation with no id ', async () => { 
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/`, {
            method: HTTP_METHODS.PUT,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
            body: JSON.stringify({})
        });
        
        const resultBody = await result.json();
        console.log(resultBody);
        expect(result.status).toBe(HTTP_CODES.BAD_REQUEST);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual(`Please provide an ID!`);  
    });
    it('it should update a reservation', async () => { 
        const updateReservation = { room: 'newRoom' };
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/${reservationId}`, {
            method: HTTP_METHODS.PUT,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
            body: JSON.stringify(updateReservation)
        });
        
        const resultBody = await result.json();
        console.log(resultBody);
        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual(`Updated ${Object.keys(updateReservation)} of reservation ${reservationId}`);  
    });

    it('it should delete a reservation', async () => { 
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/${reservationId}`, {
            method: HTTP_METHODS.DELETE,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual(`Deleted reservation with id ${reservationId}`);
    });
    it('it should reject reservation delete with invalid reservation id', async () => { 
        const result = await fetch(`http://${process.env.HOST}${process.env.PORT}/reservation/${reservationId}`, {
            method: HTTP_METHODS.DELETE,
            headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
        });
        
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toBeDefined();
        expect(resultBody).toEqual(`Deleted reservation with id ${reservationId}`);
    });

});