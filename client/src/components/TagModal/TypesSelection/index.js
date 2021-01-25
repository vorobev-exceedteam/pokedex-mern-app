import React from 'react';
import { getColorTagStyle } from '../../../services/PokemonService';
import Chip from '@material-ui/core/Chip';
import './styles.sass';
import Grid from '@material-ui/core/Grid';
import config from '../../../config';

const TypesSelection = (props) => {
  const getTypeClass = (type) => {
    if (props.selectedTags.has(type)) {
      return getColorTagStyle(type);
    }
    return null;
  };

  const getVariant = (type) => {
    if (props.selectedTags.has(type)) {
      return 'default';
    }
    return 'outlined';
  };

  return (
    <div className={'types-container'}>
      <Grid container spacing={1}>
        {config.pokemonTypes.map((type) => {
          return (
            <Grid item>
              <Chip
                key={type + 'tag'}
                label={type}
                variant={getVariant(type)}
                clickable
                className={getTypeClass(type)}
                onClick={() => props.changeTag(type)}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default TypesSelection;
