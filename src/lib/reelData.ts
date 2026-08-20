export interface Reel {
  id: number;
  videoUrl: string;
  username: string;
  caption: string;
  likes: number;
  category: string;
}

const BASE_REELS: Reel[] = [
  {
    id: 1,
    videoUrl: '/videos/319751_medium.mp4',
    username: '@aurora.studio',
    caption: 'Light studies in motion. Part 3.',
    likes: 24300,
    category: 'art',
  },
  {
    id: 2,
    videoUrl: '/videos/343478_medium.mp4',
    username: '@kinetic.flow',
    caption: 'Movement is medicine.',
    likes: 33100,
    category: 'fitness',
  },
  {
    id: 3,
    videoUrl: '/videos/347325_medium.mp4',
    username: '@sundial.waves',
    caption: 'Found this hidden beach at golden hour.',
    likes: 52400,
    category: 'travel',
  },
  {
    id: 4,
    videoUrl: '/videos/364783_medium.mp4',
    username: '@static.pitch',
    caption: 'New beat. Pure analog warmth.',
    likes: 15900,
    category: 'music',
  },
  {
    id: 5,
    videoUrl: '/videos/367164_medium.mp4',
    username: '@luma.goods',
    caption: 'Handcrafted with intention.',
    likes: 28600,
    category: 'craft',
  },
  {
    id: 6,
    videoUrl: '/videos/367684_medium.mp4',
    username: '@veld.studio',
    caption: 'Into the unknown. Always.',
    likes: 37800,
    category: 'adventure',
  },
  {
    id: 7,
    videoUrl: '/videos/370344_medium.mp4',
    username: '@echo.form',
    caption: 'Sound design session. Late night.',
    likes: 21400,
    category: 'music',
  },
  {
    id: 8,
    videoUrl: '/videos/16575361_2160_3840_30fps.mp4',
    username: '@vertical.arts',
    caption: 'Portrait mode. Full send.',
    likes: 38900,
    category: 'portrait',
  },
  {
    id: 9,
    videoUrl: '/videos/16602269_2160_3840_30fps.mp4',
    username: '@raw.lens',
    caption: 'No edits. Just light.',
    likes: 55100,
    category: 'portrait',
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateFeedOrder(cycle: number): Reel[] {
  const shuffled = shuffleArray(BASE_REELS);
  const first3 = shuffled.slice(0, 3);
  const rest = shuffled.slice(3);
  if (cycle === 0) return [...first3, ...rest, ...rest, ...rest];
  const reshuffled = shuffleArray(BASE_REELS);
  const newFirst3 = reshuffled.slice(0, 3);
  const newRest = reshuffled.slice(3);
  return [...newFirst3, ...newRest, ...newRest, ...newRest];
}

