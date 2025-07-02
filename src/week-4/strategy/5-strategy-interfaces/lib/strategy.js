'use strict';

const validateBehaviour = (name, behaviour, actions) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Implementation name is invalid');
  }
  if (typeof behaviour !== 'object' || behaviour === null) {
    throw new Error('Behaviour expected to be an object');
  }
  for (const action of actions) {
    if (!(action in behaviour)) {
      throw new Error(`Key "${action}" expected to be present in behaviour`);
    }
  }
}

const createStrategy = (name, actions) => {
  const strategies = new Map();

  const getBehaviour = (name, action) => {
    const behaviour = strategies.get(name);
    if (!behaviour) {
      throw new Error(`Strategy "${name}" is not found`);
    }
    const handler = behaviour[action];
    if (!handler) {
      throw new Error(`Action "${action}" for strategy "${name}" is not found`);
    }
    return handler;
  }

  const registerBehaviour = (implName, behaviour) => {
    validateBehaviour(implName, behaviour, actions);
    strategies.set(implName, behaviour);
  }

  return {
    registerBehaviour,
    getBehaviour,
  }
}

module.exports = createStrategy;
