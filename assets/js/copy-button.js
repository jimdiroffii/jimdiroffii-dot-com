/***
 * JavaScript to handle copy-to-clipboard functionality for code blocks.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const wrapper = button.closest('.code-block');
            const codeElement = wrapper.querySelector('.lntd:last-child code') || wrapper.querySelector('code');

            if (codeElement) {
                navigator.clipboard.writeText(codeElement.innerText).then(() => {
                    const originalIcon = button.innerHTML;
                    button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    setTimeout(() => {
                        button.innerHTML = originalIcon;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });
});