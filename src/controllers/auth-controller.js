import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "../lib/db";

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

export class AuthController {
  async register(req, res) {
    const { email, password } = req.body;

    const existingUser = await sql`
     SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0)
      return res.status(400).json({ message: "User already exists!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser =
      await sql`INSERT INTO users (email, password) VALUES(${email}, ${hashPassword}) RETURNING *`;

    const userId = newUser.rows[0].id;

    const defaultRole = await sql` SELECT id FROM roles WHERE name = 'user'`;

    await sql`INSERT INTO user_roles (user_id, role_id) VALUES (${userId}, ${defaultRole.rows[0].id})`;

    res.status(201).json({ message: "User registered sucessfully" });
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (user.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const roles =
      await sql`SELECT r.name FROM roles  r JOIN user_roles  ur ON ur.role_id = r.id WHERE ur.user_id = ${user.rows[0].id}`;

    const userRoles = roles.row.map((role) => role.name);

    const token = jwt.sign(
      { userId: user.row[0].id, roles: userRoles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({ token });
  }
}
