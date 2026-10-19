'use strict';
(function () {
  const form = document.getElementById('revx-contact-form');
  if (!form) return;
  const select = document.getElementById('objet');
  const allowed = new Set(['prestation', 'solution', 'autre']);
  const requested = new URLSearchParams(location.search).get('objet');
  if (allowed.has(requested)) select.value = requested;

  const notice = document.getElementById('form-feedback');
  const submit = form.querySelector('[type="submit"]');
  function showMessage(message, error = false) {
    notice.textContent = message;
    notice.hidden = false;
    notice.classList.toggle('is-error', error);
    notice.focus();
  }
  const isLocalPreview = location.protocol === 'file:' ||
    ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    if (isLocalPreview) {
      showMessage('Aperçu local : aucun message n’a été envoyé. L’envoi du formulaire est désactivé dans cet aperçu.', true);
      return;
    }
    if (!window.fetch || !window.FormData || !window.AbortController) {
      showMessage('L’envoi nécessite un navigateur récent. Vous pouvez écrire à contact@revx-systems.fr.', true);
      return;
    }
    // Le piège conserve son id et son style ; FormSubmit attend le nom _honey.
    if (form.elements.namedItem('_honey').value) {
      showMessage('Votre demande n’a pas pu être envoyée.', true);
      return;
    }
    submit.disabled = true;
    notice.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
        credentials: 'omit',
        signal: controller.signal
      });
      const ct = response.headers.get('Content-Type') || '';
      if (!ct.includes('application/json')) throw new Error('Réponse serveur inattendue');
      const result = await response.json();
      // Une réponse JSON seule ne confirme pas l'envoi.
      const confirmed = result?.success === true || result?.success === 'true';
      if (!response.ok || !confirmed || result.ok === false || result.ok === 'false' || result.error) {
        throw new Error('Envoi non confirmé par FormSubmit');
      }
      window.location.assign('merci.html');
    } catch (error) {
      showMessage('Votre demande n’a pas pu être transmise. Réessayez ou écrivez à contact@revx-systems.fr.', true);
      submit.disabled = false;
    } finally {
      clearTimeout(timeout);
    }
  });
})();
