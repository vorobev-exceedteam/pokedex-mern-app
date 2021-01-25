import React, {useContext, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import './styles.sass';
import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Stats from '../../components/PokemonGrid/PokemonCard/Stats';
import {observer} from 'mobx-react-lite';
import {PokemonContext} from '../../context/pokemon';
import DescriptionCard from '../../components/DescriptionCard';
import {getColorTagStyle} from '../../services/PokemonService';
import {useParams} from 'react-router-dom';
import {GlobalContext} from '../../context/global';
import AvatarCard from '../../components/AvatarCard';
import FavoriteStateButton from '../../components/FavoriteStateButton';
import DescriptionButton from "../../components/DescriptionButton";


const PokemonPage = () => {
  const pokemonStore = useContext(PokemonContext);

  const xsMainGrid = 12;
  const smMainGrid = 6;

  /*  const abilityDescIcon = () => (
    <IconButton>
      <HelpOutlineIcon />
    </IconButton>
  );*/
  const { id } = useParams();

  const PokemonStore = useContext(PokemonContext);
  const {
    isAuthorized,
    isLoading,
    user,
    changePokemonFavorState,
    state
  } = useContext(GlobalContext);

  const isLoadingState = PokemonStore.state === 'load' || isLoading;
  const isAddToFavoriteDisabled =
    !isAuthorized || isLoading || state === 'changeFavoriteState';


  useEffect(() => {
    if (document.title !== ('Pokemon Page')) {
      document.title = 'Pokemon Page';
    }
    if (pokemonStore.state === 'load' && state === 'idle') {
      pokemonStore.getPokemon(id);
    }
  }, [pokemonStore, pokemonStore.getPokemon, pokemonStore.state, state, id]);

  const isFavorite = user.favoritePokemons.has(Number(id));

  return (
    <Container component={'main'} maxWidth={'md'}>
      <div className={'pokemon-container'}>
        {/*stats and art*/}
        <Grid justify={'center'} spacing={2} container>
          <Grid xs={xsMainGrid} sm={smMainGrid} item>
            <Grid container spacing={2}>
              <Grid xs={xsMainGrid} item>
                <AvatarCard
                  src={pokemonStore.pokemon.image}
                  name={pokemonStore.pokemon.name}
                  isLoading={isLoadingState}
                />
              </Grid>
              <Grid xs={xsMainGrid} item>
                <DescriptionCard
                  isLoading={isLoadingState}
                  title={'Attributes'}
                >
                  <Box mt={2}>
                    <Stats id={1} stats={pokemonStore.pokemon.stats} />
                  </Box>
                </DescriptionCard>
              </Grid>
            </Grid>
          </Grid>

          {/*desc*/}
          <Grid xs={xsMainGrid} sm={smMainGrid} item>
            <Grid spacing={2} container>
              <Grid xs={xsMainGrid} item>
                <DescriptionCard
                  isLoading={isLoadingState}
                  title={'Description'}
                >
                  <Box mt={2}>
                    <Typography variant={'body1'}>
                      {pokemonStore.pokemon.species.desc}
                    </Typography>
                  </Box>
                </DescriptionCard>
              </Grid>

              <Grid item xs={xsMainGrid}>
                <DescriptionCard
                  isLoading={isLoadingState}
                  title={'Characteristics'}
                >
                  <Box mt={2}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Grid container>
                          <Grid xs={12} item>
                            <Typography variant={'body1'}>Species: </Typography>
                          </Grid>
                          <Grid xs={12} item>
                            <Typography variant={'body1'}>Height: </Typography>
                          </Grid>
                          <Grid xs={12} item>
                            <Typography variant={'body1'}>Weight: </Typography>
                          </Grid>
                          <Grid xs={12} item>
                            <Typography variant={'body1'}>
                              Base EXP:{' '}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid xs={6} item>
                        <Grid container>
                          <Grid xs={12} item>
                            <Typography
                              className={'capitalize'}
                              variant={'body1'}
                            >
                              {pokemonStore.pokemon.species.name}
                            </Typography>
                          </Grid>
                          <Grid xs={12} item>
                            <Typography variant={'body1'}>
                              {(pokemonStore.pokemon.height * 0.1).toFixed(1)} m
                            </Typography>
                          </Grid>
                          <Grid xs={12} item>
                            <Typography variant={'body1'}>
                              {(pokemonStore.pokemon.weight * 0.1).toFixed(1)}{' '}
                              kg
                            </Typography>
                          </Grid>
                          <Grid xs={12} item>
                            <Typography variant={'body1'}>
                              {pokemonStore.pokemon.baseExp} EXP
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </DescriptionCard>
              </Grid>

              <Grid item xs={xsMainGrid}>
                <DescriptionCard isLoading={isLoadingState} title={'Abilities'}>
                  <Box>
                    <List>
                      {pokemonStore.pokemon.abilities.map((ability) => (
                        <ListItem key={ability.name}>
                          <ListItemIcon>
                            <DescriptionButton desc={ability.desc}/>
                          </ListItemIcon>
                          <ListItemText
                            className={'capitalize'}
                            primary={ability.name}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </DescriptionCard>
              </Grid>

              <Grid item xs={xsMainGrid}>
                <DescriptionCard isLoading={isLoadingState} title={'Types'}>
                  <Box mt={2}>
                    <Grid container spacing={1}>
                      {pokemonStore.pokemon.types.map((type) => (
                        <Grid item key={type + pokemonStore.pokemon.name}>
                          <Chip
                            key={type + pokemonStore.pokemon.name}
                            label={type}
                            className={getColorTagStyle(type)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </DescriptionCard>
              </Grid>

              <Grid item xs={xsMainGrid}>
                <DescriptionCard
                  isLoading={isLoadingState}
                  title={'Weaknesses'}
                >
                  <Box mt={2}>
                    <Grid container spacing={1}>
                      {pokemonStore.pokemon.weaknesses.map((weakness) => (
                        <Grid
                          item
                          key={weakness + pokemonStore.pokemon.name + 'wk'}
                        >
                          <Chip
                            label={weakness}
                            className={getColorTagStyle(weakness)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </DescriptionCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box mt={3} mb={3} display="flex" justifyContent="center">
              <FavoriteStateButton
                pokemonId={pokemonStore.pokemon.id}
                duration={5000}
                pokemonName={pokemonStore.pokemon.name}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                isFavorite={isFavorite}
                color={'primary'}
                changePokemonFavorState={changePokemonFavorState}
                disabled={isAddToFavoriteDisabled}
              />
        </Box>
      </div>
    </Container>
  );
};

export default observer(PokemonPage);
