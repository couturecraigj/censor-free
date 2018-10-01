const registerServiceWorker = async () => {
  // eslint-disable-next-line no-console
  console.log('Registering Service Worker');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
};

export default registerServiceWorker();
