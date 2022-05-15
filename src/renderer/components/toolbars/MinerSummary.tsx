import { Box, Typography } from '@mui/material';

import { Separator } from '../Separator';
import { useObservableState, useMinerActive } from '../../hooks';
import { minerState$ } from '../../../models';
import * as formatter from '../../services/Formatters';
import { minerStatistics$ } from '../../services/StatisticsAggregator';

export function MinerSummary() {
  const [minerState] = useObservableState(minerState$, null);
  const [minerStatistic] = useObservableState(minerStatistics$, null);
  const minerActive = useMinerActive();

  const items = [
    { title: 'Coin', content: minerState?.currentCoin },
    { title: 'Hashrate', content: formatter.hashrate(minerStatistic?.hashrate) },
  ];

  return (
    <Box>
      {minerActive && (
        <Typography sx={{ mr: 2 }}>
          {items
            .map((item) => (
              <>
                <strong>{item.title}</strong>: {item.content}
              </>
            ))
            .reduce((acc, x) =>
              acc === null ? (
                x
              ) : (
                <>
                  {acc} <Separator /> {x}
                </>
              )
            )}
        </Typography>
      )}
    </Box>
  );
}
