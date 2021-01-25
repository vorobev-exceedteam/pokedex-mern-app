import React, {memo} from 'react';
import Grid from '@material-ui/core/Grid';
import PokemonCard from './PokemonCard';
import './styles.sass';

const PokemonGrid = (props) => {

  return (
      <Grid className={'pokemon-grid'} container spacing={4}>
        {!props.isLoading
          ? props.pokemons.map((pokemon) => (
              <Grid key={pokemon.id} item xs={12} sm={4} md={3}>
                <PokemonCard
                  isFavorite={props.favoritePokemons.has(pokemon.id)}
                  changePokemonFavorState={props.changePokemonFavorState}
                  onCardClick={props.onPokemonClick(pokemon.id)}
                  pokemon={pokemon}
                  addToFavoriteDisabled={props.addToFavoriteDisabled}
                />
              </Grid>
            ))
          : null}
      </Grid>
  );
};

export default memo(PokemonGrid);
