import { homedir } from 'node:os';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { isUP, up } from './commands/up.js';
import { isCD, cd } from './commands/cd.js';
import { isLS, ls } from './commands/ls.js';
import { isCAT, cat } from './commands/cat.js';
import { isAdd, add } from './commands/add.js';
import { isRN, rn } from './commands/rn.js';
import { isCP, cp } from './commands/cp.js';
import { isMV, mv } from './commands/mv.js';
import { isRM, rm } from './commands/rm.js';
import { isOS, os } from './commands/os.js';
import { isHash, hash } from './commands/hash.js';
import { isCompress, compress } from './commands/compress.js';
import { isDecompress, decompress } from './commands/decompress.js';
import { InvalidInputError, InvalidOperationError } from './errors.js';

const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: 'Command: '
})

function getShowGoodbyeMessage(username) {
    return () => {
        console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    }
}

function main() {
    const username = process.argv.at(-1).split('=').at(-1);
    let activeDir = homedir();
    const showGoodbyeMessage = getShowGoodbyeMessage(username)

    console.log(`Welcome to the File Manager, ${username}!`);
    console.log(`You are currently in ${activeDir}`);

    process.on('exit', showGoodbyeMessage);

    rl.on('close', () => process.exit(0));
    rl.on('SIGINT', () => process.exit(0));

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

            console.log(`\nYou are currently in ${activeDir}`);
        } catch (err) {
            const operationError = new InvalidOperationError();

            if (err instanceof InvalidInputError || err instanceof InvalidOperationError) {
                console.log(`\nError: ${err.message}`);
            } else {
                console.log(`\nError: ${operationError.message}`);
            }
        }

        rl.prompt();
    });

    rl.prompt();
}

main();
