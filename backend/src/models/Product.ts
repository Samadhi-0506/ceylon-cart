import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: mongoose.Types.ObjectId;
  stock: number;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  image: { type: String, default: '' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 100, min: 0 },
  unit: { type: String, default: 'kg' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IProduct>('Product', productSchema);
