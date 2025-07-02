declare class Strategy {
  #strategies: Map<string, Function[]>;
  #strategyName: string;
  #actions: string[];

  constructor(
    strategyName: string,
    actions: string[],
  );

  registerBehaviour(
    implName: string,
    behaviour: object,
  ): void;

  getBehaviour(
    name: string,
    action: string,
  ): Function;
}

export default Strategy;
