class Strategy {
  #strategies = new Map();
  #strategyName;
  #actions;

  constructor(strategyName, actions) {
    this.#strategyName = strategyName;
    this.#actions = actions;
  }

  registerBehaviour(implName, behaviour) {
    this.#validateBehaviour(implName, behaviour);
    this.#strategies.set(implName, behaviour);
  }

  getBehaviour(name, action) {
    const behaviour = this.#strategies.get(name);
    if (!behaviour) {
      throw new Error(`Strategy "${name}" is not found`);
    }
    const handler = behaviour[action];
    if (!handler) {
      throw new Error(`Action "${action}" for strategy "${name}" is not found`);
    }
    return handler;
  }

  #validateBehaviour(name, behaviour) {
    if (!name || typeof name !== 'string') {
      throw new Error('Implementation name is invalid');
    }
    if (typeof behaviour !== 'object' || behaviour === null) {
      throw new Error('Behaviour expected to be an object');
    }
    for (const action of this.#actions) {
      if (!(action in behaviour)) {
        throw new Error(`Key "${action}" expected to be present in behaviour`);
      }
    }
  }
}

module.exports = Strategy;
