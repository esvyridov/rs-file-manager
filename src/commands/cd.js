import { stat } from 'node:fs/promises'
import { resolve } from 'node:path';
import { InvalidInputError, InvalidOperationError } from '../errors.js';

const cdWithArgRegex = /^cd\s(.+)$/;

export const isCD = (command) => command.startsWith('cd');

export const cd = async (command, activeDir) => {
    try {
        const pathMatch = command.match(cdWithArgRegex);

        if (!pathMatch) {
            throw new InvalidInputError();
        }

        const [, path] = pathMatch;

        const newActiveDir = resolve(activeDir, path);
    
        const newActiveDirStat = await stat(newActiveDir);

        if (!newActiveDirStat.isDirectory()) {
            throw new InvalidOperationError();
        }
    
        return newActiveDir;
    } catch (err) {
        throw err;
    }
}
