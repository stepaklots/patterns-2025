type Level = 'warning' | 'error' | 'info';
type Color = '\x1b[1;33m' | '\x1b[0;31m' | '\x1b[1;37m';

type LoggerLevel = Level | Color;

// @ts-ignore
function main() {
  const logger = (option: LoggerLevel) => (message: string) => {
    let color: string;
    switch (option) {
      case 'warning':
        color = '\x1b[1;33m';
        break;
      case 'error':
        color = '\x1b[0;31m';
        break;
      case 'info':
        color = '\x1b[1;37m';
        break;
      default:
        color = option;
    }
    const date = new Date().toISOString();
    console.log(`${ color }${ date }\t${ message }`);
  };

  const warning = logger('warning');
  warning('Hello warning');

  const error = logger('error');
  error('Hello error');

  const info = logger('info');
  info('Hello info');
}

main();
