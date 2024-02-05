import { EOL, homedir } from 'node:os';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { isUP, up } from './commands/fs/up.js';
import { isCD, cd } from './commands/fs/cd.js';
import { isLS, ls } from './commands/fs/ls.js';
import { isCAT, cat } from './commands/fs/cat.js';
import { isAdd, add } from './commands/fs/add.js';
import { isRN, rn } from './commands/fs/rn.js';
import { isCP, cp } from './commands/fs/cp.js';
import { isMV, mv } from './commands/fs/mv.js';
import { isRM, rm } from './commands/fs/rm.js';
import { isOS, os } from './commands/os/os.js';
import { isHash, hash } from './commands/fs/hash.js';
import { isCompress, compress } from './commands/fs/compress.js';
import { isDecompress, decompress } from './commands/fs/decompress.js';
import { InvalidInputError, InvalidOperationError } from './errors.js';

const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: 'Command: '
})

function getPrintGoodbyeMessage(username) {
    return () => {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    }
}

function printActiveDir(activeDir) {
    console.log(`You are currently in ${activeDir}`);
}

function main() {
    const username = process.argv.at(-1).split('=').at(-1);
    let activeDir = homedir();
    const printGoodbyeMessage = getPrintGoodbyeMessage(username)

    console.log(`Welcome to the File Manager, ${username}!`);
    printActiveDir(activeDir);

    process.on('exit', printGoodbyeMessage);

    rl.on('close', () => process.exit(0));
    rl.on('SIGINT', () => {
        process.stdout.write(EOL);
        process.exit(0)
    });

    rl.on('line', async (command) => {
        try {
            if (isUP(command)) {
                activeDir = up(activeDir);
            } else if (isCD(command)) {
                activeDir = await cd(command, activeDir);
            } else if (isLS(command)) {
                await ls(activeDir);
            } else if (isCAT(command)) {
                await cat(command, activeDir);
            } else if (isAdd(command)) {
                await add(command, activeDir);
            } else if (isRN(command)) {
                await rn(command, activeDir);
            } else if (isCP(command)) {
                await cp(command, activeDir);
            } else if (isMV(command)) {
                await mv(command, activeDir);
            } else if (isRM(command)) {
                await rm(command, activeDir);
            } else if (isOS(command)) {
                os(command);
            } else if (isHash(command)) {
                await hash(command, activeDir);
            } else if (isCompress(command)) {
                await compress(command, activeDir);
            } else if (isDecompress(command)) {
                await decompress(command, activeDir);
            } else if (command === '.exit') {
                rl.close();
            } else {
                throw new InvalidInputError();
            }
        } catch (err) {
            const fallbackError = new InvalidOperationError();

            if (err instanceof InvalidInputError || err instanceof InvalidOperationError) {
                console.error(`Error: ${err.message}`);
            } else {
                console.error(`Error: ${fallbackError.message}`);
            }
        }

        printActiveDir(activeDir);
        rl.prompt();
    });

    rl.prompt();
}

main();
