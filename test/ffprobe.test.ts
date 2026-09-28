import path from 'node:path';
import { describe, expect, it } from 'vitest';
import ffprobe, { type MediaInfo } from '../src/index.ts';

const resolve = (file: string) => path.resolve(import.meta.dirname, file);

describe("ffprobe", () => {
    it("reject when spawn emits an error", async () => {
        const promise = ffprobe('./fixtures/404-not-found', { ffprobePath: '/opt/404-not-found/ffprobe' });
        await expect(promise).rejects.to.toMatchObject({
            code: 'ENOENT'
        });
    });

    it("reject when media file cannot be found", async () => {
        const promise = ffprobe('./fixtures/404-not-found');
        await expect(promise).rejects.to.toMatchObject({
            code: 1,
            stderr: './fixtures/404-not-found: No such file or directory'
        });
    });

    it("smallest pbm", async () => {
        const promise = ffprobe(resolve('./fixtures/image.pbm'));
        await expect(promise).resolves.toMatchObject({
            format: { format_name: 'image2' },
            streams: [{
                codec_name: 'pbm',
                width: 1,
                height: 1,
                pix_fmt: 'monow'
            }]
        } satisfies MediaInfo);
    });

    it("smallest png", async () => {
        const promise = ffprobe(resolve('./fixtures/image.png'));
        await expect(promise).resolves.toMatchObject({
            format: { format_name: 'png_pipe' },
            streams: [{
                codec_name: 'png',
                width: 1,
                height: 1,
                pix_fmt: 'monob',
            }]
        } satisfies MediaInfo);
    });

    it("smallest wav", async () => {
        const promise = ffprobe(resolve('./fixtures/audio.wav'));
        await expect(promise).resolves.toMatchObject({
            format: { format_name: 'wav' },
            streams: [{
                codec_name: 'pcm_s16le',
                sample_fmt: 's16',
                sample_rate: '44100',
                channels: 1,
            }]
        } satisfies MediaInfo);
    });
});
