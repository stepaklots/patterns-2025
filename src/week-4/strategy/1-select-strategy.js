const selectStrategy = (strategies, name) => {
  const strategy = strategies[name] ?? strategies.abstract;
  if (typeof strategy !== 'function') {
    throw new Error(`Invalid strategy: ${name}`);
  }
  return data => strategy(data);
}

module.exports = selectStrategy;
