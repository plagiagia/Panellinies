const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
const cards = document.querySelectorAll<HTMLElement>('.subject');
const search = document.querySelector<HTMLInputElement>('#search');
const empty = document.querySelector<HTMLElement>('#empty');

if (!search || !empty) {
  throw new Error('The subject search interface could not be found.');
}

let filter = 'all';

function normalize(value: string): string {
  return value.toLocaleLowerCase('el').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function update(): void {
  const query = normalize(search!.value.trim());
  let visible = 0;
  cards.forEach(card => {
    const searchable = normalize(card.dataset.search ?? '');
    const match = (filter === 'all' || card.dataset.subject === filter) && searchable.includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  empty!.hidden = visible !== 0;
}

buttons.forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter ?? 'all';
  buttons.forEach(item => item.classList.toggle('selected', item === button));
  update();
}));
search.addEventListener('input', update);
