'use strict';

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

// Usage

const strategy = new Strategy('agent', ['notify', 'multicast']);

const email = {
  name: 'email',
  behaviour: {
    notify: (to, message) => {
      console.log(`Sending "email" notification to <${to}>`);
      console.log(`message length: ${message.length}`);
    },
    multicast: (message) => {
      console.log(`Sending "email" notification to all`);
      console.log(`message length: ${message.length}`);
    },
  }
}

const sms = {
  name: 'sms',
  behaviour: {
    notify: (to, message) => {
      console.log(`Sending "sms" notification to <${to}>`);
      console.log(`message length: ${message.length}`);
    },
    multicast: (message) => {
      console.log(`Sending "sms" notification to all`);
      console.log(`message length: ${message.length}`);
    },
  }
};

strategy.registerBehaviour(email.name, email.behaviour);
strategy.registerBehaviour(sms.name, sms.behaviour);

const action = strategy.getBehaviour('sms', 'notify');
action('+380501234567', 'Hello world');
