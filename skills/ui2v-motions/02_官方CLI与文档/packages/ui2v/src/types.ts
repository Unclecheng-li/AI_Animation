export type Lockfile = {
  version: 1;
  motions: Record<
    string,
    {
      version: string | null;
      installedAt: number;
    }
  >;
};
