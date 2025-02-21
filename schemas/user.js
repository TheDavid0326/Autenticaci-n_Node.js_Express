import z from 'zod';

const UserSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Username is required'
  }).min(3, { invalid_type_error: 'Username must be at least three characters long' }).max(20, { invalid_type_error: 'Username must be at most twenty characters long' }),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  }).min(6, { invalid_type_error: 'Password must be at least six characters long' })
});

export function validateUser ({ username, password }) {
  return UserSchema.safeParse({ username, password });
}
