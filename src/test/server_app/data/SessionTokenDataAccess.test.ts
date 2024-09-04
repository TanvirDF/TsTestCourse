import { SessionTokenDataAccess } from '../../../app/server_app/data/SessionTokenDataAccess';
import { DataBase } from '../../../app/server_app/data/DataBase';


const mockInsert = jest.fn();
const mockGetBy = jest.fn();
const mockUpdate = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => ({
    DataBase: jest.fn().mockImplementation(() => ({
        insert: mockInsert,
        getBy: mockGetBy,
        update: mockUpdate
    }))
}));


describe('SessionTokenDataAccess test suite', () => { 

    let sessionTokenDataAccess: SessionTokenDataAccess;
    const someToken = {
        id: '',
        userName: 'test',
        valid: true,
        expirationDate: ''
    };
    const someAccount = {
        id: '',
        userName: 'test',
        password: 'password'
    }
    const someTokenId = '1234';    
    beforeEach(() => {
        sessionTokenDataAccess = new SessionTokenDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('generateToken - it should generate token and return the id', async () => {
        mockInsert.mockResolvedValueOnce(someTokenId);
        const actual = await sessionTokenDataAccess.generateToken(someAccount);
        expect(actual).toBe(someTokenId);
        expect(mockInsert).toHaveBeenCalledWith({
            id: '',
            userName: someAccount.userName,
            valid: true,
            expirationDate: expect.any(Date)
        });
    });
    it('invalidateToken - it should invalidate token', async () => {
        await sessionTokenDataAccess.invalidateToken(someTokenId);
        expect(mockUpdate).toHaveBeenCalledWith(someTokenId, 'valid', false);
    });
    it('isValidToken - it should return true if token is valid', async () => {
        mockGetBy.mockResolvedValueOnce(someToken);
        const actual = await sessionTokenDataAccess.isValidToken(someTokenId);
        expect(actual).toBe(true);
        expect(mockGetBy).toHaveBeenCalledWith('id', someTokenId);
    });
    it('isValidToken - it should return false if token is invalid', async () => {
        mockGetBy.mockResolvedValueOnce(undefined);
        const actual = await sessionTokenDataAccess.isValidToken(someTokenId);
        expect(actual).toBe(false);
        expect(mockGetBy).toHaveBeenCalledWith('id', someTokenId);
    });
    it('generateExpirationTime', async () => {
        const actual = sessionTokenDataAccess['generateExpirationTime']();
        expect(actual).toEqual(expect.any(Date));
     });

});