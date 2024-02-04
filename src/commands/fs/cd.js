import { stat } from 'node:fs/promises'
import { resolve } from 'node:path';
import { InvalidInputError, InvalidOperationError } from '../../errors.js';

const cdWithArgRegex = /^cd\s(.+)$/;

export const isCD = (command) => command.startsWith('cd');

export const cd = async (command, activeDir) => {
    try {
        const pathMatch = command.match(cdWithArgRegex);

        if (!pathMatch) {
            throw new InvalidInputError();
        }

        const [, path] = pathMatch;

        const nextActiveDir = resolve(activeDir, path);
    
        const nextActiveDirStat = await stat(nextActiveDir);

        if (!nextActiveDirStat.isDirectory()) {
            throw new InvalidOperationError();
        }
    
        return nextActiveDir;
    } catch (err) {
        throw err;
    }
}
