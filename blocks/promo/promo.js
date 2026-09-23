import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const buttonRows = [...block.children].filter((row) => row.querySelector(':scope > div > .button-wrapper'));
  if (buttonRows.length) {
    const wrapper = document.createElement('div');
    wrapper.className = 'promo-buttons';
    buttonRows.forEach((row) => {
      const buttonWrapper = row.querySelector('.button-wrapper');
      moveInstrumentation(row, buttonWrapper);
      wrapper.append(buttonWrapper);
      row.remove();
    });
    block.append(wrapper);
  }
}
