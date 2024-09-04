import { IncomingMessage, ServerResponse } from "http";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Authorizer } from '../../../app/server_app/auth/Authorizer';
import { Account } from '../../../app/server_app/model/AuthModel';
import { HTTP_CODES, HTTP_METHODS } from '../../../app/server_app/model/ServerModel';
import { getRequestBody } from '../../../app/server_app/utils/Utils';
import { ReservationsDataAccess } from '../../../app/server_app/data/ReservationsDataAccess';


const getRequestBodyMock = jest.fn();

jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}));


describe('ReservationsHandler test suite', () => { 
    let sut: ReservationsHandler;

    const requestMock = {
        method: undefined,
        headers: {
            authorization: ''
        },
        url: undefined
    };

    const responseMock = {
        statusCode: undefined,
        write: jest.fn(),
        writeHead: jest.fn(),
    };

    const authorizerMock = {
        validateToken: jest.fn()
    };
    const reservationsDataAccessMock = {
        createReservation: jest.fn(),
        getAllReservations: jest.fn(),
        getReservation: jest.fn(),
        updateReservation: jest.fn(),
        deleteReservation: jest.fn()
    };

    const SomeReservation = {
        id: "123",
        room: "A101",
        user: "John Doe",
        startDate: "2022-01-01",
        endDate: ""
    };

    const someReservationId = '1234';

    const updatedReservation = {
        room: 'A102',
        endDate: '2022-01-02'
    };


    beforeEach(() => { 
        sut = new ReservationsHandler(requestMock as any as IncomingMessage, responseMock as any as ServerResponse, authorizerMock as any as Authorizer, reservationsDataAccessMock as any as ReservationsDataAccess);
    });

    afterEach(() => { 
        jest.clearAllMocks();
        responseMock.statusCode = 0;
        requestMock.url = undefined;
    });

    describe('handleRequest when authorized', () => {
        beforeEach(() => {
            requestMock.headers.authorization = '123';
            authorizerMock.validateToken.mockResolvedValueOnce(true);
        });

        describe('POST request', () => {
            beforeEach(() => {
                requestMock.method = HTTP_METHODS.POST;
            });
            it('should create a reservation with valid reservation', async () => {
                getRequestBodyMock.mockResolvedValueOnce(SomeReservation);
                reservationsDataAccessMock.createReservation.mockResolvedValueOnce(someReservationId);

                await sut.handleRequest();

                expect(getRequestBodyMock).toHaveBeenCalledTimes(1);
                expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
                expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify({ reservationId: someReservationId }));

            });
            it('should return bad request with invalid reservation', async () => {
                getRequestBodyMock.mockResolvedValueOnce({});

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'));
            });
            it('should return 400 with invalid reservation object', async () => { 
                getRequestBodyMock.mockResolvedValueOnce({ door: 'A101' });

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'));
            });

        });

        describe('GET request', () => {
            beforeEach(() => {
                requestMock.method = HTTP_METHODS.GET;
            });
            it('should return all reservations for /all request', async () => {
                requestMock.url = '/reservations/all';
                const allReservations = [SomeReservation, SomeReservation, SomeReservation];
                reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce(allReservations);

                await sut.handleRequest();

                expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(allReservations));
            });
            it('should return all reservations for /all request with spy', async () => {

                jest.spyOn(sut as any, 'getIdFromUrl').mockReturnValueOnce('all');
                const allReservations = [SomeReservation, SomeReservation, SomeReservation];
                reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce(allReservations);

                await sut.handleRequest();

                expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(allReservations));
            });

            it('should return reservation by id if found', async () => {
                requestMock.url = '/reservations/1234';
                reservationsDataAccessMock.getReservation.mockResolvedValueOnce(SomeReservation);

                await sut.handleRequest();

                expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(SomeReservation));
            });
            it('should return not found if reservation not found by id', async () => {
                requestMock.url = '/reservations/1234';
                reservationsDataAccessMock.getReservation.mockResolvedValueOnce(null);

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_FOUND);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id 1234 not found`));
            });
            it('should return not found if Id is not valid', async () => {
                requestMock.url = '/reservations/invalid';

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_FOUND);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id invalid not found`));
            });
            it('should return 400 when id not provided', async () => {
                requestMock.url = '/reservations/';

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!'));
             });

        });
        describe('PUT request', () => {

            beforeEach(() => {
                requestMock.method = HTTP_METHODS.PUT;
            });

            it('should update reservation with valid reservation', async () => {
                requestMock.url = `/reservations/${someReservationId}`;
                reservationsDataAccessMock.getReservation.mockResolvedValueOnce(SomeReservation);
                getRequestBodyMock.mockResolvedValueOnce(updatedReservation);
                const spy = jest.spyOn(sut as any, 'getIdFromUrl');

                await sut.handleRequest();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(someReservationId, 'room', 'A102');
                expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(someReservationId, 'endDate', '2022-01-02');
                expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledTimes(Object.keys(updatedReservation).length);
                expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Updated ${Object.keys(updatedReservation)} of reservation ${someReservationId}`));

            });

            it('should return bad request with empty reservation', async () => {
                requestMock.url = `/reservations/${someReservationId}`;
                reservationsDataAccessMock.getReservation.mockResolvedValueOnce(SomeReservation);
                getRequestBodyMock.mockResolvedValueOnce({});

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide valid fields to update!'));

            });
            it('should return bad request with invalid reservation key', async () => {
                requestMock.url = `/reservations/${someReservationId}`;
                reservationsDataAccessMock.getReservation.mockResolvedValueOnce(SomeReservation);
                getRequestBodyMock.mockResolvedValueOnce({ door: 'A102' });

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide valid fields to update!'));

            });

            it('should return not found with invalid id', async () => {
                requestMock.url = '/reservations/invalid';

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_FOUND);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id invalid not found`));

            });
            it('should return 400 if id not provided ', async () => {
                requestMock.url = '/reservations/';

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!'));
            });
        });

        describe('DELETE request', () => {
            beforeEach(() => {
                requestMock.method = HTTP_METHODS.DELETE;
            });

            it('should delete reservation with valid id', async () => {
                requestMock.url = `/reservations/${someReservationId}`;
                const spy = jest.spyOn(sut as any, 'getIdFromUrl');

                await sut.handleRequest();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(reservationsDataAccessMock.deleteReservation).toHaveBeenCalledWith(someReservationId);
                expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(`Deleted reservation with id ${someReservationId}`));

            });
            it('should return bad request for invalid id', async () => {

                requestMock.url = '/reservations/';

                await sut.handleRequest();

                expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
                expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify( 'Please provide an ID!'));


            });
        });
        describe('Invalid request', () => {
            it('should return nothing for invalid method', async () => {
                requestMock.method = 'INVALID';

                await sut.handleRequest();

                expect(responseMock.write).not.toHaveBeenCalled();
                expect(responseMock.writeHead).not.toHaveBeenCalled();
                
            });
        });
    });

    describe('handleRequest when unauthorized', () => {
        beforeEach(() => {
            requestMock.headers.authorization = undefined;
        });

        it('should return unauthorized operation', async () => {
            // authorizerMock.validateToken.mockResolvedValueOnce(false);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify('Unauthorized operation!'));
         });
    });

    
});