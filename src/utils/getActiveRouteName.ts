export const getActiveRouteName = state => {
  if (!state || !state.routes) {
    return null;
  }

  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.params?.screen ? route.params.screen : route.name;
};
