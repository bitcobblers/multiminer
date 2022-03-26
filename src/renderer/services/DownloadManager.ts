import AsyncLock from 'async-lock';
import { AVAILABLE_MINERS, MinerInfo } from '../../models';
import { downloadApi } from '../../shared/DownloadApi';

const MAX_VERSION_HISTORY = 10;

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type MinerRelease = {
  tag_name: string;
  published_at: Date;
  assets: Array<ReleaseAsset>;
};

export type MinerReleaseData = {
  name: string;
  releases: {
    tag: string;
    published: Date;
    url: string;
  }[];
};

const lock = new AsyncLock();
let minerReleases = Array<MinerReleaseData>();

async function cacheReleases(descriptors: MinerInfo[]) {
  const miners = await Promise.all(
    descriptors.map((info) => {
      return downloadApi.getMinerReleases(info.owner, info.repo).then((r) => {
        if (r === '') {
          return null;
        }

        const releases = (JSON.parse(r) as MinerRelease[]).slice(0, MAX_VERSION_HISTORY);
        const data = {
          name: info.name,
          releases: releases
            .map((release) => ({
              tag: release.tag_name,
              published: release.published_at,
              url: release.assets.find((x) => info.assetPattern.test(x.name))?.browser_download_url ?? '',
            }))
            .filter((x) => x.url !== ''),
        } as MinerReleaseData;

        return data;
      });
    })
  );

  return miners.filter((miner) => miner !== null) as MinerReleaseData[];
}

export async function getMinerReleases() {
  await lock.acquire('miners', async () => {
    if (minerReleases.length === 0) {
      minerReleases = await cacheReleases(AVAILABLE_MINERS);
    }
  });

  return minerReleases;
}

export async function downloadMiner(name: string, version: string) {
  const miner = (await getMinerReleases()).find((m) => m.name === name);
  const url = miner?.releases.find((r) => r.tag === version)?.url;

  if (url !== undefined) {
    return downloadApi.downloadMiner(name, version, url);
  }

  return false;
}