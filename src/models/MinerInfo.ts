import { MinerName, AlgorithmName } from './Enums';

export type MinerInfo = {
  name: MinerName;
  algorithms: AlgorithmName[];
  exe: string;
  getArgs: (algorithm: AlgorithmName, cs: string, url: string) => string;
};

export const AVAILABLE_MINERS: MinerInfo[] = [
  {
    name: 'phoenixminer',
    algorithms: ['ethash', 'etchash'],
    exe: 'phoenixminer.exe',
    getArgs: (alg, cs, url) => `-pool ${url} -wal ${cs} -pass x${alg === 'etchash' ? ' -coin etc' : ''}`,
  },
  {
    name: 'lolminer',
    algorithms: ['ethash', 'etchash'],
    exe: 'lolminer.exe',
    getArgs: (alg, cs, url) => `--algo ${alg.toLocaleUpperCase()} --pool ${url} --user ${cs} --nocolor`,
  },
  {
    name: 'nbminer',
    algorithms: ['ethash', 'etchash', 'kawpaw'],
    exe: 'nbminer.exe',
    getArgs: (alg, cs, url) => `-a ${alg} -o stratum+tcp://${url} -u ${cs} -log`,
  },
  {
    name: 'trexminer',
    algorithms: ['ethash', 'etchash', 'kawpaw'],
    exe: 't-reg.exe',
    getArgs: (alg, cs, url) => `-a ${alg} -o ${url} -u ${cs} -p x`,
  },
  {
    name: 'xmrig',
    algorithms: ['randomx'],
    exe: 'xmrig.exe',
    getArgs: (_alg, cs, url) => `o ${url} -a rx -k -u ${cs} -p x`,
  },
];
