const buttons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.subject');
const search = document.querySelector('#search');
let filter = 'all';
function update() {
  const query = search.value.trim().toLocaleLowerCase('el').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let visible = 0;
  cards.forEach(card => {
    const searchable = card.dataset.search.toLocaleLowerCase('el').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const match = (filter === 'all' || card.dataset.subject === filter) && searchable.includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  document.querySelector('#empty').hidden = visible !== 0;
}
buttons.forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  buttons.forEach(item => item.classList.toggle('selected', item === button));
  update();
}));
search.addEventListener('input', update);
