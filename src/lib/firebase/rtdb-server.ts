const DATABASE_URL = (
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://technovateclub-default-rtdb.firebaseio.com'
).replace(/\/$/, '');

/**
 * Server-side RTDB helper using HTTPS REST API.
 * Guarantees zero WebSocket failures or missing server auth crashes.
 */
export async function getRTDBServer<T = any>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${DATABASE_URL}/${path}.json`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`RTDB GET error on path ${path}:`, err);
    return null;
  }
}

export async function patchRTDBServer(path: string, data: Record<string, any>): Promise<boolean> {
  try {
    const res = await fetch(`${DATABASE_URL}/${path}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error(`RTDB PATCH error on path ${path}:`, err);
    return false;
  }
}

export async function putRTDBServer(path: string, data: any): Promise<boolean> {
  try {
    const res = await fetch(`${DATABASE_URL}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error(`RTDB PUT error on path ${path}:`, err);
    return false;
  }
}
