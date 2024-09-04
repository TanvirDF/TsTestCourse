import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { DataBase } from "../../../app/server_app/data/DataBase";

const mockInsert = jest.fn();
const mockGetBy = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockGetAll = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => ({
    DataBase: jest.fn().mockImplementation(() => ({
        insert: mockInsert,
        getBy: mockGetBy,
        update: mockUpdate,
        delete: mockDelete,
        getAllElements: mockGetAll
    }))
}));

describe('ReservationsDataAccess test suite', () => { 
    let reservationsDataAccess: ReservationsDataAccess;

    const someReservation= {
        id: '',
        room: '1234',
        user: 'test',
        startDate: '',
        endDate: '' 
    } 


    beforeEach(() => {
        reservationsDataAccess = new ReservationsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('createReservation- it should create a reservation and return the id', async () => { 
        mockInsert.mockResolvedValueOnce('1234');
        const actual = await reservationsDataAccess.createReservation(someReservation);
        expect(actual).toBe('1234');
        expect(mockInsert).toHaveBeenCalledWith(someReservation);
    });
    it('updateReservation- should update reservation', async () => {
        await reservationsDataAccess.updateReservation( someReservation.id, 'id', 'test');
        expect(mockUpdate).toHaveBeenCalledWith(someReservation.id, 'id', 'test');
    });
    it('deleteReservation-  should delete reservation ', async () => {
        await reservationsDataAccess.deleteReservation(someReservation.id);
        expect(mockDelete).toHaveBeenCalledWith(someReservation.id);
    });
    it('getReservation- should get reservation by id', async () => {
        mockGetBy.mockResolvedValueOnce(someReservation);
        const actual = await reservationsDataAccess.getReservation(someReservation.id);
        expect(actual).toBe(someReservation);
        expect(mockGetBy).toHaveBeenCalledWith('id', someReservation.id);
    });
    
    it('getAllReservations- should get all reservations', async () => {
        const someReservation2 = {
            id: '',
            room: '1234',
        }
        const someReservation3 = {
            id: '',
            room: '1234',
        }
        const expected = [someReservation, someReservation2, someReservation3];
        mockGetAll.mockResolvedValueOnce(expected);
        const actual = await reservationsDataAccess.getAllReservations();
        expect(actual).toBe(expected);
        expect(mockGetAll).toHaveBeenCalledTimes(1);
     });

        
    
});

