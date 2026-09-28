export type Tags = Record<string, string>;

export interface Disposition {
    default?: number;
    dub?: number;
    original?: number;
    comment?: number;
    lyrics?: number;
    karaoke?: number;
    forced?: number;
    hearing_impaired?: number;
    visual_impaired?: number;
    clean_effects?: number;
    attached_pic?: number;
    timed_thumbnails?: number;
    captions?: number;
    descriptions?: number;
    metadata?: number;
    dependent?: number;
    still_image?: number;
    [key: string]: number | undefined;
}

export interface SideData {
    side_data_type?: string;
    displaymatrix?: string;
    rotation?: number;
    [key: string]: unknown;
}

export interface Stream {
    index?: number;
    codec_name?: string;
    codec_long_name?: string;
    profile?: string;
    codec_type?: string;
    codec_tag_string?: string;
    codec_tag?: string;

    width?: number;
    height?: number;
    coded_width?: number;
    coded_height?: number;
    sample_aspect_ratio?: string;
    display_aspect_ratio?: string;
    pix_fmt?: string;
    level?: number;
    field_order?: string;
    color_range?: string;
    color_space?: string;
    color_transfer?: string;
    color_primaries?: string;
    chroma_location?: string;

    sample_fmt?: string;
    sample_rate?: string;
    channels?: number;
    channel_layout?: string;
    bits_per_sample?: number;
    bits_per_raw_sample?: string;

    r_frame_rate?: string;
    avg_frame_rate?: string;
    time_base?: string;
    start_pts?: number;
    start_time?: string;
    duration_ts?: number;
    duration?: string;
    bit_rate?: string;
    nb_frames?: string;

    disposition?: Disposition;
    tags?: Tags;
    side_data_list?: SideData[];

    [key: string]: unknown;
}

export interface Format {
    filename?: string;
    nb_streams?: number;
    nb_programs?: number;
    format_name?: string;
    format_long_name?: string;
    start_time?: string;
    duration?: string;
    size?: string;
    bit_rate?: string;
    probe_score?: number;
    tags?: Tags;
    [key: string]: unknown;
}

export interface MediaInfo {
    streams: Stream[];
    format: Format;
    [key: string]: unknown;
}
