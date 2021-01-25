import React, {memo} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './styles.sass';
import Stats from './Stats';
import Fade from '@material-ui/core/Fade';
import CardActions from '@material-ui/core/CardActions';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Image from 'material-ui-image';
import {getColorTagStyle} from '../../../services/PokemonService';
import FavoriteStateButton from '../../FavoriteStateButton';

const PokemonCard = (props) => {
  return (
    <Fade in>
      <Card>
        <CardActionArea onClick={props.onCardClick} title={'Get more info'}>
          <CardHeader className={'uppercase'} title={props.pokemon.name} />
          <CardMedia className="card__media" alt={props.pokemon.name}>
            <Image src={props.pokemon.image} />
          </CardMedia>
          <CardContent className="card__content">
            <Typography variant="h6" component="h6">
              Types:
            </Typography>
            <Grid container spacing={1}>
              {props.pokemon.types.map((type) => (
                <Grid item key={type + props.pokemon.name}>
                  <Chip
                    key={type + props.pokemon.name}
                    label={type}
                    className={getColorTagStyle(type)}
                  />
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6" component="h6">
              Attributes:
            </Typography>
            <Stats id={props.pokemon.id} stats={props.pokemon.stats} />
          </CardContent>
          <Divider />
        </CardActionArea>
        <CardActions>
          <FavoriteStateButton
            variant={'star'}
            disabled={props.addToFavoriteDisabled}
            changePokemonFavorState={props.changePokemonFavorState}
            color={'gold'}
            isFavorite={props.isFavorite}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            pokemonName={props.pokemon.name}
            pokemonId={props.pokemon.id}
          />
        </CardActions>
      </Card>
    </Fade>
  );
};

export default memo(PokemonCard);
