import React, {useContext, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import './styles.sass';
import Button from '@material-ui/core/Button';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../../context/auth';
import {GlobalContext} from '../../context/global';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {signUpSchema} from '../../validation/yupValidation';

const SignUp = () => {
  const history = useHistory();

  const AuthStore = useContext(AuthContext);

  const { isLoading } = useContext(GlobalContext);

  const onSubmit = (data) => {
    AuthStore.signup(data.email, data.password);
  };

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(signUpSchema)
  });

  useEffect(() => {
    if (document.title !== 'Signup') {
      document.title = 'Signup';
    }
    if (AuthStore.state === 'signupSuccess') {
      AuthStore.setIdleState();
      history.push('/login');
    }
    if (AuthStore.state === 'signupFailure') {
      for (let error of AuthStore.validationErrors) {
        switch (error.path) {
          case 'signup/email':
            errors.email = { message: error.message };
            break;
          case 'signup/password':
            errors.password = { message: error.message };
            break;
          default:
            break;
        }
      }
    }
  }, [
    AuthStore.state,
    AuthStore.validationErrors,
    history,
    errors,
    AuthStore.setIdleState,
    AuthStore
  ]);

  return (
    <Container component={'main'} maxWidth={'xs'}>
      <div className={'sign-up'}>
        <Typography align={'center'} variant={'h4'} component={'h1'}>
          Sign Up
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={'sign-up__form'}
        >
          <TextField
            inputRef={register}
            variant="outlined"
            margin="normal"
            disabled={isLoading}
            required
            fullWidth
            id="email"
            color={'secondary'}
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            autoFocus
          />
          <TextField
            inputRef={register}
            variant="outlined"
            margin="normal"
            disabled={isLoading}
            required
            color={'secondary'}
            fullWidth
            id="password"
            label="Password"
            type="password"
            name="password"
            autoComplete="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            inputRef={register}
            variant="outlined"
            margin="normal"
            disabled={isLoading}
            required
            color={'secondary'}
            fullWidth
            id="repeat-password"
            label="Repeat Password"
            type="password"
            name="repeatPassword"
            error={!!errors.repeatPassword}
            helperText={errors.repeatPassword?.message}
          />
          <Button
            className={'sign-up__signup-button'}
            color={'primary'}
            type={'submit'}
            disabled={isLoading}
            fullWidth
            variant="contained"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default observer(SignUp);
