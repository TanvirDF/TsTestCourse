import { calculateComplexity, OtherUtils, toUpperCaseWithCb } from "../../app/doubles/OtherUtils";

//TEST DOUBLES

describe('OtherUtils test suite', () => {
    //STUBS - half implemented object only containing the properties needed for the test
    it('calculates complexity', () => {
        const someInfo = {
            length: 10,
            extraInfo: {
                field1: 'value1',
                field2: 'value2',
            },
        }
      
        const actual = calculateComplexity(someInfo as any);
        expect(actual).toBe(20);
      
    });
    // FAKES - an empty call back function passed without following the function signature 
    it('toUpperCase- calls callback for invalid argument', () => {
        const actual = toUpperCaseWithCb('', () => { });
        expect(actual).toBeUndefined();
    });
    it('toUpperCase- calls callback for valid argument', () => {
        const actual = toUpperCaseWithCb('abc', () => { });
        expect(actual).toBe('ABC');
    });
    // MOCKS - a mock of the function that keeps track of the number of times it was called and the arguments it was called with
    describe('Tracking callbacks with manual mock', () => { 

        let cbArg = []
        let timesCbCalled = 0;
        const mockCallback = (arg: string) => {
            cbArg.push(arg);
            timesCbCalled++;
        }

        afterEach(() => { 
            cbArg = [];
            timesCbCalled = 0;
        }
        );
        it('toUpperCase- calls callback for invalid argument', () => {
            const actual = toUpperCaseWithCb('', mockCallback);
            expect(actual).toBeUndefined();
            expect(timesCbCalled).toBe(1);
            expect(cbArg).toContain('Invalid input');
            expect(cbArg).toEqual(['Invalid input']);
        });
        it('toUpperCase- calls callback for valid argument', () => {
            const actual = toUpperCaseWithCb('abc', (mockCallback));
            expect(actual).toBe('ABC');
            expect(timesCbCalled).toBe(1);
            expect(cbArg).toContain('called function with abc');
            expect(cbArg).toEqual(['called function with abc']);
        });
        
    });
    //MOCKS - with jest.fn() empty function
    describe('Tracking callbacks with jest.fn()', () => {
        afterEach(() => { 
            jest.clearAllMocks();
        });
        const mockCallback = jest.fn();
        it('toUpperCase- calls callback for invalid argument', () => {
            const actual = toUpperCaseWithCb('', mockCallback);
            expect(actual).toBeUndefined();
            expect(mockCallback).toHaveBeenCalledWith('Invalid input');
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });
        it('toUpperCase- calls callback for valid argument', () => {
            const actual = toUpperCaseWithCb('abc', (mockCallback));
            expect(actual).toBe('ABC');
            expect(mockCallback).toHaveBeenCalledWith('called function with abc');
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });
    });
    //SPIES- jest.spyOn() to track calls
    // spies vs mocks
    // - spies are not directly injected into SUT
    // - original functionality is preserved
    // - Spies usually tracks METHODS calls inside objects
    describe('Tracking callbacks with SPIES', () => {
        let sut: OtherUtils;
        beforeEach(() => {
            sut = new OtherUtils();
        });
        test('Use spy to track method calls', () => { 
            const toUpperCaseSpy = jest.spyOn(sut, 'toUpperCase');
            sut.toUpperCase('abc');
            expect(toUpperCaseSpy).toHaveBeenCalledWith('abc');
        });
        test('Use spy to track method calls', () => { 
            const logStringSpy = jest.spyOn(sut, 'logString');
            sut.logString('abc');
            expect(logStringSpy).toHaveBeenCalledWith('abc');
        });
        test('Use spy to track calls to other module', () => { 
            const consoleLogSpy= jest.spyOn(console, 'log');
            sut.logString('abc');
            expect(consoleLogSpy).toHaveBeenCalledWith('abc');
        });
        test('Use spy to replace implementation of a method ', () => { 
            jest.spyOn(sut, 'callExternalService').mockImplementation(() => console.log('calling mocked implementation'));
            sut.callExternalService();

        });
    });

});