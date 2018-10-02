const compress = (strings, ...vars) => {
  return strings
    .reduce((previous, current, index) => {
      return [...previous, current, vars[index] ? vars[index] : ''];
    }, [])
    .join('')
    .replace(/>\s+</g, '><');
};

const streamify = (res, string) => {
  return string.split('\\n').forEach(v => res.write(v));
};

export { compress, streamify };
