import loadable from 'loadable-components';
import LoadingComponent from '../components/Loader';

export const About = loadable(
  () => import(/* webpackChunkName: 'about' */ './About'),
  {
    LoadingComponent
  }
);
export const Company = loadable(
  () => import(/* webpackChunkName: 'company' */ './Company'),
  {
    LoadingComponent
  }
);
export const Feed = loadable(
  () => import(/* webpackChunkName: 'feed' */ './Feed'),
  {
    LoadingComponent
  }
);
export const Group = loadable(
  () => import(/* webpackChunkName: 'group' */ './Group'),
  {
    LoadingComponent
  }
);

export const Home = loadable(
  () => import(/* webpackChunkName: 'home' */ './Home'),
  {
    LoadingComponent
  }
);
export const Product = loadable(
  () => import(/* webpackChunkName: 'product' */ './Product'),
  {
    LoadingComponent
  }
);
export const Saved = loadable(
  () => import(/* webpackChunkName: 'saved' */ './Saved'),
  {
    LoadingComponent
  }
);
export const Search = loadable(
  () => import(/* webpackChunkName: 'search' */ './Search'),
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
export const Video = loadable(
  () => import(/* webpackChunkName: 'video' */ './Video'),
  {
    LoadingComponent
  }
);
