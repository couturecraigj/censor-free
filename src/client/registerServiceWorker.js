const __RUN_SW__ = process.env.USE_SW === 'true';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    // eslint-disable-next-line no-console
    console.log('Registering Service Worker');
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        if (!__RUN_SW__)
          registration.unregister().then(() => {
            // eslint-disable-next-line no-console
            console.log('Unregistered SW');
          });
      })
      .catch(function(error) {
        // registration failed
        // eslint-disable-next-line no-console
        console.log('Registration failed with ' + error);
      });
  }
};

export default registerServiceWorker();
