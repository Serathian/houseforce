export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string; // rich text or markdown depending on Strapi config
  categories?: Category[];
  category?: Category; // Deprecated single category backward compatibility
  coverImage?: any; // Will refine based on Strapi upload type
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  posts?: Post[];
}
