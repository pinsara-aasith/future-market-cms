import { IUser } from '../../src/models/user-model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // or remove `?` if you are sure it's always set
    }
  }
}
