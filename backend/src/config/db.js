import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "./env.js";
import * as schema from "../DB/schema.js";

const sql = postgres(ENV.DATABASE_URL);
export const db = drizzle(sql, {schema})