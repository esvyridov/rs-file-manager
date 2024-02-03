import { InvalidInputError, InvalidOperationError } from "../errors.js";
import { writeFile }  from 'node:fs/promises';
import { resolve } from 'node:path';

const addArgRegex = /^add\s(.+)$/;

export const isAdd = (command) => command.startsWith('add');

export const add = async (command, activePath) => {
    try {
        const pathMath = command.match(addArgRegex);

        if (!pathMath) {
            throw new InvalidInputError();
        }
        
        const [, path] = pathMath;
    
        const filePath = resolve(activePath, path);
    
        try {
            await writeFile(filePath, '', {
                flag: 'wx'
            });
        } catch (err) {
            throw new InvalidOperationError();
        }
    } catch (err) {
        throw err;
    }
}
