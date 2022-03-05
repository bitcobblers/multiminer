import { LinearProgress, Tooltip } from '@mui/material';
import * as formatter from '../services/Formatters';

export function LinearProgressWithLabel(props: { value: number }) {
  const { value } = props;

  return (
    <Tooltip title={formatter.percentage(value)}>
      <LinearProgress variant="determinate" value={value > 100 ? 100 : value} />
    </Tooltip>
  );
}
