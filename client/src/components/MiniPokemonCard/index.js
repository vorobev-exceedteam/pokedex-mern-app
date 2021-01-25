import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Image from 'material-ui-image';
import './styles.sass';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const MiniPokemonCard = (props) => {
  return (
    <Card className={'card'}>
      <CardActionArea onClick={props.onCardClick} title={'Get more info'}>
        <CardMedia
          className={'card__media'}
          alt={props.pokemon.name}
          image={props.pokemon.image}
        >
          <Image src={props.pokemon.image} />
        </CardMedia>
        <CardContent>
          <Typography align={'center'} className={'uppercase'} variant={'h6'}>
            {props.pokemon.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MiniPokemonCard;
