import { auth } from './auth';

const form = document.querySelector<HTMLFormElement>('#account-form')!;
const signedIn = document.querySelector<HTMLElement>('.account-signed-in')!;
const status = document.querySelector<HTMLElement>('.account-status')!;
const nameLabel = form.querySelector<HTMLElement>('.auth-name')!;
const nameInput = form.elements.namedItem('name') as HTMLInputElement;
const submit = form.querySelector<HTMLButtonElement>('[type=submit]')!;
const switchMode = form.querySelector<HTMLButtonElement>('.auth-switch')!;
const google = form.querySelector<HTMLButtonElement>('.google-signin')!;
let signup = false;

function returnToPage() {
  const destination = sessionStorage.getItem('account-return');
  sessionStorage.removeItem('account-return');
  sessionStorage.removeItem('account-pending');
  if (destination?.startsWith('/') && !destination.startsWith('//')) location.assign(destination);
  else location.assign('/');
}

async function updateAccount() {
  const { data: { session } } = await (await auth()).auth.getSession();
  if (session && sessionStorage.getItem('account-pending')) { returnToPage(); return; }
  form.hidden = !!session;
  signedIn.hidden = !session;
  const name = session?.user.user_metadata.display_name ?? session?.user.user_metadata.given_name ?? 'Μαθητής';
  signedIn.querySelector('p')!.textContent = session ? `Συνδέθηκες ως ${String(name).slice(0, 40)}.` : '';
}

switchMode.addEventListener('click', () => {
  signup = !signup; nameLabel.hidden = !signup; nameInput.required = signup;
  submit.textContent = signup ? 'Εγγραφή' : 'Σύνδεση';
  switchMode.textContent = signup ? 'Έχω ήδη λογαριασμό' : 'Δημιουργία λογαριασμού';
  (form.elements.namedItem('password') as HTMLInputElement).autocomplete = signup ? 'new-password' : 'current-password';
});
google.addEventListener('click', async () => {
  google.disabled = true;
  try {
    sessionStorage.setItem('account-pending', '1');
    const { error } = await (await auth()).auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/account.html' } });
    if (error) throw error;
  } catch {
    sessionStorage.removeItem('account-pending');
    status.textContent = 'Δεν ήταν δυνατή η σύνδεση με Google. Δοκίμασε ξανά αργότερα.';
    google.disabled = false;
  }
});
form.addEventListener('submit', async event => {
  event.preventDefault(); submit.disabled = true;
  try {
    const client = await auth(); const values = new FormData(form);
    const email = String(values.get('email')); const password = String(values.get('password'));
    const name = String(values.get('name') ?? '').trim();
    if (signup && !name) { status.textContent = 'Συμπλήρωσε το όνομα χρήστη σου.'; return; }
    const result = signup
      ? await client.auth.signUp({ email, password, options: { data: { display_name: name }, emailRedirectTo: location.origin + '/account.html' } })
      : await client.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    if (result.data.session) { returnToPage(); return; }
    status.textContent = 'Έλεγξε το email σου για να επιβεβαιώσεις τον λογαριασμό σου.';
  } catch { status.textContent = 'Δεν ήταν δυνατή η σύνδεση ή η εγγραφή. Έλεγξε τα στοιχεία σου και δοκίμασε ξανά.'; }
  finally { submit.disabled = false; }
});
signedIn.querySelector('button')!.addEventListener('click', async () => {
  try { await (await auth()).auth.signOut(); await updateAccount(); window.dispatchEvent(new Event('discussion-auth-changed')); }
  catch { status.textContent = 'Δεν ήταν δυνατή η αποσύνδεση.'; }
});
void updateAccount().catch(() => { status.textContent = 'Η σύνδεση δεν είναι διαθέσιμη αυτή τη στιγμή.'; });
