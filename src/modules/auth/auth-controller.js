import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "../../lib/db.js";

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

export class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (user.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    console.log(user, "user");

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const roles =
      await sql`SELECT roles.name FROM roles  JOIN user_roles   ON user_roles.role_id = roles.id WHERE user_roles.user_id = ${user[0].id}`;

    const userRoles = roles.map(({ name }) => name);

    const token = jwt.sign(
      { userId: user[0].id, roles: userRoles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({ token });
  }
}
