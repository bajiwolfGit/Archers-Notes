// Limits for files stored in the post_files table.
//
// A file travels as a base64 data URL inside the JSON request body and is
// stored as-is in post_files.file_url, so the limits below are what keep a
// single request (and a single row) at a sensible size.

export const MAX_FILES_PER_POST = 10;

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

// base64 turns every 3 bytes into 4 characters; the extra 200 characters leave
// room for the "data:<mime>;base64," prefix.
export const MAX_FILE_URL_LENGTH = Math.ceil(MAX_FILE_BYTES / 3) * 4 + 200;

// Enough for MAX_FILES_PER_POST files at full size plus the post body.
export const JSON_BODY_LIMIT = '75mb';
