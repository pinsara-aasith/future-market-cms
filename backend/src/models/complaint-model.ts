// Complaint model for tracking customer feedback
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user-model';

export enum ComplaintStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}

export interface IComplaint extends Document {
  description: string;
  branchCode: string;
  createdBy: IUser['_id'] | null; // Can be null for anonymous complaints
  isAnonymous: boolean;
  actionsTaken: string[];
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema({
  description: { 
    type: String, 
    required: true 
  },
  branchCode: { 
    type: String, 
    required: true,
    ref: 'Branch'
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  actionsTaken: [{ 
    type: String 
  }],
  status: { 
    type: String, 
    enum: Object.values(ComplaintStatus),
    default: ComplaintStatus.PENDING 
  }
}, {
  timestamps: true
});

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);
