// import DBlocal from 'db-local';
// const { Schema } = new DBlocal({ path: 'db' });
import Schema from 'db-local/lib/modules/schema.js';
import { validateUser } from './schemas/user.js';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './config.js';

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
}, 'db');

export class UserRepository {
  static async create ({ username, password }) {
    // 1. Validaciones del username y password
    const result = validateUser({ username, password });
    if (!result.success) {
      throw new Error(result.error.message);
    }

    // 2. Asegurarse que el username no existe
    const user = User.findOne({ username });
    if (user) throw new Error(JSON.stringify({ message: 'User already exists' }));

    // 3. Generar un id único
    const id = crypto.randomUUID();

    // 4. Hash del pasword
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS); // bcrypt.hash devuelve una promesa, por lo que se pone await

    // 5. Crear el usuario
    User.create({
      _id: id,
      username,
      password: hashPassword
    }).save();

    return id;
  }

  static async login ({ username, password }) {
    // 1. Validaciones del username y password
    const result = validateUser({ username, password });
    if (!result.success) {
      throw new Error(result.error.message);
    }

    // 2. Asegurarse que el username existe
    const user = User.findOne({ username });
    if (!user) throw new Error(JSON.stringify({ message: 'User not found' }));

    // 3. Comparar el password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error(JSON.stringify({ message: 'Invalid password' }));

    // 4. Quitamos el password del objeto user
    const publicUser = {
      _id: user._id,
      username: user.username
    };

    return publicUser;
  }
}
