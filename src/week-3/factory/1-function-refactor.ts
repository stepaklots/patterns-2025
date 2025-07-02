{
  const COLORS = {
    warning: '\x1b[1;33m',
    error: '\x1b[0;31m',
    info: '\x1b[1;37m',
  } as const;

  type Level = keyof typeof COLORS;
  type Color = (typeof COLORS)[Level];

  const logger = (option: Level | Color) => (message: string) => {
    const color = option in COLORS ? COLORS[option as Level] : option;
    const date = new Date().toISOString();
    console.log(`${ color }${ date }\t${ message }`);
  };

  const main = () => {
    const warning = logger('warning');
    warning('Hello warning');

    const error = logger('error');
    error('Hello error');

    const info = logger('info');
    info('Hello info');

    const wrong = logger('wrong');
    wrong('Hello wrong');

    const warningRaw = logger('\x1b[1;33m');
    warningRaw('Hello warning raw color');

    const errorRaw = logger('\x1b[0;31m');
    errorRaw('Hello error raw color');

    const infoRaw = logger('\x1b[1;37m');
    infoRaw('Hello info raw color');
  }

  main();
}
