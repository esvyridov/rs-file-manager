import { InvalidInputError, InvalidOperationError } from "../errors.js";
import { rename }  from 'node:fs/promises';
import { resolve } from 'node:path';

const rnArgsRegex = /^rn\s(.+)\s(.+)$/;

export const isRN = (command) => command.startsWith('rn');

export const rn = async (command, activeDir) => {
    try {
        const pathMath = command.match(rnArgsRegex);

        if (!pathMath) {
            throw new InvalidInputError();
        }
        
        const [, oldPath, newPath] = pathMath;

        const oldFilePath = resolve(activeDir, oldPath);
        const newFilePath = resolve(activeDir, newPath);
    
        try {
            await rename(oldFilePath, newFilePath);
        } catch (err) {
            throw new InvalidOperationError();
        }
    } catch (err) {
        throw err;
    }
}
