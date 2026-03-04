import type { WithId, Document } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      veterinarian?: WithId<Document> | null;
    }
  }
}
