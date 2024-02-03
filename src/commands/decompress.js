import { createReadStream, createWriteStream } from "node:fs";
import { InvalidInputError, InvalidOperationError } from "../errors.js";
import { resolve as resolvePath } from 'node:path';
import { createBrotliDecompress } from "node:zlib";

const decompressArgsRegex = /^decompress\s(.+)\s(.+)$/;

export const isDecompress = (command) => command.startsWith('decompress');

export const decompress = async (command, activeDir) => {
    return new Promise((resolve, reject) => {
        const pathMath = command.match(decompressArgsRegex);
    
        if (!pathMath) {
            reject(InvalidInputError());
        }
        
        const [, filePath, destinationPath] = pathMath;

        const archivePath = resolvePath(activeDir, filePath);
        const fileToDecompressPath = resolvePath(activeDir, destinationPath);

        const brotleDecompresser = createBrotliDecompress();
    
        const reader = createReadStream(archivePath);
        const writer = createWriteStream(fileToDecompressPath);

        reader.on('error', () => reject(new InvalidOperationError()));
        writer.on('error', () => reject(new InvalidOperationError()));
        writer.on('finish', resolve);
    
        reader.pipe(brotleDecompresser).pipe(writer);
    });
}
