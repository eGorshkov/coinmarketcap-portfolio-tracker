import ui from '../ui';
import { OVERLAY_CONTAINER_ID } from '../../constants/ui';
import Modal from './Modal.svelte';
import type { ModalType } from '../../../common/types;;

function modal(node, options: ModalType) {
  const overlayContainer = document.getElementById(OVERLAY_CONTAINER_ID);
  let _modal;

  function open() {
    const overlayId = ui.createId();
    ui.overlay.create(overlayId, close, true);
    _modal = new Modal({
      target: overlayContainer,
      props: {
        onClose: (data) => {
          ui.overlay.close(close, overlayId);
          options.afterClosed && options.afterClosed(data);
        },
        ...options,
      },
    });
  }

  function close() {
    _modal?.$destroy();
  }

  node.addEventListener('click', open);

  return {
    update(_options) {
      options = _options;
    },
    destroy() {
      node.removeEventListener('click', open);
    },
  };
}

export default modal;
