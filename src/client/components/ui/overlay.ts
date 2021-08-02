import {
  OVERLAY_CONTAINER_ID,
  OVERLAY_BACKGROUND_ID,
} from '../../constants/ui';

let OVERLAYS = [];

function create(overlayId: string, closeCb?: () => void, darkTheme?: boolean) {
  const overlayContainer = document.getElementById(OVERLAY_CONTAINER_ID);
  const overlay = document.createElement('div');
  overlay.className = 'ui-overlay';
  darkTheme && overlay.classList.add('ui-overlay--dark');
  if (!OVERLAYS.length) document.body.classList.add('hidden');
  OVERLAYS.push(overlayId);
  overlay.setAttribute('id', OVERLAY_BACKGROUND_ID + '-' + overlayId);
  overlay.addEventListener('click', close.bind(this, closeCb, overlayId));
  overlayContainer.appendChild(overlay);
}

function close(closeCb?, overlayId?) {
  const overlayContainer = document.getElementById(OVERLAY_CONTAINER_ID);
  const overlay = document.getElementById(
    OVERLAY_BACKGROUND_ID + '-' + overlayId
  );
  OVERLAYS = OVERLAYS.filter((x) => x !== overlayId);
  if (!OVERLAYS.length) document.body.classList.remove('hidden');
  closeCb && closeCb();
  overlay.removeEventListener('click', close);
  overlayContainer.removeChild(overlay);
}

export default {
  create,
  close,
};
