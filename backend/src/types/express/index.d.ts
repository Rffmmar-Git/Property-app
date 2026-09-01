import { user_role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: user_role;
      };

      file?: Multer.File;
    }
  }
}

export {};