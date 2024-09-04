import { IncomingMessage } from "http";
import { getRequestBody } from "../../../app/server_app/utils/Utils";

const requestMock = {
    on: jest.fn(),
}

const someObject = {
    name: 'some name',
    age: 10,
    city: 'some city'
} 

const someObjectString = JSON.stringify(someObject);


describe('GetRequestBody test suite', () => {

    it(' should return object for valid json', async () => {
        requestMock.on.mockImplementation((event, cb) => {
            if (event === 'data') {
                cb(someObjectString)
            } else {
                cb()
            }
        })

        const actual = await getRequestBody(requestMock as any as IncomingMessage);

        expect(actual).toEqual(someObject);
     })
    it(' should throw error for invalid json', async () => {
        requestMock.on.mockImplementation((event, cb) => {
            if (event === 'data') {
                cb( 'a' + someObjectString)
            } else {
                cb()
            }
        })

        const actual = getRequestBody(requestMock as any as IncomingMessage);
        expect(actual).rejects.toThrow();
     })
    it(' should throw error for unexpected error', async () => {
        const someError = new Error('some error');
        requestMock.on.mockImplementation((event, cb) => {
            
            if (event === 'error') {
                cb(someError)
            }
        });
        
        await expect(getRequestBody(requestMock as any as IncomingMessage)).rejects.toThrow(someError.message);
     })
    
})