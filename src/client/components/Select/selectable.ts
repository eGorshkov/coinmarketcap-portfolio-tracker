import ui from '../ui';
import { OVERLAY_CONTAINER_ID } from '../../constants/ui';
import type {
  Option,
  OptionSelectEventDetail,
  SelectableType,
} from '../../../common/types';
import Dropdown from './Dropdown.svelte';

function selectable(node, options: SelectableType) {
  const overlayContainer = document.getElementById(OVERLAY_CONTAINER_ID);
  let dropdown;

  function open() {
    const overlayId = ui.createId();
    ui.overlay.create(overlayId, close);
    dropdown = new Dropdown({
      target: overlayContainer,
      props: {
        optionClick: (option: Option, selected: Option[]) => {
          node.dispatchEvent(
            new CustomEvent<OptionSelectEventDetail>('selected', {
              detail: { option, selected },
            })
          );

          if (!options.multiple) {
            ui.overlay.close(close, overlayId);
          }
        },
        position: node?.getBoundingClientRect(),
        ...options,
      },
    });
  }

  function close() {
    dropdown?.$destroy();
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

export default selectable;
