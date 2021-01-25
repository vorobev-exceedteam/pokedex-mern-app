import PokemonSearch from '../pages/PokemonSearch';
import PokemonPage from '../pages/PokemonPage';
import {PokemonsProvider} from '../context/pokemons';
import {PokemonProvider} from '../context/pokemon';
import Login from '../pages/Login';
import Signup from "../pages/Signup";
import {AuthProvider} from "../context/auth";
import Profile from "../pages/Profile";
import {ProfileProvider} from "../context/profile";

const routes = [
  {
    path: '/',
    component: PokemonSearch,
    storeProvider: PokemonsProvider
  },
  {
    path: '/pokemon/:id',
    component: PokemonPage,
    storeProvider: PokemonProvider
  },
  {
    path: '/login',
    component: Login,
    storeProvider: AuthProvider,
    protected: 'unauthorized',
    redirect: '/'
  },
  {
    path: '/signup',
    component: Signup,
    storeProvider: AuthProvider,
    protected: 'unauthorized',
    redirect: '/'
  },
  {
    path: '/profile',
    component: Profile,
    storeProvider: ProfileProvider,
    protected: 'authorized',
    redirect: '/login'
  }
];

export default routes;
