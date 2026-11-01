import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type Comment = { id: string; name: string; message: string; created_at: string };
let authClient: Promise<SupabaseClient> | undefined;
function auth() {
  return authClient ??= fetch('/api/comments?config=1').then(async response => {
    if (!response.ok) throw new Error('Not configured');
    const config = await response.json() as { url: string; anonKey: string };
    return createClient(config.url, config.anonKey);
  }).catch(error => { authClient = undefined; throw error; });
}

function addDiscussion(container: HTMLElement, room: string, expanded = false) {
  const details = document.createElement('details');
  details.className = 'discussion';
  details.open = expanded;
  details.innerHTML = `<summary><span>✳</span> Συζήτηση <span class="discussion-toggle">Άνοιγμα ↗</span></summary>
    <div class="discussion-body"><p class="discussion-intro">Μοιράσου μια απορία ή βοήθησε έναν συμμαθητή σου.</p>
    <div class="discussion-auth"><form class="auth-form"><label class="auth-name" hidden>Όνομα χρήστη <input name="name" maxlength="40" autocomplete="nickname"></label>
    <label>Email <input name="email" type="email" required autocomplete="email"></label><label>Κωδικός <input name="password" type="password" minlength="6" required autocomplete="current-password"></label>
    <div class="auth-actions"><button type="submit">Σύνδεση</button><button class="auth-switch" type="button">Δημιουργία λογαριασμού</button></div></form><div class="signed-in" hidden><span></span> <button type="button">Αποσύνδεση</button></div></div>
    <form class="discussion-form" hidden><label>Το σχόλιό σου <textarea name="message" required maxlength="2000" rows="3" placeholder="Γράψε εδώ την απορία σου..."></textarea></label>
    <button type="submit">Δημοσίευση <span aria-hidden="true">↗</span></button></form><p class="discussion-status" role="status" aria-live="polite"></p><div class="discussion-list"></div></div>`;
  container.append(details);
  const login = details.querySelector<HTMLFormElement>('.auth-form')!;
  const nameLabel = details.querySelector<HTMLElement>('.auth-name')!;
  const nameInput = login.elements.namedItem('name') as HTMLInputElement;
  const submitLogin = login.querySelector<HTMLButtonElement>('[type=submit]')!;
  const changeMode = login.querySelector<HTMLButtonElement>('.auth-switch')!;
  const signedIn = details.querySelector<HTMLElement>('.signed-in')!;
  const form = details.querySelector<HTMLFormElement>('.discussion-form')!;
  const status = details.querySelector<HTMLElement>('.discussion-status')!;
  const list = details.querySelector<HTMLElement>('.discussion-list')!;
  let signup = false;
  let loaded = false;

  async function syncAccount() {
    const client = await auth();
    const { data: { session } } = await client.auth.getSession();
    login.hidden = !!session;
    signedIn.hidden = !session;
    form.hidden = !session;
    signedIn.querySelector('span')!.textContent = session ? `Συνδέθηκες ως ${session.user.user_metadata.display_name ?? 'μαθητής'}` : '';
  }
  function display(comments: Comment[]) {
    list.replaceChildren();
    if (!comments.length) {
      const empty = document.createElement('p');
      empty.className = 'discussion-empty';
      empty.textContent = 'Δεν υπάρχουν σχόλια ακόμα. Ξεκίνα τη συζήτηση!';
      list.append(empty);
    }
    for (const comment of comments) {
      const item = document.createElement('article'); item.className = 'discussion-comment';
      const meta = document.createElement('div'); meta.className = 'discussion-meta';
      const author = document.createElement('strong'); author.textContent = comment.name;
      const time = document.createElement('time'); time.dateTime = comment.created_at;
      time.textContent = new Intl.DateTimeFormat('el-GR', { dateStyle: 'medium' }).format(new Date(comment.created_at));
      const text = document.createElement('p'); text.textContent = comment.message;
      meta.append(author, time); item.append(meta, text); list.append(item);
    }
  }
  async function refresh() {
    status.textContent = 'Φόρτωση σχολίων…';
    try {
      await syncAccount();
      const response = await fetch(`/api/comments?room=${encodeURIComponent(room)}`);
      if (!response.ok) throw new Error();
      display(await response.json() as Comment[]); status.textContent = ''; loaded = true;
    } catch { status.textContent = 'Η συζήτηση δεν είναι διαθέσιμη αυτή τη στιγμή. Δοκίμασε ξανά αργότερα.'; }
  }
  changeMode.addEventListener('click', () => {
    signup = !signup; nameLabel.hidden = !signup; nameInput.required = signup;
    submitLogin.textContent = signup ? 'Εγγραφή' : 'Σύνδεση';
    changeMode.textContent = signup ? 'Έχω ήδη λογαριασμό' : 'Δημιουργία λογαριασμού';
    (login.elements.namedItem('password') as HTMLInputElement).autocomplete = signup ? 'new-password' : 'current-password';
  });
  login.addEventListener('submit', async event => {
    event.preventDefault(); submitLogin.disabled = true;
    try {
      const client = await auth(); const values = new FormData(login);
      const email = String(values.get('email')); const password = String(values.get('password'));
      const name = String(values.get('name') ?? '').trim();
      if (signup && !name) { status.textContent = 'Συμπλήρωσε το όνομα χρήστη σου.'; return; }
      const result = signup
        ? await client.auth.signUp({ email, password, options: { data: { display_name: name }, emailRedirectTo: location.origin + location.pathname } })
        : await client.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      login.reset();
      await syncAccount();
      status.textContent = signup && !result.data.session ? 'Έλεγξε το email σου για να επιβεβαιώσεις τον λογαριασμό σου.' : 'Συνδέθηκες!';
    } catch { status.textContent = 'Δεν ήταν δυνατή η σύνδεση ή η εγγραφή. Έλεγξε τα στοιχεία σου και δοκίμασε ξανά.'; }
    finally { submitLogin.disabled = false; }
  });
  signedIn.querySelector('button')!.addEventListener('click', async () => { try { await (await auth()).auth.signOut(); await syncAccount(); } catch { status.textContent = 'Δεν ήταν δυνατή η αποσύνδεση.'; } });
  form.addEventListener('submit', async event => {
    event.preventDefault(); const button = form.querySelector<HTMLButtonElement>('button')!; button.disabled = true;
    try {
      const { data: { session } } = await (await auth()).auth.getSession();
      if (!session) { await syncAccount(); throw new Error(); }
      const message = String(new FormData(form).get('message'));
      const response = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ room, message }) });
      if (!response.ok) throw new Error();
      (form.elements.namedItem('message') as HTMLTextAreaElement).value = ''; await refresh();
    } catch { status.textContent = 'Το σχόλιο δεν αποθηκεύτηκε. Συνδέσου ξανά και δοκίμασε.'; }
    finally { button.disabled = false; }
  });
  details.addEventListener('toggle', () => { if (details.open && !loaded) void refresh(); });
  if (expanded) void refresh();
}

const paper = location.pathname.match(/^\/(math|physics)-(2025|2026)\.html$/);
if (paper) for (const question of document.querySelectorAll<HTMLElement>('.question[id]')) addDiscussion(question, `${paper[1]}-${paper[2]}-${question.id}`);
for (const element of document.querySelectorAll<HTMLElement>('[data-discussion]')) addDiscussion(element, element.dataset.discussion!, true);
