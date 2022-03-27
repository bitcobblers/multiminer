export interface AdminApi {
  unsubscribeAll: () => Promise<void>;
}

export const adminApi = window.admin ?? {
  unsubscribeAll: () => Promise.resolve(),
};
