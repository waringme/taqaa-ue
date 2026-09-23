import { moveInstrumentation } from '../../scripts/scripts.js';

const ALL_CATEGORY = 'all';

/**
 * Shows only the accordion items matching the given category.
 * @param {Element} block The accordion block element
 * @param {string} category The category to filter by, or ALL_CATEGORY
 */
function filterByCategory(block, category) {
  block.querySelectorAll('.accordion-item').forEach((item) => {
    const itemCategory = item.dataset.category;
    const show = category === ALL_CATEGORY || !itemCategory || itemCategory === category;
    item.hidden = !show;
  });

  block.querySelectorAll('.accordion-filter button').forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.category === category ? 'true' : 'false');
  });
}

/**
 * Builds the category filter tabs above the accordion items.
 * @param {Element} block The accordion block element
 * @param {string[]} categories The unique categories found among the items
 * @returns {Element} The filter tabs container
 */
function buildFilter(block, categories) {
  const filter = document.createElement('div');
  filter.className = 'accordion-filter';

  const allButton = document.createElement('button');
  allButton.type = 'button';
  allButton.textContent = 'All';
  allButton.dataset.category = ALL_CATEGORY;
  filter.append(allButton);

  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = category;
    button.dataset.category = category;
    filter.append(button);
  });

  filter.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    filterByCategory(block, button.dataset.category);
  });

  allButton.setAttribute('aria-pressed', 'true');
  return filter;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const categories = [];
  const rows = [...block.children];
  const titleRow = rows.shift();
  const descriptionRow = rows.shift();

  const header = document.createDocumentFragment();
  if (titleRow) {
    const heading = document.createElement('h4');
    moveInstrumentation(titleRow, heading);
    heading.append(...titleRow.childNodes);
    header.append(heading);
    titleRow.remove();
  }
  if (descriptionRow) {
    const description = document.createElement('div');
    description.className = 'accordion-description';
    moveInstrumentation(descriptionRow, description);
    description.append(...descriptionRow.childNodes);
    header.append(description);
    descriptionRow.remove();
  }

  rows.forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    moveInstrumentation(label, summary);
    summary.append(...label.childNodes);

    const body = row.children[1];
    body.className = 'accordion-item-body';

    const categoryCell = row.children[2];
    const category = categoryCell?.textContent.trim();
    if (categoryCell) categoryCell.hidden = true;

    const details = document.createElement('details');
    details.className = 'accordion-item';
    moveInstrumentation(row, details);
    if (category) {
      details.dataset.category = category;
      if (!categories.includes(category)) categories.push(category);
    }
    details.append(summary, body);
    if (categoryCell) details.append(categoryCell);
    row.replaceWith(details);
  });

  if (categories.length) {
    block.prepend(buildFilter(block, categories));
  }
  block.prepend(header);
}
