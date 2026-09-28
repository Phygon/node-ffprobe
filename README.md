# node-ffprobe

A lightweight Node.js wrapper for `ffprobe` that returns parsed media metadata as JSON, with TypeScript types.

## Requirements

- `ffprobe` installed and available on your `PATH`, or its executable path provided through an option or environment variable

## Usage

The package's default export is the asynchronous `ffprobe` function.

```ts
import ffprobe from "node-ffprobe";

const info = await ffprobe("./video.mp4");
console.dir(info, { depth: null });
/***
{
    "streams": [
        {
            "index": 0,
            "codec_name": "h264",
            [...]
        }
    ],
    "format": {
        "filename": "./video.mp4",
        [...]
    }
}
 **/
```

## API

### `ffprobe(file, options)`

* `file` - Path to the media file to probe.
* `options` - options object with the following options:
  * `ffprobePath` - Path to the ffprobe executable, or a command name available on `PATH`.
  Takes precedence over the `FFPROBE_PATH` environment variable.

When successful, the output is parsed and returned as `MediaInfo` object.
