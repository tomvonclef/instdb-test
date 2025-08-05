import { init } from '@instantdb/react';
import schema from "../instant.schema"

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;

if (!APP_ID) {
  throw new Error("NEXT_PUBLIC_INSTANT_APP_ID environment variable is not set. Please check your .env.local file.");
}

const db = init({ appId: APP_ID, schema });

export default db;
