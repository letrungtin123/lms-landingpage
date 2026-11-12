/**
 * WordPress release layer for the Photo Retouch standalone (inlined by
 * build-photo-retouch-standalone.ps1; not part of the source repository).
 *
 * /nesso-retouch-thank-you/ renders the /nesso-retouch/ page, whose wrapper loads
 * this document with #thank-you. Show the existing success modal over the landing
 * page. When the visitor closes it, drop the hash and ask the parent page to return
 * its URL to /nesso-retouch/.
 */
(function () {
  'use strict';

  if (window.location.hash !== '#thank-you') return;

  var overlay = document.getElementById('trialModalOverlay');
  var dialog = document.getElementById('trialModalDialog');
  var formStage = document.getElementById('trialFormStage');
  var successStage = document.getElementById('trialSuccessStage');
  var resetBtn = document.getElementById('trialResetBtn');
  if (!overlay || !dialog || !formStage || !successStage) return;

  // The source headline assumes one image; this view does not know the file count.
  var headline = successStage.querySelector('.success-headline');
  var sourceHeadline = headline ? headline.textContent : '';
  if (headline) headline.textContent = 'Test Images Received';

  // Same state as trial-modal.js showSubmissionSuccess(), without re-sending its success event.
  formStage.style.display = 'none';
  dialog.classList.add('is-success');
  successStage.classList.add('is-visible');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  if (resetBtn) {
    window.setTimeout(function () { resetBtn.focus({ preventScroll: true }); }, 150);
  }

  // trial-modal.js owns closing (Back to homepage, backdrop, Escape) and resets the form.
  var observer = new MutationObserver(function () {
    if (overlay.classList.contains('is-open')) return;
    observer.disconnect();
    if (headline) headline.textContent = sourceHeadline;
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'nesso-photo-retouch-thank-you-closed' }, window.location.origin);
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
})();
