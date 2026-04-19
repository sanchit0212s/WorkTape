// Mock data for WorkTape photographer templates — exposed on window.MockData.
const img = (id, w, h) => ({
  url: `https://picsum.photos/seed/wt-${id}/${w}/${h}`,
  width: w, height: h,
});
function makeImages(seed, count, ratios) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [w, h] = ratios[i % ratios.length];
    out.push({ id: `${seed}-img-${i}`, ...img(`${seed}-${i}`, w, h), alt_text: null, sort_order: i });
  }
  return out;
}
const R_MIXED = [[1600, 2000], [2000, 1333], [1600, 1600], [1200, 1500], [2000, 1250]];
const R_LAND  = [[2000, 1333], [2000, 1250], [2000, 1500]];
const R_PORT  = [[1200, 1500], [1600, 2000], [1000, 1400]];

const minimalUser = {
  portfolio: {
    id: 'p-min', user_id: 'u-min', genre: 'photographer', slug: 'noa', status: 'published',
    display_name: 'Noa Sato', tagline: 'Photographer, Lisbon',
    bio_bullets: [], ai_bio: null, profile_photo_url: null,
    social_links: { instagram: 'https://instagram.com/noasato' },
    custom_headline: null,
    published_at: '2026-03-01', created_at: '2026-03-01', updated_at: '2026-03-01',
  },
  projects: [{
    id: 'pr-min-1', portfolio_id: 'p-min', title: 'Casa Azul',
    description: null,
    ai_description: 'A weekend at a borrowed house on the Atlantic coast. Shot on Portra 400 over three mornings.',
    sort_order: 0, created_at: '', updated_at: '',
    images: makeImages('min-1', 4, R_MIXED),
  }],
  user: { id: 'u-min', email: 'noa@example.com', full_name: 'Noa Sato', avatar_url: null, created_at: '', updated_at: '' },
};

const projectBriefs = [
  { t: 'Tidelands',        d: 'A two-year study of the Kent estuary at dawn. Medium format, natural light only.',   r: R_LAND,  n: 8 },
  { t: 'Sunday Painters',  d: 'Portraits of amateur landscape painters in public parks across northern Spain.',     r: R_PORT,  n: 6 },
  { t: 'Kowloon, 4am',     d: 'Commissioned for Apartamento. Hong Kong wet markets in the hour before opening.',    r: R_MIXED, n: 9 },
  { t: 'Bluebottle',       d: 'Editorial for The Gentlewoman — six long-distance swimmers off the Irish coast.',    r: R_MIXED, n: 7 },
  { t: 'Aperol No.3',      d: 'Campaign for Aperol. Golden hour on the Amalfi coast, shot over four days.',         r: R_LAND,  n: 6 },
  { t: 'Field Notes',      d: 'Personal work from residencies in Iceland and Orkney. Large format black-and-white.', r: R_LAND,  n: 10 },
  { t: 'The Upholsterers', d: 'Reportage for Monocle — three generations of a family workshop in Milan.',           r: R_MIXED, n: 8 },
  { t: 'Haruki',           d: 'Cover story for New York Times Magazine. A single afternoon in Tokyo.',              r: R_PORT,  n: 5 },
  { t: 'Salt Farm',        d: 'Documenting artisanal salt production in Guérande across one full season.',         r: R_LAND,  n: 7 },
  { t: 'Mother, 1997',     d: 'Archival family images rephotographed in situ. Shown at Foam, Amsterdam.',           r: R_PORT,  n: 4 },
  { t: 'Pharmakon',        d: 'Still life commissions for Aesop. Studio work, continuous light.',                   r: R_MIXED, n: 6 },
  { t: 'Midlands',         d: 'Long-term project on post-industrial landscapes between Stoke and Coventry.',         r: R_LAND,  n: 12 },
  { t: 'Green Room',       d: 'Backstage portraits from the Avignon Festival, commissioned by AnOther.',            r: R_PORT,  n: 8 },
  { t: 'Nocturne',         d: 'Urban photographs made between 2am and 4am in six European cities.',                 r: R_LAND,  n: 9 },
  { t: 'Pocket Weather',   d: 'An ongoing series of iPhone photographs. Made between assignments.',                 r: R_MIXED, n: 14 },
];

const fullUser = {
  portfolio: {
    id: 'p-full', user_id: 'u-full', genre: 'photographer', slug: 'mira-okafor', status: 'published',
    display_name: 'Mira Okáfor',
    tagline: 'Photographer working between London and Lagos',
    bio_bullets: [
      'Born 1989 in Enugu, Nigeria. Based in London since 2012.',
      'Clients: Apple, Aesop, The Gentlewoman, NYT Magazine, Monocle, Apartamento.',
      'Represented by Webber Represents.',
      'BA Photography, Royal College of Art, 2014.',
    ],
    ai_bio: 'Mira Okáfor is a photographer whose work sits between documentary and still life. Over the last decade she has built a practice around slow, repeat-visit projects — tidelands, family workshops, salt farms — alongside editorial and campaign commissions for Apple, Aesop and The Gentlewoman. Her photographs have been exhibited at Foam (Amsterdam), the Photographers\u2019 Gallery (London) and Rencontres d\u2019Arles. She is represented by Webber Represents and teaches a yearly masterclass at the Royal College of Art.',
    profile_photo_url: 'https://picsum.photos/seed/wt-mira/400/500',
    social_links: {
      instagram: 'https://instagram.com/miraokafor',
      twitter: 'https://twitter.com/miraokafor',
      linkedin: 'https://linkedin.com/in/miraokafor',
      dribbble: 'https://dribbble.com/miraokafor',
      behance: 'https://behance.net/miraokafor',
      youtube: 'https://youtube.com/@miraokafor',
      website: 'https://miraokafor.com',
      email: 'hello@miraokafor.com',
    },
    custom_headline: null,
    published_at: '2026-02-10', created_at: '2026-02-10', updated_at: '2026-02-10',
  },
  projects: projectBriefs.map((b, i) => ({
    id: `pr-full-${i}`, portfolio_id: 'p-full', title: b.t,
    description: null, ai_description: b.d,
    sort_order: i, created_at: '', updated_at: '',
    images: makeImages(`full-${i}`, b.n, b.r),
  })),
  user: { id: 'u-full', email: 'hello@miraokafor.com', full_name: 'Mira Okáfor', avatar_url: null, created_at: '', updated_at: '' },
};

window.MockData = { minimalUser, fullUser };
