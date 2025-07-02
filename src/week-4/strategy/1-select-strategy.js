const selectStrategy = (strategies, name) => {
  const map = new Map(Object.entries(strategies));
  if (map.has(name)) {
    const strategy = map.get(name);
    return (data) => strategy(data);
  }
  console.error(`Strategy: "${name}" not found in ${JSON.stringify(Object.keys(strategies))}`);
  return (data) => strategies.abstract(data);
}

module.exports = selectStrategy;
