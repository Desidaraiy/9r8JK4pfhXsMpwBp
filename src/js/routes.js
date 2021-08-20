
import HomePage from '../pages/home.vue';

import CatalogPage from '../pages/catalog.vue';

import SettingsPage from '../pages/settings.vue';

import NotFoundPage from '../pages/404.vue';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/settings/',
    component: SettingsPage
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
