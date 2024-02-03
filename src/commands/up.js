import { resolve } from 'node:path';
import { InvalidOperationError } from '../errors.js';

export const isUP = (command) => command === 'up';

export const up = (activeDir) => {
    try {
        return resolve(activeDir, '..');
    } catch (err) {
        throw InvalidOperationError();
    }
}