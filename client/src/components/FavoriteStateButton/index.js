import React, { memo, useCallback, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { AiFillStar, AiOutlineStar } from 'react-icons/all';
import Button from '@material-ui/core/Button';
import { useSnackbar } from '../../context/snackbar';

const FavoriteStateButton = ({
  anchorOrigin,
  color,
  disabled,
  changePokemonFavorState,
  isFavorite,
  pokemonId,
  pokemonName,
  variant
}) => {
  const [message, setMessage] = useState('');

  const getMessage = useCallback(
    (name, action, error) => {
      switch (action) {
        case 'add':
          if (error) {
            setMessage(
              `${name.toUpperCase()} was not been added to favorites due to failure: ${
                error.message
              }\``
            );
          }
          setMessage(
            `${name.toUpperCase()} was successfully added to favorites`
          );
          break;
        case 'remove':
          if (error) {
            setMessage(
              `${name.toUpperCase()} was not been removed from favorites due to failure: ${
                error.message
              }`
            );
          }
          setMessage(
            `${name.toUpperCase()} was successfully removed from favorites`
          );
          break;
        default:
          setMessage('Unsupported action');
      }
    },
    [setMessage]
  );

  const snackbar = useSnackbar();

  const changeFavoriteStateSuccess = useCallback(
    (name, action) => {
      getMessage(name, action);
      snackbar.showMessage(message, 'success', anchorOrigin);
    },
    [anchorOrigin, snackbar, getMessage, message]
  );

  const changeFavoriteStateFailure = useCallback(
    (name, action, error) => {
      getMessage(name, action, error);
      snackbar.showMessage(message, 'failure', anchorOrigin);
    },
    [anchorOrigin, snackbar, message, getMessage]
  );

  const changePokemonState = useCallback(() => {
    const successCb = (action) =>
      changeFavoriteStateSuccess(pokemonName, action);
    const failureCb = (action, error) =>
      changeFavoriteStateFailure(pokemonName, action, error);

    changePokemonFavorState(pokemonId, successCb, failureCb);
  }, [
    changeFavoriteStateFailure,
    changeFavoriteStateSuccess,
    changePokemonFavorState,
    pokemonId,
    pokemonName
  ]);

  const title = isFavorite ? 'Remove from favorites' : 'Add to favorites';

  const getButton = () => {
    switch (variant) {
      case 'star':
        const colorStyle = disabled ? 'lightGray' : color;
        const favoriteIcon = isFavorite ? (
          <AiFillStar color={colorStyle} />
        ) : (
          <AiOutlineStar color={colorStyle} />
        );
        return (
          <IconButton
            disabled={disabled}
            aria-label={title}
            title={title}
            onClick={changePokemonState}
          >
            {favoriteIcon}
          </IconButton>
        );
      default:
        return (
          <Button
            onClick={changePokemonState}
            aria-label={title}
            disabled={disabled}
            title={title}
            color={color}
            variant={'contained'}
          >
            {title}
          </Button>
        );
    }
  };

  return getButton();
};

export default memo(FavoriteStateButton);
