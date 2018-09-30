const __PROD__ = process.env.NODE_ENV === 'production';

const registerServiceWorker = async () => {
  if (__PROD__) {
    // eslint-disable-next-line no-console
    console.log('Registering Service Worker');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }
};

export default registerServiceWorker();
