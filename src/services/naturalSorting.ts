const naturalSorting = (a: string, b: string) => {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

export default naturalSorting;
