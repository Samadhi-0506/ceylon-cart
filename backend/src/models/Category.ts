import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  image: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  color: { type: String, default: '#10b981' },
  icon: { type: String, default: '🛒' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ICategory>('Category', categorySchema);
