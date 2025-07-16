'use strict';

class Timer extends EventTarget {
  #counter = 0;

  constructor({ eventName, delay }) {
    super();
    setInterval(() => {
      const step = this.#counter++;
      const data = { detail: { step } };
      const event = new CustomEvent(eventName, data);
      this.dispatchEvent(event);
    }, delay);
  }
}

// Usage

const eventName = 'step';
const timer = new Timer({ eventName, delay: 1000 });

timer.addEventListener(eventName, (event) => {
  console.log({ event, detail: event.detail });
});
