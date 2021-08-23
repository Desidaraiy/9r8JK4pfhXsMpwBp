
import HomePage from '../pages/home.vue';

import CatalogPage from '../pages/catalog.vue';

import SettingsPage from '../pages/settings.vue';

import StatSettings from '../pages/statssettings.vue';

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
    path: '/stat_settings/',
    component: StatSettings
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
