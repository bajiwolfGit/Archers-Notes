import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MAX_FILE_URL_LENGTH } from '../posts.constants.js';
import { CreatePostDto } from './create-post.dto.js';
import { UpdatePostDto } from './update-post.dto.js';

// Mirrors the global ValidationPipe({ whitelist: true, transform: true })
async function check<T extends object>(
  dto: new () => T,
  payload: Record<string, unknown>,
) {
  const instance = plainToInstance(dto, payload);
  const errors = await validate(instance, { whitelist: true });
  return { instance, invalid: errors.map((error) => error.property) };
}

describe('CreatePostDto', () => {
  it('accepts a full post and trims the title', async () => {
    const { instance, invalid } = await check(CreatePostDto, {
      header: '  Midterms Reviewer  ',
      course_id: 1,
      body: '<p>Notes</p>',
      status: 'published',
      files: [{ file_url: 'data:image/png;base64,iVBORw0KGgo=' }],
    });

    expect(invalid).toEqual([]);
    expect(instance.header).toBe('Midterms Reviewer');
  });

  it('accepts a draft with nothing but a course', async () => {
    const { invalid } = await check(CreatePostDto, { course_id: 1 });

    expect(invalid).toEqual([]);
  });

  it('requires a whole-number course_id', async () => {
    expect((await check(CreatePostDto, {})).invalid).toEqual(['course_id']);
    expect((await check(CreatePostDto, { course_id: '1' })).invalid).toEqual([
      'course_id',
    ]);
  });

  it('rejects a title longer than the column allows', async () => {
    const { invalid } = await check(CreatePostDto, {
      course_id: 1,
      header: 'a'.repeat(201),
    });

    expect(invalid).toEqual(['header']);
  });

  it('only lets the user choose draft or published', async () => {
    for (const status of ['deleted', 'archived', 'pending_review']) {
      const { invalid } = await check(CreatePostDto, { course_id: 1, status });
      expect(invalid).toEqual(['status']);
    }
  });

  it('rejects files that are not base64 data URLs', async () => {
    for (const file_url of [
      'https://example.com/notes.pdf',
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
    ]) {
      const { invalid } = await check(CreatePostDto, {
        course_id: 1,
        files: [{ file_url }],
      });
      expect(invalid).toEqual(['files']);
    }
  });

  it('rejects a file over the size limit and more than ten files', async () => {
    const tooBig = await check(CreatePostDto, {
      course_id: 1,
      files: [
        {
          file_url:
            'data:image/png;base64,' + 'A'.repeat(MAX_FILE_URL_LENGTH),
        },
      ],
    });
    expect(tooBig.invalid).toEqual(['files']);

    const tooMany = await check(CreatePostDto, {
      course_id: 1,
      files: Array.from({ length: 11 }, () => ({
        file_url: 'data:image/png;base64,iVBORw0KGgo=',
      })),
    });
    expect(tooMany.invalid).toEqual(['files']);
  });
});

describe('UpdatePostDto', () => {
  it('accepts an empty change and a partial change', async () => {
    expect((await check(UpdatePostDto, {})).invalid).toEqual([]);
    expect(
      (await check(UpdatePostDto, { body: null, status: 'draft' })).invalid,
    ).toEqual([]);
  });

  it('requires file ids to remove to be UUIDs', async () => {
    const ok = await check(UpdatePostDto, {
      remove_file_ids: ['33333333-3333-4333-8333-333333333333'],
    });
    expect(ok.invalid).toEqual([]);

    const bad = await check(UpdatePostDto, { remove_file_ids: ['f1'] });
    expect(bad.invalid).toEqual(['remove_file_ids']);
  });

  it('drops fields the client is not allowed to set', async () => {
    const { instance, invalid } = await check(UpdatePostDto, {
      header: 'Title',
      user_id: '22222222-2222-4222-8222-222222222222',
    });

    expect(invalid).toEqual([]);
    expect(instance).not.toHaveProperty('user_id');
  });
});
