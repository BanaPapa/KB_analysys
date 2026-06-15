import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSlotStore } from '../../../src/features/chart-slots/model/slot-store';
import * as captureMod from '../../../src/features/chart-slots/lib/capture';
import { SLOT_COUNT, type ChartSetSnapshot, type SlotEntry } from '../../../src/features/chart-slots/model/types';

function fakeSnap(mode: 'weekly' | 'monthly', name = 'snap'): ChartSetSnapshot {
  return {
    id: 'id-' + name, name, mode, createdAt: 0, schemaVersion: 1,
    selectedRegions: ['서울특별시'], regionLabels: { 서울특별시: '서울특별시' },
    fromDate: '2023-01-01', toDate: '2026-01-01', baseDate: '2026-01-01',
    weeklyTab: 'price', tradeMaOn: true, tradeMaWindow: 13, baseLineOn: true,
    yRanges: {}, tradeYRanges: {}, chartOptions: {},
  };
}

function entry(partial: Partial<SlotEntry>): SlotEntry {
  return { id: 'e', updatedAt: 0, weekly: null, monthly: null, ...partial };
}

beforeEach(() => {
  useSlotStore.setState({ slots: Array(SLOT_COUNT).fill(null) });
  vi.restoreAllMocks();
});

describe('useSlotStore', () => {
  it('saveToSlot(single)은 현재 모드 스냅샷만 채운다', () => {
    vi.spyOn(captureMod, 'capture').mockImplementation(m => fakeSnap(m, m));
    useSlotStore.getState().saveToSlot('weekly', 2, false);
    const slot = useSlotStore.getState().slots[2];
    expect(slot?.weekly?.name).toBe('weekly');
    expect(slot?.monthly).toBeNull();
  });

  it('saveToSlot(includeBoth)은 주간·월간을 함께 채운다', () => {
    vi.spyOn(captureMod, 'capture').mockImplementation(m => fakeSnap(m, m));
    useSlotStore.getState().saveToSlot('weekly', 0, true);
    const slot = useSlotStore.getState().slots[0];
    expect(slot?.weekly?.name).toBe('weekly');
    expect(slot?.monthly?.name).toBe('monthly');
  });

  it('단일 저장은 기존 반대 모드 스냅샷을 보존한다', () => {
    useSlotStore.setState({ slots: replaceAt(Array(SLOT_COUNT).fill(null), 1, entry({ monthly: fakeSnap('monthly', 'keep') })) });
    vi.spyOn(captureMod, 'capture').mockImplementation(m => fakeSnap(m, m));
    useSlotStore.getState().saveToSlot('weekly', 1, false);
    const slot = useSlotStore.getState().slots[1];
    expect(slot?.weekly?.name).toBe('weekly');
    expect(slot?.monthly?.name).toBe('keep');
  });

  it('loadSlot은 preferMode 스냅샷을 apply한다', () => {
    const snap = fakeSnap('weekly', 'B');
    useSlotStore.setState({ slots: replaceAt(Array(SLOT_COUNT).fill(null), 0, entry({ weekly: snap })) });
    const applySpy = vi.spyOn(captureMod, 'apply').mockImplementation(() => {});
    useSlotStore.getState().loadSlot(0, 'weekly');
    expect(applySpy).toHaveBeenCalledWith(snap);
  });

  it('loadSlot은 preferMode가 비면 반대 모드로 폴백한다', () => {
    const snap = fakeSnap('monthly', 'M');
    useSlotStore.setState({ slots: replaceAt(Array(SLOT_COUNT).fill(null), 0, entry({ monthly: snap })) });
    const applySpy = vi.spyOn(captureMod, 'apply').mockImplementation(() => {});
    useSlotStore.getState().loadSlot(0, 'weekly');
    expect(applySpy).toHaveBeenCalledWith(snap);
  });

  it('deleteSlot은 슬롯 전체를 비운다', () => {
    useSlotStore.setState({ slots: replaceAt(Array(SLOT_COUNT).fill(null), 1, entry({ weekly: fakeSnap('weekly'), monthly: fakeSnap('monthly') })) });
    useSlotStore.getState().deleteSlot(1);
    expect(useSlotStore.getState().slots[1]).toBeNull();
  });

  it('deleteMode는 한쪽만 비우고, 모두 비면 슬롯을 제거한다', () => {
    useSlotStore.setState({ slots: replaceAt(Array(SLOT_COUNT).fill(null), 1, entry({ weekly: fakeSnap('weekly'), monthly: fakeSnap('monthly') })) });
    useSlotStore.getState().deleteMode(1, 'weekly');
    expect(useSlotStore.getState().slots[1]?.weekly).toBeNull();
    expect(useSlotStore.getState().slots[1]?.monthly?.name).toBe('snap');
    useSlotStore.getState().deleteMode(1, 'monthly');
    expect(useSlotStore.getState().slots[1]).toBeNull();
  });

  it('renameSlot은 담긴 양쪽 스냅샷 이름을 모두 바꾼다', () => {
    useSlotStore.setState({ slots: replaceAt(Array(SLOT_COUNT).fill(null), 0, entry({ weekly: fakeSnap('weekly', 'old'), monthly: fakeSnap('monthly', 'old') })) });
    useSlotStore.getState().renameSlot(0, 'new');
    expect(useSlotStore.getState().slots[0]?.weekly?.name).toBe('new');
    expect(useSlotStore.getState().slots[0]?.monthly?.name).toBe('new');
  });

  it('범위 밖 인덱스는 무시한다', () => {
    vi.spyOn(captureMod, 'capture').mockImplementation(m => fakeSnap(m));
    useSlotStore.getState().saveToSlot('weekly', SLOT_COUNT, false);
    expect(useSlotStore.getState().slots.every(s => s === null)).toBe(true);
  });
});

function replaceAt<T>(arr: T[], index: number, value: T): T[] {
  const next = [...arr];
  next[index] = value;
  return next;
}
