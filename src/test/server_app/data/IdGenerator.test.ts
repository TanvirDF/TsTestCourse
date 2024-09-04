import { generateRandomId } from '../../../app/server_app/data/IdGenerator';
// import { randomBytes } from 'crypto'

// jest.mock('crypto', () => ({
//     randomBytes: jest.fn(() => ({ toString: jest.fn(() => '1234') }))
// }));

// describe('IdGenerator test suite with mock', () => {
//     it('generateRandomId - it should generate random id', () => {
//         const actual = generateRandomId();
//         expect(actual).toBe('1234');
//         expect(randomBytes).toHaveBeenCalledTimes(1);
//     });
// });

// ;

describe('IdGenerator test suite with spyOn', () => { 
    afterEach(() => { 
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('generateRandomId - it should generate random id', () => {
        jest.spyOn(require('crypto'), 'randomBytes').mockImplementation(() => ('1234'));
        const actual = generateRandomId();
        expect(actual).toBe('1234');
        expect(require('crypto').randomBytes).toHaveBeenCalledTimes(1);
    });
});