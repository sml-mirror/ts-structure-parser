export function testFunction(): string | void {
    console.log("test function");
}

export function testFunctionWithNumberSingleType(params1: Promise<number>[]): number {
    console.log("test function");
    return 22;
}

export async function testAsyncFunction (params1: string, params2?: number) {
    console.log('async test function')
    return 23;
}
export async function testAsyncFunctionWithReturnValue (params1: string, params2?: number): Promise<number> {
    console.log('async test function')
    return 23;
}

export async function testAsyncFunctionWithReturnMixValue (params1: string, params2?: number): Promise<number | string> {
    console.log('async test function')
    return 23;
}

function notExportNotAsyncFunction () {};

export const arrowFunctionLikeVariable = (): string => { return '123'};

const arrowNotExportFunction = () => {};

export const arrowAsyncFunctionLikeVariable = async (params1: string): Promise<number> => { return 12;};

const arrowNotExportFunctionWithMixReturnValue = (): Promise<void | null | string> => { return null; };

export class TestClassWithFunc {
    static func = () => {

    };

    async func1() {

    };

}
