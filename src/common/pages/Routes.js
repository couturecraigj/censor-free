import loadable from 'loadable-components';
import LoadingComponent from '../components/Loader';

export const About = loadable(
  () => import(/* webpackChunkName: 'about' */ './About'),
  {
    LoadingComponent
  }
);

const Company = loadable(
  () => import(/* webpackChunkName: 'company' */ './Company'),
  {
    LoadingComponent
  }
);
Company.List = loadable(
  () => import(/* webpackChunkName: 'company-list' */ './Company/List'),
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
const Group = loadable(
  () => import(/* webpackChunkName: 'group' */ './Group'),
  {
    LoadingComponent
  }
);
Group.List = loadable(
  () => import(/* webpackChunkName: 'group-list' */ './Group/List'),
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
const Product = loadable(
  () => import(/* webpackChunkName: 'product' */ './Product'),
  {
    LoadingComponent
  }
);
Product.List = loadable(
  () => import(/* webpackChunkName: 'product-list' */ './Product/List'),
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
const User = loadable(() => import(/* webpackChunkName: 'user' */ './User'), {
  LoadingComponent
});
User.List = loadable(
  () => import(/* webpackChunkName: 'user-list' */ './User/List'),
  {
    LoadingComponent
  }
);

const Video = loadable(
  () => import(/* webpackChunkName: 'video' */ './Video'),
  {
    LoadingComponent
  }
);
Video.List = loadable(
  () => import(/* webpackChunkName: 'video-list' */ './Video/List'),
  {
    LoadingComponent
  }
);

export { Company, User, Video, Group, Product };
