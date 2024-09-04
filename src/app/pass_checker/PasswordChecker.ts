
export enum PasswordError {
    TOO_SHORT = 'Password is too short',
    NO_UPPERCASE = 'Password must contain at least one uppercase letter',
    NO_LOWERCASE = 'Password must contain at least one lowercase letter',
    NO_SPECIAL_CHARACTER = 'Admin password must contain at least one special character'
}


export interface PassCheckResult {
    valid: boolean;
    reasons: PasswordError[];
}

export class PasswordChecker {

    public checkPassword(pass: string): PassCheckResult {
        const reasons: PasswordError[] = [];
        this.checkForCorrectLength(pass, reasons);
        this.checkForUpperCase(pass, reasons);
        this.checkForLowerCase(pass, reasons);
        return {
            valid: reasons.length>0 ? false: true,
            reasons: reasons
        };
        
    }

    public checkAdminPassword(pass: string): PassCheckResult {
        const basicCheck = this.checkPassword(pass);
        const reasons = basicCheck.reasons;
        this.checkForSpecialCharacter(pass, reasons);
        return {
            valid: reasons.length>0 ? false: true,
            reasons: reasons
        };
    }

    private checkForCorrectLength(pass: string , reasons: PasswordError[]) {
        if (pass.length < 8) {
            reasons.push(PasswordError.TOO_SHORT);
        }
    }
    private checkForUpperCase(pass: string, reasons: PasswordError[]) {
        const hasUppercase = /[A-Z]/.test(pass);
        if (!hasUppercase) {
            reasons.push(PasswordError.NO_UPPERCASE);
        }
    }
    private checkForLowerCase(pass: string, reasons: PasswordError[]) {
        const hasLowercase = /[a-z]/.test(pass);
        if (!hasLowercase) {
            reasons.push(PasswordError.NO_LOWERCASE);
        }
    }

    private checkForSpecialCharacter(pass: string, reasons: PasswordError[]) {
        const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pass);
        if (!hasSpecialCharacter) {
            reasons.push(PasswordError.NO_SPECIAL_CHARACTER);
        }
    }

}