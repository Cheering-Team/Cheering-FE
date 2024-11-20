export type ValueOf<T> = T[keyof T];

export type NavigationPropType<T> = {
  screen?: keyof T;
  params?: ValueOf<T>;
};
