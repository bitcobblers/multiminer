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
    <Grid container>
      {children}
      <Tooltip title={description}>
        <LightbulbIcon color="primary" />
      </Tooltip>
    </Grid>
  );
}
