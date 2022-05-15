import { Box, Typography } from '@mui/material';

import { Separator } from '../Separator';
import { useObservableState } from '../../hooks';
import { minerState$ } from '../../../models';
import * as formatter from '../../services/Formatters';
import { minerStatistics$ } from '../../services/StatisticsAggregator';

export function MinerSummary() {
  const [minerState] = useObservableState(minerState$, null);
  const [minerStatistic] = useObservableState(minerStatistics$, null);
  const minerActive = minerState?.state === 'active';

  return (
    <Box>
      {minerActive && (
        <Typography sx={{ mr: 2 }}>
          <strong>Coin</strong>: {minerState?.currentCoin} <Separator /> <strong>Hashrate</strong>: {formatter.hashrate(minerStatistic?.hashrate)}{' '}
        </Typography>
      )}
    </Box>
  );
}
