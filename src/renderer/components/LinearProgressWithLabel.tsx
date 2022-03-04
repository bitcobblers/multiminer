import PropTypes from 'prop-types';
import { Typography, Box, LinearProgress } from '@mui/material';
import * as formatter from '../services/Formatters';

export function LinearProgressWithLabel(props: { value: number }) {
  const { value } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value > 100 ? 100 : value} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {formatter.percentage(value)}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};
