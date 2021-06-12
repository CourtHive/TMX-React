import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Drawer, Grid, Slider, TextField, Typography } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { validationSchema } from './validation';
import { useStyles } from './style';

import { ControlledSelector } from 'components/selectors/ControlledSelector';

import { utilities, tournamentEngine } from 'tods-competition-factory';
import { yupResolver } from '@hookform/resolvers/yup';
const { offsetDate } = utilities.dateTime;

export function EditEventDrawer() {
  const dispatch = useDispatch();
  const drawer = useSelector((state) => state.tmx.visible.drawer);
  const closeDrawer = () => {
    dispatch({ type: 'visible drawer', payload: undefined });
  };
  return (
    <Drawer anchor="right" open={drawer === 'event'} onClose={closeDrawer}>
      <EditEvent callback={closeDrawer} />
    </Drawer>
  );
}

export function EditEvent(props) {
  const { callback } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { tournamentRecord } = tournamentEngine.getState();
  const startDate = tournamentRecord.startDate;
  const endDate = tournamentRecord.endDate;

  const tournamentCategories = tournamentRecord.tournamentCategories || [];
  const tournamentCategoryNames = tournamentCategories.map((category) => category.categoryName);

  const defaultCategory = tournamentCategories[0];
  const categoryOptions = tournamentCategoryNames.map((c) => ({ text: c, value: c }));

  const surfaceCategory = (tournamentRecord.surfaceCategory || 'H')[0];
  const defaultValues = {
    eventName: '',
    eventLevel: '',
    gender: 'X',
    eventType: 'SINGLES',
    indoorOutdoor: tournamentRecord.indoorOutdoor || 'o',
    categoryName: defaultCategory?.categoryName,
    surfaceCategory,
    startDate: offsetDate(startDate),
    endDate: offsetDate(endDate)
  };

  const { control, register, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onChange'
  });
  const { startDate: currentStart, endDate: currentEnd } = watch();
  if (currentEnd < currentStart) setValue('endDate', currentStart);

  // let ratingRange = [0, 40];
  const sliderValueChange = (value) => {
    console.log('slider value change', value);
    // ratingRange = value;
  };

  const genderOptions = [
    { text: t('genders.male'), value: 'M' },
    { text: t('genders.female'), value: 'F' },
    { text: t('genders.mixed'), value: 'X' }
  ];

  const eventTypeOptions = [
    { text: t('sgl'), value: 'SINGLES' },
    { text: t('dbl'), value: 'DOUBLES' },
    { text: t('events.teamevent'), value: 'TEAM' }
  ];

  const inOutOptions = [
    { text: '', value: '' },
    { text: t('indoors'), value: 'i' },
    { text: t('outdoors'), value: 'o' }
  ];

  const surfaceOptions = [
    { text: '', value: '' },
    { text: t('surfaces.clay'), value: 'C' },
    { text: t('surfaces.hard'), value: 'H' },
    { text: t('surfaces.grass'), value: 'G' },
    { text: t('surfaces.carpet'), value: 'R' }
  ];

  const eventLevels = {};
  const eventLevelOptions = Object.keys(eventLevels).map((c) => ({ text: c, value: c }));

  const SubmitButton = () => {
    const onSubmit = (formValues) => {
      if (!formValues.eventName) {
        const genderText = genderOptions.reduce((p, c) => (c.value === formValues.gender ? c.text : p), '');
        const categoryText = categoryOptions.reduce((p, c) => (c.value === formValues.categoryName ? c.text : p), '');
        const eventTypeText = eventTypeOptions.reduce((p, c) => (c.value === formValues.eventType ? c.text : p), '');
        formValues.eventName = `${genderText} ${categoryText} ${eventTypeText}`;
      }

      const category = tournamentCategories.find(
        (tournamentCategory) => tournamentCategory.categoryName === formValues.categoryName
      );
      const event = {
        category,
        eventLevel: formValues.eventLevel,
        gender: formValues.gender,
        eventType: formValues.eventType,
        indoorOutdoor: formValues.indoorOutdoor,
        surfaceCategory: formValues.surfaceCategory,
        eventName: formValues.eventName,
        startDate: formValues.startDate.toISOString(),
        endDate: formValues.endDate.toISOString()
      };

      dispatch({
        type: 'tournamentEngine',
        payload: { methods: [{ method: 'addEvent', params: { event } }] }
      });
      callback();
    };
    return (
      <Button id="submitNewEvent" variant="outlined" className={classes.submit} onClick={handleSubmit(onSubmit)}>
        {t('sbt')}
      </Button>
    );
  };

  const SliderDisplay = (props) => {
    const { onChange, min = 0, max = 50, step = 0.1, value, category } = props;
    const { ratingMin, ratingMax } = category || {};
    const [sliderValue, setSliderValue] = React.useState(value || [ratingMin || 0, ratingMax || 40]);
    const sliderValueDisplay = (value) => value;
    const sliderChange = (event, newValue) => {
      setSliderValue(newValue);
      onChange(newValue);
    };

    if (!category || !category.ratingMin || !category.ratingMax) return '';

    return (
      <div className={classes.ratingsSlider}>
        <Typography variant="subtitle" gutterBottom>
          {t('draws.playerfilter')}
        </Typography>
        <Slider
          value={sliderValue}
          min={min}
          max={max}
          step={step}
          onChange={sliderChange}
          valueLabelDisplay="auto"
          aria-labelledby="ratings-range"
          getAriaLabel={sliderValueDisplay}
          getAriaValueText={sliderValueDisplay}
          valueLabelFormat={sliderValueDisplay}
        />
      </div>
    );
  };

  return (
    <div className={classes.editPanel}>
      <Grid container direction="column">
        <Typography align="left" component="h2" className={classes.formTitle}>
          {t('actions.add_event')}
        </Typography>
        <TextField
          id="eventName"
          name="eventName"
          inputRef={register}
          label={t('events.customname')}
          className={classes.editField}
        />
        <ControlledSelector
          defaultValue={defaultValues.gender}
          name="gender"
          control={control}
          options={genderOptions}
          label={t('gdr')}
        />
        <ControlledSelector
          defaultValue={defaultValues.categoryName}
          name="categoryName"
          control={control}
          options={categoryOptions}
          label={t('cat')}
        />
        <SliderDisplay onChange={sliderValueChange} category={defaultValues.category} />
        <ControlledSelector
          defaultValue={defaultValues.eventType}
          name="eventType"
          control={control}
          options={eventTypeOptions}
          label={t('fmt')}
        />
        <ControlledSelector
          defaultValue={defaultValues.eventLevel}
          name="eventLevel"
          control={control}
          options={eventLevelOptions}
          label={t('rnk')}
        />
        <ControlledSelector
          defaultValue={defaultValues.indoorOutdoor}
          name="indoorOutdoor"
          control={control}
          options={inOutOptions}
          label={t('indoorOutdoor')}
        />
        <ControlledSelector
          defaultValue={defaultValues.surfaceCategory}
          id="surfaceCategory"
          name="surfaceCategory"
          control={control}
          options={surfaceOptions}
          label={t('events.surfaceCategory')}
        />
        <Controller
          autoOk
          id="eventStartDate"
          name="startDate"
          control={control}
          variant="inline"
          format="yyyy-MM-dd"
          label={t('start')}
          className={classes.editField}
          minDate={new Date(startDate)}
          maxDate={new Date(endDate)}
          as={<DatePicker />}
        />
        <Controller
          autoOk
          id="eventEndDate"
          name="endDate"
          control={control}
          variant="inline"
          format="yyyy-MM-dd"
          label={t('end')}
          className={classes.editField}
          minDate={currentStart}
          maxDate={new Date(endDate)}
          as={<DatePicker />}
        />
        <Grid container direction="row">
          <div className={classes.grow} />
          <SubmitButton />
        </Grid>
      </Grid>
    </div>
  );
}
