// src/types/next-auth.d.ts

import 'next-auth';
import type { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username?: string | null;
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    username?: string | null;
  }
}
