
import React from 'react';
import ListModal from './ReactSelect';
import { useTranslation } from "react-i18next";

export function ListPicker(props) {
  const { t } = useTranslation();
  let placeholder = `${t('select')}...`;
  const { top=30, left=40, callback, options } = props;
  
  return (
    <ListModal
      top={top}
      left={left}
      callback={callback}
      placeholder={placeholder}
      options={options}
    />
  )
}