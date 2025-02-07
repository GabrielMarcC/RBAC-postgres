import { z } from "zod";

import { usersSchema } from "../schemas";

export type User = z.infer<typeof usersSchema>;
