import type {DashboardStats} from './types';

export type DashboardRepo = {
  getStats: () => Promise<DashboardStats>;
};

type StatsApi = {
  total_stations: number;
  total_station_owners: number;
  unread_messages: number;
  active_notices: number;
};

async function readJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? 'Request failed');
  return data;
}

export const dashboardRepo: DashboardRepo = {
  async getStats() {
    const res = await fetch('/api/dashboard-stats', {cache: 'no-store'});
    const data = (await readJsonOrThrow(res)) as StatsApi;

    return {
      totalStations: data.total_stations,
      totalOwners: data.total_station_owners,
      unreadMessages: data.unread_messages,
      activeNotices: data.active_notices,
    };
  },
};
