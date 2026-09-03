export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string; // rich text or markdown depending on Strapi config
  category?: Category;
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
