import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}

export interface UploadedFile {
  originalname: string;
  size: number;

  // optional depending on source
  buffer?: Buffer;
  path?: string;
  mimetype?: string;
}

export interface UserI {
  id: string;
}
