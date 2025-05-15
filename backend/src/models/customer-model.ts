// Customer model for enhanced user information
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user-model';

export interface ICustomer extends Document {
  user: IUser['_id'];
  eCardHolder: boolean;
}

const CustomerSchema: Schema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  eCardHolder: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Ensure one user can only be one customer
CustomerSchema.index({ user: 1 }, { unique: true });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
