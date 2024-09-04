import { v4 } from "uuid";



export type stringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
};


export function calculateComplexity(stringInfo: stringInfo) {
    return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
};

type LoggerServiceCallback = (message: string) => void;

export function toUpperCaseWithCb(arg: string, callback: LoggerServiceCallback): string {
    if (!arg) {
        callback('Invalid input');
        return
    }
    callback(`called function with ${arg}`);
    return arg.toUpperCase();
}

export function toUpperCase(arg: string): string { 
    return arg.toUpperCase();
}

export function toLowerCaseWithId(arg: string): string {
    return arg.toLowerCase() + v4();
}   


export class OtherUtils{
    public toUpperCase(arg: string): string {
        return arg.toUpperCase();
    }
    public logString( arg: string){
        console.log(arg);
    }

    public callExternalService() {
        console.log('calling external service!!!');
    }
}