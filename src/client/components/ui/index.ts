import overlay from './overlay';

export default {
  overlay,
  createId: () => Math.floor(Math.random() * 1000000000000000).toString(),
};
