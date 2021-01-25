import React, { useCallback, useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import PokemonGrid from '../../components/PokemonGrid';
import './styles.sass';
import { observer } from 'mobx-react-lite';
import { PokemonsContext } from '../../context/pokemons';
import { GlobalContext } from '../../context/global';
import ResponsivePagination from '../../components/UI/ResponsivePagination';
import SearchField from '../../components/SearchField';
import { useHistory } from 'react-router-dom';
import TagModal from '../../components/TagModal';
import TypesSelection from '../../components/TagModal/TypesSelection';
import {
  ArrayParam,
  NumberParam,
  StringParam,
  useQueryParam,
  withDefault
} from 'use-query-params';
import HelperService from '../../services/HelperService';
import config from '../../config';

const PokemonSearch = () => {
  const PokemonsStore = useContext(PokemonsContext);
  const globalStore = useContext(GlobalContext);
  const history = useHistory();

  const [limit, setLimit] = useQueryParam(
    'limit',
    withDefault(NumberParam, 10)
  );

  const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 1));

  const [filterName, setFilterName] = useQueryParam('name', StringParam);

  const [filterTypes, setFilterTypes] = useQueryParam(
    'types',
    withDefault(ArrayParam, [])
  );

  const onPageChange = useCallback(
    (event, value) => {
      setPage(value);
      PokemonsStore.setFetchState();
    },
    [setPage, PokemonsStore]
  );

  const searchName = useCallback(
    (value) => {
      setFilterName(value);
      setPage(1);
      PokemonsStore.setFetchState();
    },
    [setFilterName, PokemonsStore, setPage]
  );

  const onPokemonClick = useCallback(
    (id) => () => {
      history.push(`pokemon/${id}`);
    },
    [history]
  );

  const clearFilterName = useCallback(() => {
    if (filterName) {
      setFilterName(undefined);
      setPage(1);
      PokemonsStore.setFetchState();
    }
  }, [setFilterName, filterName, PokemonsStore, setPage]);

  const onLimitChange = useCallback(
    (event) => {
      setLimit(event.target.value);
      PokemonsStore.setFetchState();
    },
    [setLimit, PokemonsStore]
  );

  const setFilterTypesToState = useCallback(
    (types) => {
      setFilterTypes(Array.from(types));
      setPage(1);
      PokemonsStore.setIndexState();
    },
    [setFilterTypes, PokemonsStore, setPage]
  );

  const validateParams = useCallback(() => {
    if (PokemonsStore.state === 'fetch') {
      HelperService.validatePage(
        page,
        setPage,
        HelperService.getNameFilteredElements(
          PokemonsStore.pokemonsNames,
          filterName
        ),
        limit
      );
    }
    HelperService.validateLimit(limit, setLimit, config.pokemonLimits);
    HelperService.validateTypes(
      filterTypes,
      setFilterTypes,
      config.pokemonTypes
    );
  }, [
    setFilterTypes,
    PokemonsStore,
    filterName,
    setLimit,
    setPage,
    page,
    limit,
    filterTypes
  ]);

  useEffect(() => {
    if (document.title !== 'Pokedex') {
      document.title = 'Pokedex';
    }
    if (PokemonsStore.state === 'index' && globalStore.state === 'idle') {
      PokemonsStore.indexPokemons(filterTypes);
    }
    if (PokemonsStore.state === 'fetch') {
      validateParams();
      PokemonsStore.fetchPokemons(page, limit, filterName);
    }
  }, [
    PokemonsStore,
    filterTypes,
    filterName,
    page,
    limit,
    validateParams,
    globalStore,
    globalStore.state,
    PokemonsStore.state,
    PokemonsStore.fetchPokemons,
    PokemonsStore.indexPokemons
  ]);

  const isAddToFavoriteDisabled =
    !globalStore.isAuthorized ||
    globalStore.isLoading ||
    globalStore.state === 'changeFavoriteState';

  return (
    <Container className="pokemon-search" maxWidth="md">
      <SearchField
        onRequestSearch={searchName}
        isDisabled={globalStore.isLoading}
        onCancelSearch={clearFilterName}
        pokemonsNames={PokemonsStore.pokemonsNames}
        defaultValue={filterName}
      />
      <TagModal
        tags={new Set(filterTypes)}
        setTags={setFilterTypesToState}
        name={'Types'}
        isDisabled={globalStore.isLoading}
      >
        <TypesSelection />
      </TagModal>
      <PokemonGrid
        onPokemonClick={onPokemonClick}
        changePokemonFavorState={globalStore.changePokemonFavorState}
        favoritePokemons={globalStore.user.favoritePokemons}
        isLoading={globalStore.isLoading}
        isAuthorized={globalStore.isAuthorized}
        pokemons={PokemonsStore.pokemons}
        addToFavoriteDisabled={isAddToFavoriteDisabled}
      />
      <ResponsivePagination
        page={page}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        limit={limit}
        totalElements={HelperService.getNameFilteredElements(
          PokemonsStore.pokemonsNames,
          filterName
        )}
        isLoading={globalStore.isLoading}
      />
    </Container>
  );
};

export default observer(PokemonSearch);
