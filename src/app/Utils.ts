
export class StringUtils {
    public toUpperCase(str: string): string {
        if (!str) {
            throw new Error('Invalid: string cannot be empty');
        }
        return str.toUpperCase();
    }
}


export function toUpperCase(str: string): string {
    return str.toUpperCase();
}

export type stringInfo = {
    lowercase: string,
    uppercase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
}

export function getStringInfo(str: string): stringInfo {
    return {
        lowercase: str.toLowerCase(),
        uppercase: str.toUpperCase(),
        characters: Array.from(str),
        length: str.length,
        extraInfo: {}
    }
}