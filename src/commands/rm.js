import { InvalidInputError, InvalidOperationError } from "../errors.js";
import { rm as fsRM }  from 'node:fs/promises';
import { resolve } from 'node:path';

const rmArgRegex = /^rm\s(.+)$/;

export const isRM = (command) => command.startsWith('rm');

export const rm = async (command, activePath) => {
    try {
        const pathMath = command.match(rmArgRegex);

        if (!pathMath) {
            throw new InvalidInputError();
        }
        
        const [, path] = pathMath;
    
        const filePath = resolve(activePath, path);
    
        try {
            await fsRM(filePath);
        } catch (err) {
            throw new InvalidOperationError();
        }
    } catch (err) {
        throw err;
    }
}
