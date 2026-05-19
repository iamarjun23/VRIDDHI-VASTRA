import { SignJWT, jwtVerify } from 'jose';
import { logError } from './logger';

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
    const adminId = payload.id || payload._id || 'admin';
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .setAudience('vriddhi-admin')
      .setSubject(String(adminId))
      .sign(secret);
    return token;
  } catch (error) {
    logError('Error signing JWT:', error);
    throw new Error('Failed to sign token');
  }
}

export async function verifyTokenEdge(token) {
  try {
    const secret = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secret, {
      audience: 'vriddhi-admin'
    });
    return payload;
  } catch (error) {
    logError(`[JWT verifyTokenEdge] Exception during verification:`, error.message);
    return null;
  }
}
