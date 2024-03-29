import { createReadStream, createWriteStream } from "node:fs";
import { InvalidInputError, InvalidOperationError } from "../../errors.js";
import { resolve as resolvePath } from 'node:path';

const cpArgsRegex = /^cp\s(.+)\s(.+)$/;

export const isCP = (command) => command.startsWith('cp');

export const cp = async (command, activeDir) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pathMath = command.match(cpArgsRegex);
    
            if (!pathMath) {
                reject(InvalidInputError());
            }
            
            const [, oldPath, newPath] = pathMath;
    
            const oldFilePath = resolvePath(activeDir, oldPath);
            const newFilePath = resolvePath(activeDir, newPath);

            const reader = createReadStream(oldFilePath);

            reader.on('error', () => reject(new InvalidOperationError()));
            reader.on('ready', () => {
                const writer = createWriteStream(newFilePath, {
                    flags: 'wx',
                });
    
                writer.on('error', () => reject(new InvalidOperationError()));
                writer.on('finish', resolve);
    
                reader.pipe(writer);
            });
        } catch (err) {
            reject(err);
        }
    })
}
