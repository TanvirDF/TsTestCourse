import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

const mockInsert = jest.fn();
const mockGetBy = jest.fn();
jest.mock('../../../app/server_app/data/DataBase', () => ({
    DataBase: jest.fn().mockImplementation(() => ({
        insert: mockInsert,
        getBy: mockGetBy 
    }))
}));
 

describe('UserCredentialDataAccess test suite', () => { 
    let sut: UserCredentialsDataAccess
    const someAccount = {
        id: '',
        userName: 'test',
        password: 'password'
    };
    const someId = '1234';
    beforeEach(() => { 
        sut = new UserCredentialsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
    });
    afterEach(() => { 
        jest.clearAllMocks();
    });
    it('AddUser - it should add user and return the id', async () => {
        mockInsert.mockResolvedValueOnce(someId);
        const actual = await sut.addUser(someAccount);
        expect(actual).toBe(someId);
        expect(mockInsert).toHaveBeenCalledWith(someAccount);
        
    })
    it(' getUserById- it should get user my id ', async () => {
        mockGetBy.mockResolvedValueOnce(someAccount);
        const actual = await sut.getUserById(someId);
        expect(actual).toBe(someAccount);
        expect(mockGetBy).toHaveBeenCalledWith('id', someId);
    })
    it(' getUserByUserName- it should get user my name ', async () => {
        const testName = 'testName';
        mockGetBy.mockResolvedValueOnce(someAccount);
        const actual = await sut.getUserByUserName(testName);
        expect(actual).toBe(someAccount);
        expect(mockGetBy).toHaveBeenCalledWith('userName', testName);  

    })

})