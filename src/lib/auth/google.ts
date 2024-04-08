import { Google } from "arctic";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = import.meta.env;

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 'http://localhost:4321/api/login/google/callback');