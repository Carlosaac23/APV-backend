import type { IVeterinarian } from '../../models/Veterinarian';

declare global {
  namespace Express {
    export interface Request {
      veterinarian?: IVeterinarian;
    }
  }
}
