import { createHash } from "node:crypto";
import { InvalidInputError, InvalidOperationError } from "../../errors.js";
import { readFile }  from 'node:fs/promises';
import { resolve } from 'node:path';

const hashArgRegex = /^hash\s(.+)$/;

export const isHash = (command) => command.startsWith('hash');

export const hash = async (command, activePath) => {
    try {
        const pathMath = command.match(hashArgRegex);

        if (!pathMath) {
            throw new InvalidInputError();
        }
        
        const [, path] = pathMath;
    
        const filePath = resolve(activePath, path);

        try {
            const data = await readFile(filePath);
            const hash = createHash('sha256');
            
            hash.update(data);
            console.log(hash.digest('hex'));
        } catch (err) {
            throw new InvalidOperationError();
        }
    } catch (err) {
        throw err;
    }
}
