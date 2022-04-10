export type MinerRelease = {
  name: string;
  versions: {
    tag: string;
    published: Date;
    url: string;
  }[];
};
