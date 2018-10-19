const { ms, s, m, h } = require('time-convert');

export const secondsToHours = total => {
  const [hours, minutes, seconds] = ms.to(h, m, s)(total * 1000);

  return `${hours ? `${hours}:` : ''}${
    hours ? ('' + minutes).padStart(2, '0') : minutes
  }:${('' + seconds).padStart(2, '0')}`;
};

export const millisecondsToHours = total => {
  const [hours, minutes, seconds] = ms.to(h, m, s)(total);

  return `${hours ? `${hours}:` : ''}${
    hours ? ('' + minutes).padStart(2, '0') : minutes
  }:${('' + seconds).padStart(2, '0')}`;
};
