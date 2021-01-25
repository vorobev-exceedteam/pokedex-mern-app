import React, {useCallback, useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import './styles.sass';
import { useSnackbar } from '../../context/snackbar';

const ChangeCredentialsDialog = ({
  validationSchema,
  buttonColor,
  isLoading,
  onCancel,
  submit,
  cancelColor,
  open,
  fieldColor,
  progressColor,
  type,
  valErrors
}) => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(validationSchema)
  });
  const [message, setMessage] = useState('')


  const theme = useTheme();
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const submitButton = (
    <Button
      className={'sign-up__signup-button'}
      color={buttonColor}
      type={'submit'}
      disabled={isLoading}
      fullWidth
      variant={'contained'}
    >
      Submit
    </Button>
  );

  const changePasswordComponents = (
    <div>
      <TextField
        inputRef={register}
        variant={'outlined'}
        margin={'normal'}
        disabled={isLoading}
        required
        color={fieldColor}
        fullWidth
        id={'old-password'}
        label={'Old Password'}
        type={'password'}
        name={'oldPassword'}
        autoComplete={'password'}
        error={!!errors.oldPassword}
        helperText={errors.oldPassword?.message}
      />
      <TextField
        inputRef={register}
        variant={'outlined'}
        margin={'normal'}
        disabled={isLoading}
        required
        color={fieldColor}
        fullWidth
        id={'password'}
        label={'New Password'}
        type={'password'}
        name={'password'}
        autoComplete={'password'}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        inputRef={register}
        variant={'outlined'}
        margin={'normal'}
        disabled={isLoading}
        required
        color={fieldColor}
        fullWidth
        id={'repeat-password'}
        label={'Repeat Password'}
        type={'password'}
        name={'repeatPassword'}
        error={!!errors.repeatPassword}
        helperText={errors.repeatPassword?.message}
      />
      {submitButton}
    </div>
  );

  const setPasswordComponents = (
    <div>
      <TextField
        inputRef={register}
        variant={'outlined'}
        margin={'normal'}
        disabled={isLoading}
        required
        color={fieldColor}
        fullWidth
        id={'password'}
        label={'Password'}
        type={'password'}
        name={'password'}
        autoComplete={'password'}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        inputRef={register}
        variant={'outlined'}
        margin={'normal'}
        disabled={isLoading}
        required
        color={fieldColor}
        fullWidth
        id={'repeat-password'}
        label={'Repeat Password'}
        type={'password'}
        name={'repeatPassword'}
        error={!!errors.repeatPassword}
        helperText={errors.repeatPassword?.message}
      />
      {submitButton}
    </div>
  );

  const defaultComponent = (
    <Typography>{`${type} is not supported`}</Typography>
  );

  const getSnackbarMessage = useCallback((err) => {
    switch (type) {
      case 'set-password':
        if (err) {
          setMessage(`Password was set successfully`);
        }
        setMessage(`Error while setting password: ${err?.message}`);
        break;
      case 'change-password':
        if (err) {
          setMessage(`Error while changing password: ${err?.message}`);
        }
        setMessage(`Password was set successfully`);
        break;
      default:
        setMessage('Unsupported type');
        break;
    }
  }, [setMessage, type]);

  const getComponents = () => {
    switch (type) {
      case 'set-password':
        return setPasswordComponents;
      case 'change-password':
        return changePasswordComponents;
      default:
        return defaultComponent;
    }
  };

  const snackbar = useSnackbar();

  const submitSuccess = useCallback(() => {
    onCancel();
    getSnackbarMessage()
    snackbar.showMessage(message, 'success');
  }, [snackbar, onCancel, getSnackbarMessage, message]);

  const submitFailure = useCallback(
    (err) => {
      getSnackbarMessage(err)
      snackbar.showMessage(message, 'error');
    },
    [snackbar, getSnackbarMessage, message]
  );

  const onSubmit = (data) => {
    submit(data, submitSuccess, submitFailure);
  };

  useEffect(() => {
    if (valErrors?.length > 0) {
      for (let error of valErrors) {
        switch (error.path) {
          case 'updatePassword':
            errors.email = { message: error.message };
            break;
          default:
            break;
        }
      }
    }
  }, [valErrors, errors]);

  return (
    <>
      <Dialog fullScreen={smBreakpoint} open={open}>
        {isLoading ? (
          <LinearProgress color={progressColor} />
        ) : null}
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {getComponents()}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isLoading}
            color={cancelColor}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangeCredentialsDialog;
