import * as bcrypt from 'bcrypt';

export const encode = (password: string) => {
  const salt = bcrypt.genSaltSync();

  return bcrypt.hashSync(password, salt);
};

export const compare = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
