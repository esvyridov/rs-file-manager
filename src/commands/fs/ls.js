import { readdir } from 'node:fs/promises';
import { InvalidOperationError } from '../../errors.js';

export const isLS = (command) => command === 'ls';

export const ls = async (activeDir) => {
    try {
        const files = await readdir(activeDir, {
            withFileTypes: true,
        });
    
        const toPrint = files
            .filter((file) => file.isDirectory() || file.isFile())
            .map((file) => [file.name, file.isDirectory() ? 'directory' : 'file'])
            .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
            .sort(([, typeA], [, typeB]) => typeA.localeCompare(typeB))
            .map(([name, type]) => ({
                Name: name,
                Type: type
            }));
    
        console.table(toPrint);
    } catch (err) {
        throw new InvalidOperationError();
    }
}