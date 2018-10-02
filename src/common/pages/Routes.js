import loadable from 'loadable-components';
import LoadingComponent from '../components/Loader';

export const About = loadable(
  () => import(/* webpackChunkName: 'about' */ './About'),
  {
    LoadingComponent
  }
);

export const Login = loadable(
  () => import(/* webpackChunkName: 'login' */ './Account/Login'),
  {
    LoadingComponent
  }
);
export const SignUp = loadable(
  () => import(/* webpackChunkName: 'signup' */ './Account/SignUp'),
  {
    LoadingComponent
  }
);
export const ForgotPassword = loadable(
  () =>
    import(/* webpackChunkName: 'forgot-password' */ './Account/ForgotPassword'),
  {
    LoadingComponent
  }
);
export const Profile = loadable(
  () => import(/* webpackChunkName: 'profile' */ './Account/Profile'),
  {
    LoadingComponent
  }
);
export const Reset = loadable(
  () => import(/* webpackChunkName: 'profile' */ './Account/Reset'),
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

export const CompanyList = loadable(
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
export const Group = loadable(
  () => import(/* webpackChunkName: 'group' */ './Group'),
  {
    LoadingComponent
  }
);

export const GroupList = loadable(
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
export const Product = loadable(
  () => import(/* webpackChunkName: 'product' */ './Product'),
  {
    LoadingComponent
  }
);

export const ProductList = loadable(
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
export const User = loadable(
  () => import(/* webpackChunkName: 'user' */ './User'),
  {
    LoadingComponent
  }
);

export const UserList = loadable(
  () => import(/* webpackChunkName: 'user-list' */ './User/List'),
  {
    LoadingComponent
  }
);

export const ErrorPage = loadable(
  () => import(/* webpackChunkName: 'error-page' */ './Error'),
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

export const VideoList = loadable(
  () => import(/* webpackChunkName: 'video-list' */ './Video/List'),
  {
    LoadingComponent
  }
);
