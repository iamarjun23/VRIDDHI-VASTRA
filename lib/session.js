import { signToken, verifyTokenEdge } from './jwt';

export { signToken };

const tokenVersionCache = new Map(); // key: adminId, value: { version, expiresAt }

export async function verifyToken(token) {
  try {
    const payload = await verifyTokenEdge(token);
    if (!payload) return null;

    if (payload.role === 'admin') {
      const adminId = payload.sub || 'admin';
      const now = Date.now();
      const cached = tokenVersionCache.get(adminId);

      let dbTokenVersion;
      if (cached && cached.expiresAt > now) {
        dbTokenVersion = cached.version;
      } else {
        const dbConnect = (await import('./mongodb')).default;
        const Admin = (await import('../models/Admin')).default;
        await dbConnect();
        const admin = await Admin.findOne().lean();
        dbTokenVersion = admin?.tokenVersion || 0;

        tokenVersionCache.set(adminId, {
          version: dbTokenVersion,
          expiresAt: now + 60 * 1000 // 60s TTL
        });
      }

      const payloadTokenVersion = payload.tokenVersion || 0;
      
      if (dbTokenVersion !== payloadTokenVersion) {
        return null; // Token has been revoked
      }
    }
    
    return payload;
  } catch (error) {
    return null; // Invalid token
  }
}
