import { sql } from "../lib/db.js";

await sql`
  CREATE TABLE user_roles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
  );
`
  .then(() => console.log("user_roles table created!"))
  .catch((error) => {
    console.log(error);
  });
