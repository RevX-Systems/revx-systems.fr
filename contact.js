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
    showMessage('Envoi en cours…');
    const controller = new AbortController();
    // Une réponse lente ne prouve ni un succès ni un échec de l'envoi.
    const slow = setTimeout(() => {
      showMessage('L’envoi prend plus de temps que prévu. Patientez sans renvoyer le formulaire…');
    }, 15000);
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
        credentials: 'omit',
        keepalive: true,
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`FormSubmit HTTP ${response.status}`);
      const ct = response.headers.get('Content-Type') || '';
      if (!ct.includes('application/json')) throw new Error('Réponse serveur inattendue');
      const result = await response.json();
      if (result?.success === false || result?.success === 'false' ||
          result?.ok === false || result?.ok === 'false' || result?.error) {
        showMessage('Le service d’envoi a refusé la demande. Vous pouvez réessayer ou écrire à contact@revx-systems.fr.', true);
        return;
      }
      // La page de remerciement exige une confirmation explicite du service.
      const confirmed = result?.success === true || result?.success === 'true';
      if (!confirmed) throw new Error('Envoi non confirmé par FormSubmit');
      window.location.assign('merci.html');
    } catch (error) {
      console.warn('Formulaire contact : confirmation indisponible.', error);
      showMessage('Nous n’avons pas reçu de confirmation d’envoi. Votre message a peut-être été transmis. Pour éviter un doublon, ne renvoyez pas immédiatement le formulaire. Vous pouvez nous contacter à contact@revx-systems.fr.', true);
    } finally {
      clearTimeout(slow);
      clearTimeout(timeout);
      submit.disabled = false;
    }
  });
})();
