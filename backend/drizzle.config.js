import { ENV } from "./src/config/env.js";

export default{
    schema: "./src/DB/schema.js", //schema path
    out : "./src/DB/migrations",  //o/p path
    dialect: "postgresql",         //db type
    dbCredentials:{ url : ENV.DATABASE_URL}, //conntion str
};