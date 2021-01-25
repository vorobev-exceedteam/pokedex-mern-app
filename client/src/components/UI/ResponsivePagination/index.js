import React, {memo} from 'react';
import './styles.sass';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import HiddenElement from '../../../hoc/HiddenElement';
import config from "../../../config";

const ResponsivePagination = (props) => {
  const totalPages = Math.ceil(props.totalElements / props.limit) || 1;
  const mobileNextLastDisabled = props.page === totalPages;
  const mobilePrevFirstDisabled = props.page === 1;
  const isPagesVisible = totalPages > 1;
  const isLimitsVisible = props.totalElements > config.pokemonLimits[0];
  const containerClass = 'pagination-container ';

  const toNextPage = (event) => {
    if (props.page < totalPages) {
      props.onPageChange(event, props.page + 1);
    }
  };


  const toPreviousPage = (event) => {
    if (props.page > 0) {
      props.onPageChange(event, props.page - 1);
    }
  };

  const toLastPage = (event) => {
    props.onPageChange(event, totalPages);
  };

  const toFirstPage = (event) => {
    props.onPageChange(event, 1);
  };

  return (
    <div className={containerClass}>
      <HiddenElement hidden={!isPagesVisible}>
        <Hidden only={'xs'}>
          <Pagination
            disabled={props.isLoading}
            page={props.page}
            count={totalPages}
            shape={'rounded'}
            variant={'outlined'}
            color={'secondary'}
            showFirstButton
            showLastButton
            onChange={props.onPageChange}
          />
        </Hidden>
        <Hidden smUp>
          <div className={'pagination-container__mobile-pagination'}>
            <PaginationItem
              disabled={mobilePrevFirstDisabled || props.isLoading}
              size={'large'}
              onClick={toFirstPage}
              type={'first'}
            />
            <PaginationItem
              disabled={mobilePrevFirstDisabled || props.isLoading}
              size={'large'}
              type={'previous'}
              onClick={toPreviousPage}
            />
            <Typography variant={'button'}>
              Page: {props.page}/{totalPages}
            </Typography>
            <PaginationItem
              disabled={mobileNextLastDisabled || props.isLoading}
              size={'large'}
              type={'next'}
              onClick={toNextPage}
            />
            <PaginationItem
              disabled={mobileNextLastDisabled || props.isLoading}
              size={'large'}
              type={'last'}
              onClick={toLastPage}
            />
          </div>
        </Hidden>
      </HiddenElement>
      <HiddenElement hidden={!isLimitsVisible}>
        <Select
          className={'pagination-container__limit-select'}
          disabled={props.isLoading}
          onChange={props.onLimitChange}
          value={props.limit}
        >
          {config.pokemonLimits.map((limit) => (
            <MenuItem
              key={'limit' + limit}
              value={limit}
            >{`${limit} per page`}</MenuItem>
          ))}
        </Select>
      </HiddenElement>
    </div>
  );
};

export default memo(ResponsivePagination);
