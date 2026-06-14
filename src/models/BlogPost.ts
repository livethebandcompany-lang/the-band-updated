import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  icon: string;
  imageUrl: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      content: string;
      list?: string[];
    }[];
    conclusion: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    id: { type: Number, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    readTime: { type: String, required: true },
    author: { type: String, required: true, default: 'The Band Company' },
    icon: { type: String, required: true, default: 'sparkles' },
    imageUrl: { type: String, required: true },
    content: {
      intro: { type: String, required: true },
      sections: [
        {
          heading: { type: String, required: true },
          content: { type: String, required: true },
          list: [{ type: String }],
        },
      ],
      conclusion: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
