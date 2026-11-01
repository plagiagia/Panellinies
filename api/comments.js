const roomPattern = /^(general|math|physics|(math|physics)-(2025|2026)-(a[1-5]|b[1-4]|c[1-4]|d[1-4]))$/;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!base || !key || !anonKey) return res.status(503).json({ error: 'Comments are not configured' });
  if (req.method === 'GET' && req.query.config === '1') return res.status(200).json({ url: base, anonKey });
  const room = req.method === 'GET' ? req.query.room : req.body?.room;
  if (typeof room !== 'string' || !roomPattern.test(room)) return res.status(400).json({ error: 'Invalid question' });
  let message;
  if (req.method === 'POST') {
    if (typeof req.body?.message !== 'string') return res.status(400).json({ error: 'Invalid comment' });
    message = req.body.message.trim();
    if (!message || message.length > 2000) return res.status(400).json({ error: 'Invalid comment' });
  }
  try {
    let name, userId;
    if (req.method === 'POST') {
      const token = req.headers.authorization;
      if (!token || !/^Bearer \S+$/.test(token)) return res.status(401).json({ error: 'Sign in required' });
      const auth = await fetch(new URL('/auth/v1/user', base), { headers: { apikey: anonKey, Authorization: token } });
      if (!auth.ok) return res.status(401).json({ error: 'Sign in required' });
      const user = await auth.json();
      const displayName = user.user_metadata?.display_name ?? user.user_metadata?.given_name;
      name = typeof displayName === 'string' && displayName.trim() ? displayName.trim().slice(0, 40) : 'Μαθητής';
      userId = user.id;
      if (!name || name.length > 40 || typeof userId !== 'string') return res.status(400).json({ error: 'Invalid account name' });
    }
    const url = new URL('/rest/v1/comments', base);
    if (req.method === 'GET') {
      url.searchParams.set('room', `eq.${room}`);
      url.searchParams.set('select', 'id,name,message,created_at');
      url.searchParams.set('order', 'created_at.desc');
      url.searchParams.set('limit', '100');
    }
    const response = await fetch(url, {
      method: req.method,
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      ...(req.method === 'POST' ? { body: JSON.stringify({ room, name, message, user_id: userId }) } : {}),
    });
    if (!response.ok) throw new Error(`Storage returned ${response.status}`);
    const data = await response.json();
    return res.status(req.method === 'POST' ? 201 : 200).json(data);
  } catch (error) {
    console.error('Comments storage failed:', error instanceof Error ? error.message : 'unknown error');
    return res.status(503).json({ error: 'Comments are temporarily unavailable' });
  }
}
