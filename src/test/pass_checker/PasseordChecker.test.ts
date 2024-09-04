import { PasswordChecker } from '../../app/pass_checker/PasswordChecker'; 
import { PasswordError } from '../../app/pass_checker/PasswordChecker';
/**
 * A password is invalid if:
 * - length is less than 8 characters
 * - contains no upper case letter
 * - contains no lower case letter
 * 
 * Requirement 2:
 * - Return the reason why the password is invalid
 *  Requirement 3:
 * - refactor
 * - admin password should contain at least one special character
 */
    

describe('PasswordCheker', () => {
    let sut: PasswordChecker;

    beforeEach(() => {
        sut = new PasswordChecker();
    });

    it('password less than 8 characters is invalid', () => { 
        const actual = sut.checkPassword('1234567');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordError.TOO_SHORT);
    })
    it('password more than 8 characters is ok', () => { 
        const actual = sut.checkPassword('12345678');
        expect(actual.reasons).not.toContain(PasswordError.TOO_SHORT);
    })
    it('password with no upper case letter is invalid', () => {
        const actual = sut.checkPassword('addgf')
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordError.NO_UPPERCASE);
    })
    it('password with upper case letter is ok', () => {
        const actual = sut.checkPassword('agfAA')
        expect(actual.reasons).not.toContain(PasswordError.NO_UPPERCASE);
    })
    it('password with no lower case letter is invalid', () => {
        const actual = sut.checkPassword('DGF')
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordError.NO_LOWERCASE);
    })
    it('password with lower case letter is invalid', () => {
        const actual = sut.checkPassword('AGFaa')
        expect(actual.reasons).not.toContain(PasswordError.NO_LOWERCASE);
    })

    it('complex password is valid', () => {
        const actual = sut.checkPassword('AGFaa1234')
        expect(actual.valid).toBe(true);
        expect(actual.reasons).toHaveLength(0);
    })
    it('Admin password without any special character is invalid', () => {
        const actual = sut.checkAdminPassword('AGFaas1232')
        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordError.NO_SPECIAL_CHARACTER)
    })
    it('Admin password with special character is valid', () => {
        const actual = sut.checkAdminPassword('AGFaas1232!')
        expect(actual.reasons).not.toContain(PasswordError.NO_SPECIAL_CHARACTER)
    })
    it('complex  admin password is valid', () => {
        const actual = sut.checkAdminPassword('AGFaa1234!!')
        expect(actual.valid).toBe(true);
        expect(actual.reasons).toHaveLength(0);
    })
    


 })