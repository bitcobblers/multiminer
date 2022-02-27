import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

export function TabPanel(props: { [x: string]: unknown; children: JSX.Element; value: number; index: number }) {
  const { children, value, index, ...other } = props;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
