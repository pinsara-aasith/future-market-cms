// Branch model for supermarket locations
import mongoose, { Document, Schema } from 'mongoose';

export interface IBranch extends Document {
  branchCode: string;
  branchName: string;
  address: string;
  phoneNo: string;
}

const BranchSchema: Schema = new Schema({
  branchCode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  branchName: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  phoneNo: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.model<IBranch>('Branch', BranchSchema);
