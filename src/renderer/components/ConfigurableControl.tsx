import React from 'react';
import { Tooltip, Grid } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface ConfigurableControlProps {
  description: string;
  children: React.ReactNode;
}

export function ConfigurableControl(props: ConfigurableControlProps) {
  const { description, children } = props;

  return (
    <Grid container sx={{display: 'flex', alignItems: 'center'}}>
      {children}
      <Tooltip title={description} sx={{ml: 1}}>
        <LightbulbIcon color="primary" />
      </Tooltip>
    </Grid>
  );
}
