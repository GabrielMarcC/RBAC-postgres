import { sql } from "../../lib/db.js";
import bcrypt from "bcryptjs";

export class AuthService {
  static async register(req, res) {
    const { email, password } = req.body;

    try {
      const existingUser = await sql`
       SELECT * FROM users WHERE email = ${email}
      `;

      if (existingUser.length > 0)
        return res.status(400).json({ message: "User already exists!" });

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser =
        await sql`INSERT INTO users (email, password) VALUES(${email}, ${hashPassword}) RETURNING *`;

      const userId = newUser[0].id;

      const defaultRole = await sql` SELECT id FROM roles WHERE name = 'user'`;

      await sql`INSERT INTO user_roles (user_id, role_id) VALUES (${userId}, ${defaultRole[0].id})`;

      res.status(201).json({ message: "User registered sucessfully" });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ message: "Erro ao registrar usuário" });
    }
  }
}
