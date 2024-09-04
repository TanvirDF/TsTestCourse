import { StringUtils, toUpperCase } from "../app/Utils";
import { getStringInfo } from "../app/Utils";



describe('Utils test suits', () => { 

    describe('stringUtils class test', () => {
        let sut: StringUtils;
        beforeEach(() => {
            sut = new StringUtils();
        });

        afterEach(() => {
            //clearing mocks
            console.log('clearing mocks');

        });

        beforeAll(() => {
            //run before all tests i.e connecting to a database
        });

        afterAll(() => {
            //run after all tests i.e disconnecting from a database
        });
        

        it(' class.toUppercase should return uppercase string', () => {
            
            const actual = sut.toUpperCase('hello');
            expect(actual).toBe('HELLO');
        });
        // Testing error throws
        it('should throw error when string is empty - function', () => {
            function expectError() {
                sut.toUpperCase('');
            }
            expect(expectError).toThrow('Invalid: string cannot be empty');
            
        });
        it('should throw error when string is empty - arrow function', () => {
            expect(()=>{sut.toUpperCase('')}).toThrow('Invalid: string cannot be empty');
            
        });
        it('should throw error when string is empty - try catch block', () => {
            try {
                sut.toUpperCase('');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Invalid: string cannot be empty');
            }
        });

    });

    it('should return uppercase string', () => {
        //arrange
        const sut = toUpperCase;
        const expected = 'HELLO';
        //act
        const actual = sut('hello');
        //assert
        expect(actual).toBe(expected);
    });

    describe('toUpperCase example of each', () => {
        it.each([
            { input: 'hello', expected: 'HELLO' },
            { input: 'world', expected: 'WORLD' },
            { input: 'hello-world', expected: 'HELLO-WORLD' },
            {input: 'My-String', expected: 'MY-STRING'}
        ])('$input should return $expected', ({ input, expected }) => {
            const actual = toUpperCase(input);
            expect(actual).toBe(expected);
        });
     });

    describe('getStringInfo test suits for Hello-world should', () => {
        test('return uppercase', () => { 
            const actual = getStringInfo('Hello-world').uppercase;
            expect(actual).toBe('HELLO-WORLD');
        });
        test('return lowercase', () => {
            const actual = getStringInfo('Hello-world').lowercase;
            expect(actual).toBe('hello-world');
        });
        test('return characters', () => {
            const actual = getStringInfo('Hello-world').characters;
            expect(actual).toEqual(['H', 'e', 'l', 'l', 'o', '-', 'w', 'o', 'r', 'l', 'd']);
        });
        test('return length', () => {
            const actual = getStringInfo('Hello-world').length;
            expect(actual).toBe(11);
        });
        test('return extraInfo', () => {
            const actual = getStringInfo('Hello-world').extraInfo;
            expect(actual).toEqual({});
        });
    });
});
