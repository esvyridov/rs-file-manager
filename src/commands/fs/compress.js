import { createReadStream, createWriteStream } from "node:fs";
import { InvalidInputError, InvalidOperationError } from "../../errors.js";
import { resolve as resolvePath } from 'node:path';
import { createBrotliCompress } from "node:zlib";

const compressArgsRegex = /^compress\s(.+)\s(.+)$/;

export const isCompress = (command) => command.startsWith('compress');

export const compress = async (command, activeDir) => {
    return new Promise((resolve, reject) => {
        const pathMath = command.match(compressArgsRegex);
    
        if (!pathMath) {
            reject(InvalidInputError());
        }
        
        const [, filePath, destinationPath] = pathMath;

        const fileToCompressPath = resolvePath(activeDir, filePath);
        const archivePath = resolvePath(activeDir, destinationPath);

        const brotliCompresser = createBrotliCompress();
    
        const reader = createReadStream(fileToCompressPath);
        const writer = createWriteStream(archivePath, {
            flags: 'wx',
        });

        reader.on('error', () => reject(new InvalidOperationError()));
        writer.on('error', () => reject(new InvalidOperationError()));
        writer.on('finish', resolve);
    
        reader.pipe(brotliCompresser).pipe(writer);
    });
}
