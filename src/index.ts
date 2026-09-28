import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { json, text } from "node:stream/consumers";

import type { MediaInfo } from "./types.ts";
export type * from './types.ts';

/**
 * Error raised when ffprobe starts but exits unsuccessfully or is terminated
 * by a signal.
 */
export class ProbeError extends Error {
    code;
    signal;
    stderr?: string;
    constructor(message: string, code: number | null, signal: NodeJS.Signals | null) {
        super(message);
        this.code = code;
        this.signal = signal;
    }
}

function execute(command: string, args: string[]) {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    const promise = new Promise<void>((resolve, reject) => {
        child.once('error', reject);
        child.once('close', function spawn$onclose(code, signal) {
            if (code === 0) {
                return resolve();
            } else {
                const msg = code ? `returned error code: ${code}` : `terminated by signal: ${signal}`;
                return reject(new ProbeError(`Process ${command} ${msg}`, code, signal));
            }
        });
    });

    return { child, promise };
}

/** Options for running ffprobe. */
export interface ProbeOptions {
    /**
     * Path to the ffprobe executable, or a command name available on `PATH`.
     * Takes precedence over the `FFPROBE_PATH` environment variable.
     */
    ffprobePath?: string;
}

/**
 * Runs ffprobe for a media file and parses its JSON output.
 *
 * The executable `ffprobe` must be installed and in your `PATH`.
 * You can provide an alternative executable name or the full path
 * to `ffprobe` in either `options.ffprobePath` or the `FFPROBE_PATH`
 * environment variable.
 * 
 * @param file - Path to the media file to probe.
 * @param options - Optional configuration.
 * @returns The parsed ffprobe output as a `MediaInfo` object.
 * @throws {ProbeError} If ffprobe exits with a nonzero code or is terminated by a signal.
 * @throws {Error} If the ffprobe process cannot be started.
 * @throws {SyntaxError} If ffprobe's output is not valid JSON.
 */
export default async function ffprobe(file: string, options: ProbeOptions = {}) {
    const command = options.ffprobePath || process.env.FFPROBE_PATH || 'ffprobe';
    const args = [
        '-v', 'error',
        '-show_format',
        '-show_streams',
        '-of', 'json',
        file,
    ];

    const { child, promise } = execute(command, args);
    const stdout = json(child.stdout);
    const stderr = text(child.stderr);

    try {
        const [_, out, _err] = await Promise.all([promise, stdout, stderr]);

        assert(typeof out === 'object' && out !== null, 'ffprobe output must be a JSON object');
        return out as MediaInfo;
    } catch (error: unknown) {
        if (error instanceof ProbeError) {
            error.stderr = (await stderr).trim();
        }
        throw error;
    }
}
