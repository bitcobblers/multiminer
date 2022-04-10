import AsyncLock from 'async-lock';
import { AVAILABLE_MINERS, MinerInfo, MinerRelease } from '../../models';
import { downloadApi } from '../../shared/DownloadApi';
import * as config from './AppSettingsService';

const MAX_VERSION_HISTORY = 10;

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type MinerReleaseData = {
  tag_name: string;
  published_at: Date;
  assets: Array<ReleaseAsset>;
};

const lock = new AsyncLock();
let minerReleases = Array<MinerRelease>();

async function cacheReleases(descriptors: MinerInfo[]) {
  const previouslyCachedReleases = await config.getMinerReleases();

  const miners = await Promise.all(
    descriptors.map((info) => {
      return downloadApi.getMinerReleases(info.owner, info.repo).then((r) => {
        if (r === '') {
          return null;
        }

        const releases = (JSON.parse(r) as MinerReleaseData[]).slice(0, MAX_VERSION_HISTORY);
        const data = {
          name: info.name,
          versions: releases
            .map((release) => ({
              tag: release.tag_name,
              published: release.published_at,
              url: release.assets.find((x) => info.assetPattern.test(x.name))?.browser_download_url ?? '',
            }))
            .filter((x) => x.url !== ''),
        } as MinerRelease;

        return data;
      });
    })
  );

  const allMiners = miners.filter((miner) => miner !== null) as MinerRelease[];
  return allMiners.length ? allMiners : previouslyCachedReleases;
}

export async function getMinerReleases() {
  await lock.acquire('miners', async () => {
    if (minerReleases.length === 0) {
      minerReleases = await cacheReleases(AVAILABLE_MINERS);
      await config.setMinerReleases(minerReleases);
    }
  });

  return minerReleases;
}

export async function downloadMiner(name: string, version: string) {
  const miner = (await getMinerReleases()).find((m) => m.name === name);
  const url = miner?.versions.find((r) => r.tag === version)?.url;

  if (url !== undefined) {
    return downloadApi.downloadMiner(name, version, url);
  }

  return false;
}
