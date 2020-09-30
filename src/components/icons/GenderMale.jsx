import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

// https://iconify.design/icon-sets/mdi/
export default function GenderMale(props, ref) {
  return (
    <SvgIcon data-mui-test={'gender-male-icon'} ref={ref} {...props}>
      <path d="M9 9c1.29 0 2.5.41 3.47 1.11L17.58 5H13V3h8v8h-2V6.41l-5.11 5.09c.7 1 1.11 2.2 1.11 3.5a6 6 0 0 1-6 6a6 6 0 0 1-6-6a6 6 0 0 1 6-6m0 2a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4z" />
    </SvgIcon>
  );
}
