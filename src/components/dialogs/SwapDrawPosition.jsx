/*
import React from 'react';
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { drawInfo } from 'functions/draws/querying/drawInfo';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { tournamentEngine } from 'tods-competition-factory';
*/

export const SwapDrawPosition = () => {
  /*
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const editState = useSelector(state => state.tmx.editState);
    const selectedDraw = useSelector(state => state.tmx.select.draws.draw);
 
    const { tournamentRecord } = tournamentEngine.getState();
    const swapDrawPosition = useSelector(state => state.tmx.actionData.swapDrawPosition);

    const drawExists = selectedDraw && tournamentDraws.reduce((p, c) => c.euid === selectedDraw ? c : p, undefined);
    const firstDraw = tournamentDraws.length && tournamentDraws[0].euid;
    const targetDraw = (drawExists && selectedDraw) || firstDraw;

    const drawDefinition = tournamentDraws.reduce((p, c) => c.euid === targetDraw ? c : p, undefined) || {};

    const info = drawInfo(drawDefinition.draw);
    const active_positions = (info && info.active_positions) || [];
    const swap_positions = ((info && info.draw_positions) || [])
        .filter(p => active_positions.indexOf(p) < 0 && +p !== +swapDrawPosition) || [];

    const defaultValues = { new_position: '' };
    const dialogActive = editState && Boolean(swapDrawPosition);
    const validValues = [null].concat(...swap_positions);
    const nullableNumber = (value, originalValue) => originalValue.trim() === "" ? null : value; 
    const validationSchema = Yup.object().shape({
        new_position: Yup.lazy(value => {
            if (value) { return Yup.number().nullable().transform(nullableNumber).oneOf(validValues); }
            return Yup.mixed().notRequired();
        })
    });
    const { register, setValue, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
        defaultValues, mode: 'onChange' });

    const onSubmit = data => {
        const { new_position } = data;
        const payload = {
            active_positions,
            drawId: targetDraw,
            position: swapDrawPosition,
            new_position
        };
        dispatch({ type: 'swap participant positions', payload })
        dispatch({ type: 'swap draw position', payload: false });
    };

    const onClose = () => dispatch({ type: 'swap draw position', payload: false });

    return (
        <>
            <Dialog disableBackdropClick={false} open={dialogActive} maxWidth={'md'} onClose={onClose}>
                <DialogTitle><div style={{minWidth: 400}}>{t('draws.swap')}</div></DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        name={'new_position'}
                        variant="outlined"
                        inputRef={register}
                        label={'New Position'}
                        placeholder={'New Player Position...'}
                        helperText={errors.new_position && <span style={{color: 'red'}}>Invalid Position</span>}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton
                                    aria-label="clear input field"
                                    onClick={() => { setValue('new_position', '')}}
                                    edge="end"
                                >
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                </DialogContent>
                <DialogActions style={{marginBottom: '1em', paddingRight: '1em'}}>
                    <Button onClick={onClose} color="secondary" variant="outlined"> {t('ccl')} </Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={false} color="primary" variant="outlined"> {t('sbt')} </Button>
                </DialogActions>
            </Dialog>
        </>
    );
    */
  return null;
};
