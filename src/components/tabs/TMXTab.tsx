import React from 'react';
import { Tab } from '@material-ui/core';

function genProps({ index, root }) {
  return {
    key: `${root}:${index}`,
    style: { fontSize: '16px' }
  };
}

export const TMXTab = (props) => {
  const { className, values, index, root, ...other } = props;
  const hide = values[index]?.hide;
  return (
    <>
      {hide ? (
        ''
      ) : (
        <Tab
          id={values[index]?.id}
          className={className}
          label={values[index]?.label}
          icon={values[index]?.icon}
          {...genProps({ index, root })}
          {...other}
        />
      )}
    </>
  );
};
