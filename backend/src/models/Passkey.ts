import mongoose, { Document, Schema } from 'mongoose';

export interface IPasskey extends Document {
  userId: mongoose.Types.ObjectId;
  credentialId: string;
  publicKey: string;
  counter: number;
  deviceName: string;
  createdAt: Date;
}

const passkeySchema = new Schema<IPasskey>({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  credentialId: { type: String, required: true, unique: true },
  publicKey:    { type: String, required: true },
  counter:      { type: Number, default: 0 },
  deviceName:   { type: String, default: 'My Device' }
}, { timestamps: true });

export default mongoose.model<IPasskey>('Passkey', passkeySchema);