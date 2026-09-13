export interface InstagramPost {
  id: string;
  title?: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  permalink: string;
  timestamp: string;
  tag: string;
  location?: string;
  likedBy?: string;
}

export interface InstagramProfile {
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followersCount: string;
  postsCount: number;
  profileUrl: string;
}

export const houseforceInstagramProfile: InstagramProfile = {
  handle: 'houseforcespain',
  displayName: 'HouseForce',
  avatarUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=200&auto=format&fit=crop',
  bio: 'British craftsmanship & dedicated property care in Torrevieja. Full villa reforms, luxury kitchens & trusted keyholding. 🔨🔑',
  followersCount: '2.8k',
  postsCount: 194,
  profileUrl: 'https://www.instagram.com/houseforcespain',
};

export const houseforceInstagramFeed: InstagramPost[] = [
  {
    id: 'ig-1',
    title: 'Cabo Roig Luxury Villa Transformation',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    caption: 'Cabo Roig luxury villa transformation. Full exterior render, anti-slip porcelain pool terrace, and recessed ambient LED wall lighting completed on schedule. 🇪🇸✨ #Torrevieja #VillaReform #CaboRoig',
    likes: 184,
    comments: 24,
    permalink: 'https://www.instagram.com/houseforcespain',
    timestamp: '2 DAYS AGO',
    tag: 'Villa Reform',
    location: 'Cabo Roig, Costa Blanca',
    likedBy: 'paigereddy',
  },
  {
    id: 'ig-2',
    title: 'Modern Open-Concept Kitchen Overhaul',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    caption: 'Custom open-concept kitchen overhaul in Torrevieja center. Seamless quartz waterfall island, handleless matte cabinetry, and integrated Bosch appliances. #KitchenDesign #CostaBlanca',
    likes: 241,
    comments: 31,
    permalink: 'https://www.instagram.com/houseforcespain',
    timestamp: '4 DAYS AGO',
    tag: 'Kitchen Overhaul',
    location: 'Torrevieja, Spain',
    likedBy: 'skippy_hf',
  },
  {
    id: 'ig-3',
    title: 'Spa-Inspired Master Bathroom in Punta Prima',
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
    caption: 'Spa-inspired master bathroom in Punta Prima. Walk-in rainfall shower with linear brass drainage and large format Spanish porcelain tiles. #BathroomReform #HouseForce',
    likes: 198,
    comments: 19,
    permalink: 'https://www.instagram.com/houseforcespain',
    timestamp: '6 DAYS AGO',
    tag: 'Bathroom Reform',
    location: 'Punta Prima, Orihuela Costa',
    likedBy: 'paul_reddy',
  },
  {
    id: 'ig-4',
    title: 'Summer Outdoor Living & Pergola Build',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    caption: 'Summer outdoor living area build in Los Balcones. Aluminum pergola with motorized louvres, custom outdoor grill station, and terracotta tiling. #OutdoorLiving #SpanishSun',
    likes: 215,
    comments: 28,
    permalink: 'https://www.instagram.com/houseforcespain',
    timestamp: '1 WEEK AGO',
    tag: 'Outdoor Living',
    location: 'Los Balcones, Spain',
    likedBy: 'paigereddy',
  },
  {
    id: 'ig-5',
    title: 'Open-Plan Living Room Structural Reform',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
    caption: 'Before & After: load-bearing wall removed to flood this coastal apartment with natural Mediterranean daylight. Acoustic slat wood panel feature wall. #LivingRoomReform',
    likes: 312,
    comments: 45,
    permalink: 'https://www.instagram.com/houseforcespain',
    timestamp: '1 WEEK AGO',
    tag: 'Structural Reform',
    location: 'La Zenia, Spain',
    likedBy: 'skippy_hf',
  },
  {
    id: 'ig-6',
    title: 'Routine Keyholding Inspection & Storm Care',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    caption: 'Paige on routine keyholding patrol in Playa Flamenca! Thorough storm inspection, deep cleaning, and AC servicing all done before client arrival tonight. 🔑 #Keyholding',
    likes: 167,
    comments: 14,
    permalink: 'https://www.instagram.com/houseforcespain',
    timestamp: '2 WEEKS AGO',
    tag: 'Keyholding Care',
    location: 'Playa Flamenca, Spain',
    likedBy: 'paul_reddy',
  },
];

export { getInstagramFeed, getInstagramProfile } from '@/lib/instagram';

