const filterStorageKeys = (storagedKeys: string[]) => {
  const formattedCoursesKeys: string[] = storagedKeys.filter(
    (key) => !['loglevel:webpack-dev-server', '@HAS_ONBOARDING'].includes(key)
  );

  return formattedCoursesKeys;
};

export default filterStorageKeys;
