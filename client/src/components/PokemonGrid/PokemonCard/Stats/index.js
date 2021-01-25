import React from 'react';
import './styles.sass';
import Grid from "@material-ui/core/Grid";

const Stats = (props) => {

  return (
    <Grid justify={'space-between'} spacing={2} direction={'row'} container>
      <Grid key={'hp' + props.id} xs={6} item>
        <div className={'stats-item'}>
          <p className={'stats-item__stat'}>HP</p>
          <p className={'stats-item__value'}>{props.stats.HP}</p>
        </div>
      </Grid>
      <Grid key={'atk' + props.id} xs={6} item>
        <div className={'stats-item'}>
          <p className={'stats-item__stat'}>ATK</p>
          <p className={'stats-item__value'}>{props.stats.ATK}</p>
        </div>
      </Grid>
      <Grid key={'def' + props.id} xs={6} item>
        <div className={'stats-item'}>
          <p className={'stats-item__stat'}>DEF</p>
          <p className={'stats-item__value'}>{props.stats.DEF}</p>
        </div>
      </Grid>
      <Grid key={'spAtk' + props.id} xs={6} item>
        <div className={'stats-item'}>
          <p className={'stats-item__stat'}>Sp.ATK</p>
          <p className={'stats-item__value'}>{props.stats.SpATK}</p>
        </div>
      </Grid>
      <Grid key={'spDef' + props.id} xs={6} item>
        <div className={'stats-item'}>
          <p className={'stats-item__stat'}>Sp.DEF</p>
          <p className={'stats-item__value'}>{props.stats.SpDEF}</p>
        </div>
      </Grid>
      <Grid key={'spd' + props.id} xs={6} item>
        <div className={'stats-item'}>
          <p className={'stats-item__stat'}>SPD</p>
          <p className={'stats-item__value'}>{props.stats.SPD}</p>
        </div>
      </Grid>
    </Grid>
  );
};

export default Stats;
