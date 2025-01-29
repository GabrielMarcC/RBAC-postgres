import { sql } from "../lib/db.js";

await sql`
  CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);`
  .then(() => console.log("roles table created successfully!"))
  .catch((error) => {
    console.log(error);
  });

await sql`
  INSERT INTO roles (name) VALUES ('admin'), ('user');
`
  .then(() => console.log("roles table updated!"))
  .catch((error) => {
    console.log(error);
  });
