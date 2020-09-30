import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useStyles } from './style';

import { Button } from '@material-ui/core';
import StandardPaper from 'components/papers/standard/StandardPaper';
import { TAB_LOCATIONS } from 'stores/tmx/types/tabs';

export function VenuesNotice() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const AddCourts = () => {
        function changeActiveTab() {
          dispatch({ type: 'change active tab', payload: { tab: TAB_LOCATIONS }});
        }
        return (
            <Button variant='contained' color={'primary'} className={classes.button} onClick={changeActiveTab}>
                {t('addcourts')}
            </Button>
        );
    };

    return (
        <StandardPaper className={classes.paperStandard}>
            <div style={{margin: '1em'}}>
                <div className='flexcenter' style={{width: '100%'}}>
                    <div className="flexcenter flexcol" style={{backgroundColor: 'lightgray', maxWidth: '600px', padding: '1.5em'}}>
                        <h2 className="bp3-heading">{t('phrases.setupcourts')}</h2>
                        <div style={{margin: '2em', fontSize: '16px'}}>{t('phrases.courtsmsg')}</div>
                        <AddCourts />
                    </div>
                </div>
            </div>
        </StandardPaper>
    )
}

