import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '../../../src/shared/lib/store';
import { useMonthlyStore } from '../../../src/shared/lib/monthly-store';
import { useRegionSync } from '../../../src/features/region-sync/model/sync-store';
import { syncFromActiveMode } from '../../../src/features/region-sync/lib/region-sync';

const noop = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  useRegionSync.setState({ linked: false, notice: null });
  // 데이터 로드(fetch) 대신 no-op 주입
  useAppStore.setState({
    loadWeeklyData: noop, loadTradeData: noop,
    allDates: ['2024-01-01', '2024-01-08', '2024-01-29', '2024-02-05', '2024-02-26'],
    selectedRegions: ['서울특별시'], regionLabels: { 서울특별시: '서울특별시' },
    baseDate: '2024-01-08', fromDate: '2024-01-01', toDate: '2024-02-05',
  } as never);
  useMonthlyStore.setState({
    loadPriceData: noop, loadTradeData: noop, loadMarketData: noop,
    allDates: ['2024-01', '2024-02', '2024-03'],
    selectedRegions: ['부산광역시'], regionLabels: { 부산광역시: '부산광역시' },
    baseDate: '2024-03', fromDate: '2024-01', toDate: '2024-03',
  } as never);
});

describe('syncFromActiveMode — 주간 기준', () => {
  it('지역을 월간으로 복사한다', () => {
    syncFromActiveMode('weekly');
    expect(useMonthlyStore.getState().selectedRegions).toEqual(['서울특별시']);
  });

  it('기준월·기간을 그 주가 속한 달로 변환한다', () => {
    syncFromActiveMode('weekly');
    const m = useMonthlyStore.getState();
    expect(m.baseDate).toBe('2024-01'); // 2024-01-08 → 2024-01
    expect(m.fromDate).toBe('2024-01'); // 2024-01-01 → 2024-01
    expect(m.toDate).toBe('2024-02');   // 2024-02-05 → 2024-02
  });

  it('선택이 달랐으면 안내 문구를 남긴다', () => {
    syncFromActiveMode('weekly');
    expect(useRegionSync.getState().notice).toContain('주간');
  });
});

describe('syncFromActiveMode — 월간 기준', () => {
  it('해당 월의 첫 주(시작/기준)·마지막 주(끝)로 변환한다', () => {
    syncFromActiveMode('monthly');
    const w = useAppStore.getState();
    expect(w.selectedRegions).toEqual(['부산광역시']);
    // baseDate: 2024-03 첫 주 → allDates에 2024-03 주 없음 → 2024-03-01 이하 최근 주(2024-02-26)
    expect(w.baseDate).toBe('2024-02-26');
    expect(w.fromDate).toBe('2024-01-01'); // 2024-01 첫 주
    expect(w.toDate).toBe('2024-02-26');   // 2024-03 → 2024-03-01 이하 최근 주
  });
});
