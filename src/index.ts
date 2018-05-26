import store from './store';
import { lookupRouter } from './router';
import { VK_TAB } from './types/flags';

callbacks = lookupRouter;

store.subscribe(() => window.Repaint());
