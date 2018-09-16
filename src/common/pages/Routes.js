import loadable from 'loadable-components';
import LoadingComponent from '../components/Loader';

export const Home = loadable(
  () => import(/* webpackChunkName: 'home' */ './Home'),
  {
    LoadingComponent
  }
);
export const User = loadable(
  () => import(/* webpackChunkName: 'user' */ './User'),
  {
    LoadingComponent
  }
);
export const About = loadable(
  () => import(/* webpackChunkName: 'about' */ './About'),
  {
    LoadingComponent
  }
);
