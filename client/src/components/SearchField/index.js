import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import './styles.sass';
import {MdClose, MdSearch, MdUndo} from 'react-icons/all';
import {Autocomplete, createFilterOptions} from '@material-ui/lab';
import {InputAdornment} from '@material-ui/core';
import {observer} from 'mobx-react-lite';
import IconButton from '@material-ui/core/IconButton';

const SearchField = (props) => {
  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    ignoreCase: true,
    limit: 10
  });

  // const icon = props.defaultValue ? <MdClose /> : <MdSearch />;

  const [value, setValue] = useState(props.defaultValue || '');
  const [isSearching, setSearchingState] = useState(!!props.defaultValue);

  const hasText = value !== '';

  const onInputChange = (event, value) => {
    setValue(value);
  };

  const onOptionChange = (event, val) => {
    setValue(val);
  };

  const onClearClick = () => {
    setValue('');
  };

  const onSearchClick = () => {
    setSearchingState(true);
    props.onRequestSearch(value);
  };

  const onCancelClick = () => {
    setSearchingState(false);
    setValue('');
    props.onCancelSearch();
  };

  const keyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchingState(true);
      props.onRequestSearch(value);
    }
  };

  return (
    <Container className={'search-bar-container'} maxWidth={'sm'}>
      <Autocomplete
        filterOptions={filterOptions}
        disabled={props.isDisabled}
        onChange={onOptionChange}
        inputValue={value}
        onInputChange={onInputChange}
        disableClearable
        forcePopupIcon={false}
        freeSolo
        options={props.pokemonsNames.map(
          (pokemon) => pokemon[0].toUpperCase() + pokemon.substring(1)
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            onKeyPress={keyPress}
            placeholder={'Search'}
            color={'secondary'}
            margin={'normal'}
            variant={'outlined'}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position={'end'}>
                  <IconButton onClick={onSearchClick}>
                    <MdSearch />
                  </IconButton>
                  {hasText ? (
                    <IconButton onClick={onClearClick}>
                      <MdClose />
                    </IconButton>
                  ) : null}
                  {isSearching ? (
                    <IconButton onClick={onCancelClick}>
                      <MdUndo />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              )
            }}
          />
        )}
      />
    </Container>
  );
};

export default observer(SearchField);
