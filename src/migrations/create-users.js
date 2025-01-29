import { sql } from "../lib/db.js";

await sql`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`
  .then(() => console.log("users table created!"))
  .catch((error) => {
    console.log(error);
  });
