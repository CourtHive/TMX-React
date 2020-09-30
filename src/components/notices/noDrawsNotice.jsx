import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';

import { useStyles } from './style';

import { TAB_EVENTS } from 'stores/tmx/types/tabs';

export function NoDrawsNotice(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const AddDraws = () => {
        function changeActiveTab() {
          dispatch({ type: 'change active tab', payload: { tab: TAB_EVENTS }});
        }
        return (
            <Button variant='contained' color={'primary'} className={classes.button} onClick={changeActiveTab}>
              Add Draws
            </Button>
        );
    };

    return (
        <div style={{margin: '1em'}}>
            <div className='flexcenter' style={{width: '100%'}}>
                <div className="flexcenter flexcol" style={{backgroundColor: 'lightgray', maxWidth: '600px', padding: '1.5em'}}>
                    <h2 className="bp3-heading">
                      Add Draws to your Events
                    </h2>
                    <div style={{margin: '2em', fontSize: '16px'}}>
                      Before you can view Draws they need to be created within Tournament Events
                    </div>
                    <AddDraws />
                </div>
            </div>
        </div>
    )
}
