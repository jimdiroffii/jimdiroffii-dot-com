/***
 * JavaScript to handle copy-to-clipboard functionality for code blocks.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
      const wrapper = button.closest('.code-block');
      const raw = wrapper?.querySelector('.code-raw');

      // Prefer raw code (exact). Fallback to highlighted code only if needed.
      let text = raw?.textContent ?? wrapper?.querySelector('code')?.textContent ?? '';
      text = text.replace(/\n+$/, ''); // trim trailing blank lines

      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const originalIcon = button.innerHTML;
        button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        setTimeout(() => (button.innerHTML = originalIcon), 2000);
      }).catch(err => console.error('Failed to copy: ', err));
    });
  });
});
