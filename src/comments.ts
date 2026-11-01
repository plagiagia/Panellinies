import { auth } from './auth';

type Comment = { id: string; name: string; message: string; created_at: string };

function addDiscussion(container: HTMLElement, room: string, expanded = false) {
  const details = document.createElement('details');
  details.className = 'discussion';
  details.open = expanded;
  details.innerHTML = `<summary><span>✳</span> Συζήτηση <span class="discussion-toggle">Άνοιγμα ↗</span></summary>
    <div class="discussion-body"><form class="discussion-form" hidden><label>Το σχόλιό σου <textarea name="message" required maxlength="2000" rows="3" placeholder="Γράψε εδώ την απορία σου..."></textarea></label>
    <button type="submit">Δημοσίευση <span aria-hidden="true">↗</span></button></form><p class="discussion-status" role="status" aria-live="polite"></p><div class="discussion-list"></div></div>`;
  container.append(details);
  const form = details.querySelector<HTMLFormElement>('form')!;
  const status = details.querySelector<HTMLElement>('.discussion-status')!;
  const list = details.querySelector<HTMLElement>('.discussion-list')!;
  let loaded = false;

  async function syncAccount() {
    const { data: { session } } = await (await auth()).auth.getSession();
    form.hidden = !session;
  }
  function display(comments: Comment[]) {
    list.replaceChildren();
    if (!comments.length) {
      const empty = document.createElement('p');
      empty.className = 'discussion-empty';
      empty.textContent = 'Δεν υπάρχουν σχόλια ακόμα.';
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
  window.addEventListener('discussion-auth-changed', () => { if (details.open) void syncAccount(); });
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
