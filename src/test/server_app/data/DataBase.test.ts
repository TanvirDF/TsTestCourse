import { DataBase } from '../../../app/server_app/data/DataBase';
import * as generateRandomId  from '../../../app/server_app/data/IdGenerator';

type someTestType = {
    id: string;
    name: string;
    color: string;
}


jest.mock('../../../app/server_app/data/IdGenerator', () => ({
        generateRandomId: jest.fn().mockReturnValue('1234')
    }));


describe('DataBase test suite', () => { 
    let sut: DataBase<someTestType>;
    const someElement = { id: '', name: 'test', color: 'red' };
    const someElement2 = { id: '', name: 'test2', color: 'red' };
    const someElement3 = { id: '', name: 'test3', color: 'green' };

    beforeEach(() => {
        sut = new DataBase(); 
        // jest.spyOn(generateRandomId, 'generateRandomId').mockReturnValue('1234');

    });

    it('insert- should insert element and return id', async () => { 
        const element = { id: ''} as any;

        const actual = await sut.insert(element);
        expect(actual).toBe('1234');
        expect(sut['elements']).toContain(element);

    });
    it('getBy- should return element by key', async () => { 
        const id = await sut.insert(someElement);
        const actual = await sut.getBy('id', id);
        expect(actual).toBe(someElement);

    });
    it('findAllBy- find all elements by same key', async () => { 
            await sut.insert(someElement);
            await sut.insert(someElement2);
            const expected = [someElement, someElement2];
            const actual = await sut.findAllBy('color', 'red');
            expect(actual).toEqual(expected);
    });
    it('update- should update element by id', async () => { 
        const id = await sut.insert(someElement);
        const expected = 'blue';
        await sut.update(id, 'color', expected);
        await sut.getBy('id', id);
        expect(someElement.color).toBe(expected);
    });

    it('delete- should delete element by id', async () => { 
        const id = await sut.insert(someElement);
        await sut.delete(id);
        const elementId = await sut.getBy('id', id);
        expect(elementId).toBeUndefined();
    });
    it('getAllElements- should return all elements', async () => { 
        await sut.insert(someElement);
        await sut.insert(someElement2);
        await sut.insert(someElement3);
        const expected = [someElement, someElement2, someElement3];
        const actual = await sut.getAllElements();
        expect(actual).toEqual(expected);
    });
        
});