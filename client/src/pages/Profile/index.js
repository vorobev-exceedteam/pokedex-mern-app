import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import DescriptionCard from '../../components/DescriptionCard';
import './styles.sass';
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {IoMdExit, IoMdKey, IoMdMail, MdCheck, MdClose} from 'react-icons/all';
import {observer} from 'mobx-react-lite';
import MiniPokemonCard from '../../components/MiniPokemonCard';
import {ProfileContext} from '../../context/profile';
import {GlobalContext} from '../../context/global';
import {useHistory} from 'react-router-dom';
import ResponsivePagination from '../../components/UI/ResponsivePagination';
import ChangeCredentialsDialog from '../../components/ChangeCredentialsDialog';
import {
  changePasswordSchema,
  setPasswordSchema
} from '../../validation/yupValidation';
import {NumberParam, useQueryParam, withDefault} from 'use-query-params';
import HelperService from '../../services/HelperService';
import config from "../../config";

const Profile = () => {
  const profile = useContext(ProfileContext);
  const { state, user, isLoading } = useContext(GlobalContext);
  const history = useHistory();

  const [passwordDialogState, setPasswordDialogState] = useState(false);
  const [limit, setLimit] = useQueryParam(
    'limit',
    withDefault(NumberParam, 10)
  );

  const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 1));

  const onPokemonClick = (id) => () => {
    history.push(`pokemon/${id}`);
  };

  const isLoadingPokemons = profile.state === 'fetch';

  const onLimitChange = useCallback(
    (event) => {
      setLimit(event.target.value);
      profile.setFetchState();
    },
    [setLimit, profile]
  );

  const validateParams = useCallback(() => {
    HelperService.validatePage(page, setPage, user.favoritePokemons.size, limit);
    HelperService.validateLimit(limit, setLimit, config.pokemonLimits);
  }, [
    page,
    user.favoritePokemons.size,
    setPage,
    setLimit,
    limit,
  ]);


  const onPageChange = useCallback(
    (event, value) => {
      setPage(value);
      profile.setFetchState();
    },
    [setPage, profile]
  );

  useEffect(() => {
    if (document.title !== ('Profile')) {
      document.title = 'Profile';
    }
    if (profile.state === 'fetch') {
      setPasswordDialogState(false);
      validateParams();
      profile.getPokemons(page, limit);
    }
  }, [
    profile,
    profile.state,
    setPasswordDialogState,
    profile.getPokemons,
    state,
    page,
    limit,
    validateParams
  ]);

  let passwordStateText = 'is not set';
  let buttonPasswordText = 'Set Password';
  let dialogPasswordType = 'set-password';
  let passwordValidationSchema = setPasswordSchema;

  if (user.hasPassword) {
    passwordStateText = 'is set';
    buttonPasswordText = 'Change Password';
    dialogPasswordType = 'change-password';
    passwordValidationSchema = changePasswordSchema;
  }

  const passwordStateIcon = user.hasPassword ? (
    <MdCheck size={'1.6rem'} color={'green'} />
  ) : (
    <MdClose size={'1.6rem'} color={'red'} />
  );

  const onLogoutAllClick = () => {
    profile.logoutAll();
  };

  const handleSubmit = (data, successCb, failureCb) => {
    profile.updatePassword(data, successCb, failureCb);
  };

  const onCancel = () => {
    setPasswordDialogState(false);
  };

  const onPasswordButtonClick = () => {
    setPasswordDialogState(true);
  };

  return (
    <Container component={'main'} maxWidth={'md'}>
      <div className={'profile-container'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DescriptionCard isLoading={isLoading} title={'Profile'}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <IoMdMail size={'1.6rem'} />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>{passwordStateIcon}</ListItemIcon>
                  <ListItemText
                    primary="Password"
                    secondary={passwordStateText}
                  />
                </ListItem>
                <ListItem button onClick={onPasswordButtonClick}>
                  <ListItemIcon>
                    <IoMdKey size={'1.5rem'} />
                  </ListItemIcon>
                  <ListItemText primary={buttonPasswordText} />
                </ListItem>
                <ListItem button onClick={onLogoutAllClick}>
                  <ListItemIcon>
                    <IoMdExit size={'1.5rem'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={'Log out'}
                    secondary={'from all devices'}
                  />
                </ListItem>
              </List>
            </DescriptionCard>
          </Grid>
          <Grid item xs={12}>
            <DescriptionCard
              isLoading={isLoadingPokemons || isLoading}
              title={'Favorite Pokemons'}
            >
              <>
                <Grid container justify={'center'} spacing={1}>
                  {profile.pokemons.map((pokemon) => (
                    <Grid item key={pokemon.id}>
                      <MiniPokemonCard
                        onCardClick={onPokemonClick(pokemon.id)}
                        pokemon={pokemon}
                      />
                    </Grid>
                  ))}
                </Grid>
                <ResponsivePagination
                  page={page}
                  onPageChange={onPageChange}
                  onLimitChange={onLimitChange}
                  limit={limit}
                  totalElements={user.favoritePokemons.size}
                  isLoading={isLoading}
                />
              </>
            </DescriptionCard>
          </Grid>
        </Grid>
      </div>
      <ChangeCredentialsDialog
        isLoading={profile.state === 'dialogLoading'}
        buttonColor={'primary'}
        fieldColor={'secondary'}
        cancelColor={'secondary'}
        progressColor={'secondary'}
        submit={handleSubmit}
        onCancel={onCancel}
        validationSchema={passwordValidationSchema}
        open={passwordDialogState}
        type={dialogPasswordType}
        valErrors={profile.validationErrors}
      />
    </Container>
  );
};

export default observer(Profile);
