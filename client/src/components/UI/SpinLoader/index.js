import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles.sass'

const SpinLoader = (props) => {
  const getType = () => {
    switch (props.type) {
      case 'avatar':
        return 'spin-loader_avatar';
      case 'desc-card':
        return 'spin-loader_desc-card';
      default:
        return null;
    }
  };

  const className = 'spin-loader ' + getType();

  return (
    <div className={className}>
      <CircularProgress color={props.color} />
    </div>
  );
};

export default SpinLoader;
