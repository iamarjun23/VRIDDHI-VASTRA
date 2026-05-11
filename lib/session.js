import { SignJWT, jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('The environment variable JWT_SECRET is not set.');
  }
  return new TextEncoder().encode(secret);
};

export async function signToken(payload) {
  try {
    const secret = getJwtSecretKey();
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
    return token;
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Failed to sign token');
  }
}

export async function verifyToken(token) {
  try {
    const secret = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null; // Invalid token
  }
}
