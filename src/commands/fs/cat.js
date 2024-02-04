import { InvalidInputError, InvalidOperationError } from "../../errors.js";
import { createReadStream }  from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { EOL } from 'node:os';

const catArgRegex = /^cat\s(.+)$/;

export const isCAT = (command) => command.startsWith('cat');

export const cat = (command, activePath) => {
    return new Promise((resolve, reject) => {
        try {
            const pathMatch = command.match(catArgRegex);
        
            if (!pathMatch) {
                throw new InvalidInputError();
            }

            const [, path] = pathMatch;
        
            const filePath = resolvePath(activePath, path);
            const reader = createReadStream(filePath);

            reader.on('end', () => {
                process.stdout.write(EOL);
                resolve()
            });
            reader.on('error', () => reject(new InvalidOperationError()));
        
            reader.pipe(process.stdout);
        } catch (err) {
            reject(err);
        }
    })
}
