import {
  assertOptionalYoutubeEmbedUrl,
  assertVideoHasPlayableMedia,
  isLikelyYoutubeUrl,
  parseYoutubeId,
  resolveVideoMediaFields,
  youtubeEmbedUrlFromInput,
} from './videoEmbed';

const SAMPLE_ID = 'dQw4w9WgXcQ';

describe('videoEmbed', () => {
  it('parses common YouTube URL shapes including live and music host', () => {
    expect(parseYoutubeId(`https://www.youtube.com/watch?v=${SAMPLE_ID}`)).toBe(SAMPLE_ID);
    expect(parseYoutubeId(`https://youtu.be/${SAMPLE_ID}`)).toBe(SAMPLE_ID);
    expect(parseYoutubeId(`https://www.youtube.com/shorts/${SAMPLE_ID}`)).toBe(SAMPLE_ID);
    expect(parseYoutubeId(`https://www.youtube.com/live/${SAMPLE_ID}`)).toBe(SAMPLE_ID);
    expect(parseYoutubeId(`https://music.youtube.com/watch?v=${SAMPLE_ID}`)).toBe(SAMPLE_ID);
    expect(isLikelyYoutubeUrl('https://vimeo.com/123')).toBe(false);
  });

  it('builds nocookie embed urls', () => {
    expect(youtubeEmbedUrlFromInput(`https://youtu.be/${SAMPLE_ID}`)).toBe(
      `https://www.youtube-nocookie.com/embed/${SAMPLE_ID}`
    );
  });

  it('moves YouTube out of videoFileUrl into embedUrl', () => {
    const yt = `https://www.youtube.com/watch?v=${SAMPLE_ID}`;
    const resolved = resolveVideoMediaFields({
      videoFileUrl: yt,
      embedUrl: '',
      videoUrl: '',
    });

    expect(resolved.videoFileUrl).toBe('');
    expect(resolved.embedUrl).toBe(yt);
    expect(resolved.movedYoutubeFromFile).toBe(true);
  });

  it('rejects non-YouTube embed URLs and requires media for publish', () => {
    expect(() => assertOptionalYoutubeEmbedUrl('https://vimeo.com/1', 'Embed URL')).toThrow(
      /YouTube/
    );
    expect(assertOptionalYoutubeEmbedUrl('', 'Embed URL')).toBe('');
    expect(() =>
      assertVideoHasPlayableMedia({
        videoFileUrl: '',
        embedUrl: '',
        requireForPublish: true,
      })
    ).toThrow(/Published videos/);
  });
});
