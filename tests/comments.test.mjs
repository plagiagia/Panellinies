import assert from 'node:assert/strict';
import handler from '../api/comments.js';

process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_ANON_KEY = 'public-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'secret-key';
const calls = [];
let metadata = { display_name: 'Student' };
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url: String(url), options });
  if (String(url).includes('/auth/v1/user')) {
    if (options.headers.Authorization === 'Bearer invalid') return new Response('{}', { status: 401 });
    return new Response(JSON.stringify({ id: 'user-1', user_metadata: metadata }), { status: 200 });
  }
  return new Response(JSON.stringify([]), { status: 200 });
};
async function call(method, query = {}, body = {}, headers = {}) {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await handler({ method, query, body, headers }, res);
  return res;
}
assert.equal((await call('POST', {}, { room: 'general', message: 'Hi' })).code, 401);
assert.equal((await call('POST', {}, { room: 'general', message: 'Hi' }, { authorization: 'Bearer invalid' })).code, 401);
assert.equal((await call('POST', {}, { room: 'bad', message: 'Hi' })).code, 400);
assert.equal((await call('POST', {}, { room: 'math', message: ' '.repeat(5) }, { authorization: 'Bearer token' })).code, 400);
assert.equal((await call('POST', {}, { room: 'physics-2025-b2', message: ' Hello ' }, { authorization: 'Bearer token' })).code, 201);
const sent = JSON.parse(calls.at(-1).options.body);
assert.deepEqual(sent, { room: 'physics-2025-b2', name: 'Student', message: 'Hello', user_id: 'user-1' });
metadata = { given_name: 'Maria', full_name: 'Maria Example' };
assert.equal((await call('POST', {}, { room: 'general', message: 'Hi' }, { authorization: 'Bearer token' })).code, 201);
assert.equal(JSON.parse(calls.at(-1).options.body).name, 'Maria');
metadata = {};
assert.equal((await call('POST', {}, { room: 'general', message: 'Hi' }, { authorization: 'Bearer token' })).code, 201);
assert.equal(JSON.parse(calls.at(-1).options.body).name, 'Μαθητής');
assert.equal((await call('GET', { room: 'general' })).code, 200);
assert.match(calls.at(-1).url, /room=eq\.general/);
assert.deepEqual((await call('GET', { config: '1' })).body, { url: 'https://example.supabase.co', anonKey: 'public-key' });
console.log('Validated comment room isolation, account requirement, and server-owned identity.');
