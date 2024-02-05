import { createReadStream, createWriteStream } from "node:fs";
import { InvalidInputError, InvalidOperationError } from "../../errors.js";
import { resolve as resolvePath } from 'node:path';
import { rm } from "node:fs/promises";

const mvArgsRegex = /^mv\s(.+)\s(.+)$/;

export const isMV = (command) => command.startsWith('mv');

export const mv = async (command, activeDir) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pathMath = command.match(mvArgsRegex);
    
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
    
                writer.on('finish', async () => {
                    try {
                        await rm(oldFilePath, {
                            force: true,
                        });
                        resolve();
                    } catch (err) {
                        reject(new InvalidOperationError());
                    }                
                });
                writer.on('error', () => reject(new InvalidOperationError()));
    
                reader.pipe(writer);
            });
        } catch (err) {
            reject(err);
        }
    })
}
