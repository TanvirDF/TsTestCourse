
//MOCKING MODULES
jest.mock('../../app/doubles/OtherUtils', () => ({ 
    ...jest.requireActual('../../app/doubles/OtherUtils'),
    calculateComplexity: jest.fn(() => 20)
}));

jest.mock('uuid', () => ({ 
    v4: jest.fn(() => '1234')
}));

import { calculateComplexity, toLowerCaseWithId } from '../../app/doubles/OtherUtils';


describe('module test', () => {
    test('calculate complexity', () => { 
        const actual = calculateComplexity({} as any);
        expect(actual).toBe(20);
    });
    test('string with id', () => { 
        const actual = toLowerCaseWithId('abc');
        expect(actual).toBe('abc1234');
    });
 });