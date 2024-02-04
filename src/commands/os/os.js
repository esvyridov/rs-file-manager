import { EOL, cpus, homedir, userInfo, arch } from 'node:os'
import { InvalidInputError } from '../../errors.js';

const osFlagRegex = /^os\s(.+)$/;

const osFlags = {
    '--EOL': EOL,
    '--cpus': cpus(),
    '--homedir': homedir(),
    '--username': userInfo().username,
    '--architecture': arch(),
}

export const isOS = (command) => command.startsWith('os');

export const os = (command) => {
    const flagMatch = command.match(osFlagRegex);

    if (!flagMatch) {
        throw new InvalidInputError();
    }
    
    const [, flag] = flagMatch;

    if (!(flag in osFlags)) {
        throw new InvalidInputError();
    }

    console.log(osFlags[flag]);
}