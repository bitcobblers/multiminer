import { MinerName, AlgorithmName, API_PORT } from './Enums';

export type MinerInfo = {
  name: MinerName;
  owner: string;
  repo: string;
  assetPattern: RegExp;
  optionsUrl: string;
  algorithms: AlgorithmName[];
  exe: string;
  getArgs: (algorithm: AlgorithmName, cs: string, url: string) => string;
};

export const AVAILABLE_MINERS: MinerInfo[] = [
  // {
  //   name: 'phoenixminer',
  //   algorithms: ['ethash', 'etchash'],
  //   owner: 'nanopool',
  //   repo: 'phoenix-miner',
  //   exe: 'phoenixminer.exe',
  //   getArgs: (alg, cs, url) => `-pool ${url} -wal ${cs} -pass x${alg === 'etchash' ? ' -coin etc' : ''}`,
  // },
  {
    name: 'lolminer',
    algorithms: ['etchash', 'autolykos2'],
    owner: 'lolliedieb',
    repo: 'lolMiner-releases',
    assetPattern: /^.+Win64\.zip$/,
    optionsUrl: 'https://lolminer.site/documentation/arguments/',
    exe: 'lolminer.exe',
    getArgs: (alg, cs, url) => `--algo ${alg.toLocaleUpperCase()} --pool ${url} --user ${cs} --nocolor --apiport ${API_PORT}`,
  },
  {
    name: 'nbminer',
    algorithms: ['etchash', 'kawpow', 'autolykos2'],
    owner: 'NebuTech',
    repo: 'NBMiner',
    assetPattern: /^NBMiner.+_Win\.zip$/,
    optionsUrl: 'https://nbminer.info/documentation/arguments/',
    exe: 'nbminer.exe',
    getArgs: (alg, cs, url) => `-a ${alg} -o stratum+tcp://${url} -u ${cs} --no-color --cmd-output 1 --api 127.0.0.1:${API_PORT}`,
  },
  {
    name: 'trexminer',
    algorithms: ['etchash', 'kawpow', 'autolykos2'],
    owner: 'trexminer',
    repo: 't-rex',
    assetPattern: /^t-rex-.+win.zip$/,
    optionsUrl: 'https://trexminer.info/documentation/arguments/',
    exe: 't-rex.exe',
    getArgs: (alg, cs, url) => `-a ${alg} -o ${url} -u ${cs} -p x --api-bind-http 127.0.0.1:${API_PORT} --api-read-only --no-color`,
  },
  {
    name: 'xmrig',
    algorithms: ['randomx'],
    owner: 'xmrig',
    repo: 'xmrig',
    assetPattern: /^xmrig.+win64\.zip$/,
    optionsUrl: 'https://xmrig.com/docs/miner/command-line-options',
    exe: 'xmrig.exe',
    getArgs: (_alg, cs, url) => `-o ${url} -a rx -k -u ${cs} -p x --http-host=127.0.0.1 --http-port=${API_PORT}`,
  },
];
