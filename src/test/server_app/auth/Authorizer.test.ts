
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

// const mockIsValidToken = jest.fn();
// jest.mock('../../../app/server_app/data/SessionTokenDataAccess', () => ({ 
//     SessionTokenDataAccess: jest.fn().mockImplementation(() => ({
//         isValidToken: mockIsValidToken,
//     }))
// }));    

jest.mock('../../../app/server_app/data/SessionTokenDataAccess');    
jest.mock('../../../app/server_app/data/UserCredentialsDataAccess');


describe('Authorizer test suite', () => { 
    let authorizer: Authorizer;

    const userName = 'test';
    const password = 'password';
    const tokenId = '1234';


    beforeEach(() => {
        authorizer = new Authorizer();
        expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
        expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
    });

    afterEach(() => { 
        jest.clearAllMocks();
    });
    
    // it('validateToken using jest.fn()- it should return true for valid token', async () => {
    //     const tokenId = '1234';
    //     const expected = true;
    //     mockIsValidToken.mockResolvedValueOnce(expected);
    //     const actual = await authorizer.validateToken(tokenId);
    //     expect(actual).toBe(expected);
    //     expect(mockIsValidToken).toHaveBeenCalledWith(tokenId);
    // });
    
    it('validateToken using spy- it should return true for valid token', async () => { 
        
        const expected = true;
        const validateTokenSpy = jest.spyOn(SessionTokenDataAccess.prototype, 'isValidToken').mockResolvedValueOnce(expected);

        const actual = await authorizer.validateToken(tokenId);

        expect(validateTokenSpy).toHaveBeenCalledWith(tokenId);
        expect(actual).toBe(expected); 
    });

    it('validateToken- it should return false for invalid token', async () => { });
    
    it('registerUser - it should return userId when a user is added', async () => { 
        
        const expected = '1234';
        const addUserSpy = jest.spyOn(UserCredentialsDataAccess.prototype, 'addUser').mockResolvedValueOnce(expected);

        const actual = await authorizer.registerUser(userName, password);

        expect(addUserSpy).toHaveBeenCalledWith({id: '', password, userName});
        expect(actual).toBe(expected);
    });

    it('login - it should return tokenId when user is logged in', async () => { 

        const someUser = {
            id: '1234',
            userName,
            password
        };
        const getUserByUserNameSpy = jest.spyOn(UserCredentialsDataAccess.prototype, 'getUserByUserName').mockResolvedValueOnce(someUser);

        const generateTokenSpy = jest.spyOn(SessionTokenDataAccess.prototype, 'generateToken').mockResolvedValueOnce(tokenId);

        const actual = await authorizer.login(userName, password);

        expect(getUserByUserNameSpy).toHaveBeenCalledWith(userName);
        expect(generateTokenSpy).toHaveBeenCalledWith(someUser);
        
        expect(actual).toBe(tokenId);


    });

    it('login - it should return undefined when user is not found');

    it('logOut - it should invalidate token', async () => { 
        const invalidateTokenSpy = jest.spyOn(SessionTokenDataAccess.prototype, 'invalidateToken');
        await authorizer.logout(tokenId);
        expect(invalidateTokenSpy).toHaveBeenCalledWith(tokenId);
    });
    

})