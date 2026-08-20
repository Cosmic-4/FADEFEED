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
    videoUrl: '/videos/326677_medium.mp4',
    username: '@driftworks',
    caption: 'Minimal architecture is everything.',
    likes: 18700,
    category: 'design',
  },
  {
    id: 3,
    videoUrl: '/videos/336755_medium.mp4',
    username: '@nightshift.co',
    caption: 'The city never sleeps. Neither do we.',
    likes: 41200,
    category: 'lifestyle',
  },
  {
    id: 4,
    videoUrl: '/videos/343478_medium.mp4',
    username: '@kinetic.flow',
    caption: 'Movement is medicine.',
    likes: 33100,
    category: 'fitness',
  },
  {
    id: 5,
    videoUrl: '/videos/347325_medium.mp4',
    username: '@sundial.waves',
    caption: 'Found this hidden beach at golden hour.',
    likes: 52400,
    category: 'travel',
  },
  {
    id: 6,
    videoUrl: '/videos/364783_medium.mp4',
    username: '@static.pitch',
    caption: 'New beat. Pure analog warmth.',
    likes: 15900,
    category: 'music',
  },
  {
    id: 7,
    videoUrl: '/videos/367164_medium.mp4',
    username: '@luma.goods',
    caption: 'Handcrafted with intention.',
    likes: 28600,
    category: 'craft',
  },
  {
    id: 8,
    videoUrl: '/videos/367684_medium.mp4',
    username: '@veld.studio',
    caption: 'Into the unknown. Always.',
    likes: 37800,
    category: 'adventure',
  },
  {
    id: 9,
    videoUrl: '/videos/370344_medium.mp4',
    username: '@echo.form',
    caption: 'Sound design session. Late night.',
    likes: 21400,
    category: 'music',
  },
  {
    id: 10,
    videoUrl: '/videos/15470651_3840_2160_60fps.mp4',
    username: '@pulse.collective',
    caption: '60fps. No filters needed.',
    likes: 61200,
    category: 'cinematic',
  },
  {
    id: 11,
    videoUrl: '/videos/16425247_3840_2160_30fps.mp4',
    username: '@frameby.frame',
    caption: 'Every frame a painting.',
    likes: 44800,
    category: 'cinematic',
  },
  {
    id: 12,
    videoUrl: '/videos/16575361_2160_3840_30fps.mp4',
    username: '@vertical.arts',
    caption: 'Portrait mode. Full send.',
    likes: 38900,
    category: 'portrait',
  },
  {
    id: 13,
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
  if (cycle === 0) return [...BASE_REELS];
  const shuffled = shuffleArray(BASE_REELS);
  return cycle % 2 === 0 ? shuffled : [...shuffled].reverse();
}

export function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}
