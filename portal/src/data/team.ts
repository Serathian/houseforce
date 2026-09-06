export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  languages: string[];
  bio: string;
  email?: string;
  image: string;
  fallbackInitials: string;
  accentColor: 'blue' | 'teal' | 'slate' | 'indigo';
}

export const teamMembers: TeamMember[] = [
  {
    id: 'paul',
    name: 'Paul Reddy',
    role: 'Founder & Master Contractor',
    experience: '35+ Yrs Trade Exp.',
    languages: ['🇬🇧 English'],
    bio: 'Directly managing all major villa reforms, extensions, kitchens, bathrooms, and technical building works in Torrevieja with uncompromising quality standards.',
    email: 'paul@houseforce.biz',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
    fallbackInitials: 'PR',
    accentColor: 'blue'
  },
  {
    id: 'paige',
    name: 'Paige Reddy',
    role: 'Keyholding & Property Care Manager',
    experience: 'Keyholding Lead',
    languages: ['🇬🇧 English', '🇪🇸 Spanish'],
    bio: 'Heading up keyholding custody, holiday changeover cleans, emergency callouts, and regular property security checks for expat homeowners.',
    email: 'paige@houseforce.biz',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    fallbackInitials: 'PA',
    accentColor: 'teal'
  },
  {
    id: 'skippy',
    name: 'Gabriel "Skippy"',
    role: 'Operations Manager & Local Liaison',
    experience: '20+ Yrs Torrevieja',
    languages: ['🇬🇧 English', '🇪🇸 Spanish (Bilingual)'],
    bio: 'Bilingual client liaison and site operations coordinator. Bridging communication between clients, local suppliers, and Torrevieja municipal permits.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    fallbackInitials: 'SK',
    accentColor: 'slate'
  },
  {
    id: 'jake',
    name: 'Jake Reddy',
    role: 'Head of Digital Systems & Web Development',
    experience: 'IT & Digital Infrastructure',
    languages: ['🇬🇧 English'],
    bio: 'Designing and maintaining the digital infrastructure for HouseForce, ensuring seamless online quote requests and direct owner communication.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    fallbackInitials: 'JR',
    accentColor: 'indigo'
  }
];
