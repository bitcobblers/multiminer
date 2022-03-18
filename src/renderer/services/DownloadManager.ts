import { MinerInfo } from '../../models';
import { downloadApi } from '../../shared/DownloadApi';

const MAX_VERSION_HISTORY = 10;

type ReleaseAsset = {
  content_type: string;
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

let minerReleases: MinerReleaseData[] | null = null;

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
          releases: releases.map((release) => ({
            tag: release.tag_name,
            published: release.published_at,
            url: release.assets.find((x) => x.content_type === 'application/zip')?.browser_download_url ?? '',
          })),
        } as MinerReleaseData;

        return data;
      });
    })
  );

  return miners.filter((miner) => miner !== null) as MinerReleaseData[];
}

export async function getMinerReleases(descriptors: MinerInfo[]) {
  if (minerReleases === null) {
    minerReleases = await cacheReleases(descriptors);
  }

  return minerReleases;
}
