import bcrypt from "bcryptjs";

interface VertifyHashedValue {
  password: string;
  hash: string;
}

export const hashValue = async function (password: string): Promise<string> {
  const SALT_ROUNDS = 10;
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyHashedValue = async function (props: VertifyHashedValue) {
  const { password, hash } = props;
  return await bcrypt.compare(password, hash);
};
