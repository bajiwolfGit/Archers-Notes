import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { MAX_FILE_URL_LENGTH } from '../posts.constants.js';

// "data:<mime>;base64,<content>", which is what FileReader.readAsDataURL()
// produces in the browser. Only data URLs are accepted so that a stored
// file_url can never be a javascript: or third-party link.
const DATA_URL_PREFIX = /^data:([\w.+-]+\/[\w.+-]+)?(;[\w.+-]+=[\w.+-]+)*;base64,/;

export class PostFileDto {
  @IsString()
  @MaxLength(MAX_FILE_URL_LENGTH, {
    message: 'each file must be 5 MB or smaller',
  })
  @Matches(DATA_URL_PREFIX, {
    message: 'file_url must be a base64 data URL',
  })
  file_url: string;

  // Optional label such as "image/png" or "pdf". When left out it is taken
  // from the data URL.
  @IsOptional()
  @IsString()
  @MaxLength(50)
  file_type?: string;
}
