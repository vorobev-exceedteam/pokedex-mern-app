import {useContext, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import './styles.sass';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {FcGoogle} from 'react-icons/all';
import {observer} from 'mobx-react-lite';
import {GlobalContext} from '../../context/global';
import {AuthContext} from '../../context/auth';
import {useHistory} from 'react-router-dom';
import AuthDialog from '../../components/AuthDialog';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {loginSchema} from '../../validation/yupValidation';
import {useSnackbar} from '../../context/snackbar';

const Login = () => {
  const AuthStore = useContext(AuthContext);
  const { isAuthorized } = useContext(GlobalContext);

  const history = useHistory();

  const { isLoading } = useContext(GlobalContext);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const snackbar = useSnackbar();

  const goggleFailureCb = () => {
    snackbar.showMessage('Authorization through google failed', 'error');
  };

  useEffect(() => {
    if (document.title !== 'Login') {
      document.title = 'Login';
    }
    if (AuthStore.state === 'loginFailure') {
      for (let error of AuthStore.validationErrors) {
        switch (error.path) {
          case 'login/email':
            errors.email = { message: error.message };
            break;
          case 'login/password':
            errors.password = { message: error.message };
            break;
          default:
            break;
        }
      }
    }
  }, [
    AuthStore.validationErrors,
    AuthStore.state,
    history,
    isAuthorized,
    errors,
    AuthStore.setIdleState,
    AuthStore
  ]);

  const onSubmit = (data) => {
    AuthStore.login(data.email, data.password, data.remembered);
  };

  return (
    <Container component={'main'} maxWidth={'xs'}>
      <div className={'sign-in'}>
        <Typography align={'center'} variant={'h4'} component={'h1'}>
          Sign In
        </Typography>
        <AuthDialog
          buttonClassName={'sign-in__google-button'}
          icon={<FcGoogle />}
          isDisabled={isLoading}
          failureCb={goggleFailureCb}
          name={'Sign in with Google'}
          handleAuth={AuthStore.googleAuth}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={'sign-in__form'}
        >
          <TextField
            disabled={isLoading}
            inputRef={register}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            color={'secondary'}
            name="email"
            type={'email'}
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            disabled={isLoading}
            inputRef={register}
            variant="outlined"
            color={'secondary'}
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type={'password'}
            autoComplete="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remembered"
                inputRef={register}
                name={'remembered'}
                color="secondary"
              />
            }
            label="Remember me"
          />
          <Button
            disabled={isLoading}
            color={'primary'}
            className={'sign-in__login-button'}
            type={'submit'}
            fullWidth
            variant="contained"
          >
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default observer(Login);
