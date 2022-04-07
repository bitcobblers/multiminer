export interface LoggingApi {
  openLogFolder: () => Promise<void>;
}

export const loggingApi = window.logging ?? {
  openLogFolder: () => Promise.resolve(),
};
