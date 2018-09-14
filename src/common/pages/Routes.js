import loadable from "loadable-components";
import LoadingComponent from "../components/Loader";

export const Home = loadable(
  () => import(/* webpackChunkName: 'home' */ "./Home"),
  {
    LoadingComponent
  }
);
export const About = loadable(() => import("./About"), {
  LoadingComponent
});
