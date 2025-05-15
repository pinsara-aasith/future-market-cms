// BranchSupervisor model to connect supervisors to branches
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user-model';

export interface IBranchSupervisor extends Document {
  branchCode: string;
  user: IUser['_id'];
}

const BranchSupervisorSchema: Schema = new Schema({
  branchCode: { 
    type: String, 
    required: true,
    ref: 'Branch'
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

// Ensure one supervisor can only be assigned to one branch
BranchSupervisorSchema.index({ user: 1 }, { unique: true });

export default mongoose.model<IBranchSupervisor>('BranchSupervisor', BranchSupervisorSchema);
