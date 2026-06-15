import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlotControls } from '../../../src/features/chart-slots';
import { useSlotStore } from '../../../src/features/chart-slots/model/slot-store';
import { useMonthlyStore } from '../../../src/shared/lib/monthly-store';
import { SLOT_COUNT, SLOTS_PER_PAGE } from '../../../src/features/chart-slots/model/types';
import * as captureMod from '../../../src/features/chart-slots/lib/capture';

beforeEach(() => {
  useMonthlyStore.setState({ mode: 'weekly' });
  useSlotStore.setState({ slots: Array(SLOT_COUNT).fill(null) });
  vi.spyOn(captureMod, 'capture').mockImplementation(mode => ({
    id: 'i-' + mode, name: '서울 외 1 · 2023–2026', mode, createdAt: 0, schemaVersion: 1,
    selectedRegions: ['서울특별시'], regionLabels: {}, fromDate: '2023-01-01', toDate: '2026-01-01',
    baseDate: '2026-01-01', weeklyTab: 'price', tradeMaOn: true, tradeMaWindow: 13,
    baseLineOn: true, yRanges: {}, tradeYRanges: {}, chartOptions: {},
  }));
});

describe('SlotControls', () => {
  it('저장 버튼이 보인다', () => {
    render(<SlotControls />);
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
  });

  it('저장 버튼을 누르면 모달이 열리고 한 페이지에 10개 슬롯이 보인다', () => {
    render(<SlotControls />);
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(screen.getByText('슬롯 저장 / 불러오기')).toBeInTheDocument();
    expect(screen.getAllByText('(빈 슬롯)')).toHaveLength(SLOTS_PER_PAGE);
  });

  it('여기에 저장 → 다이얼로그에서 주간만 저장하면 주간 스냅샷만 채워진다', () => {
    render(<SlotControls />);
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    fireEvent.click(screen.getAllByText('여기에 저장')[0]!);
    // 저장 선택 다이얼로그: 카드 순서 [주간, 월간, 모두] — 주간 카드의 저장하기.
    fireEvent.click(screen.getAllByRole('button', { name: '저장하기' })[0]!);
    const slot = useSlotStore.getState().slots[0];
    expect(slot?.weekly?.name).toBe('서울 외 1 · 2023–2026');
    expect(slot?.monthly).toBeNull();
  });

  it('다이얼로그에서 모두 저장하면 주간·월간이 함께 채워진다', () => {
    render(<SlotControls />);
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    fireEvent.click(screen.getAllByText('여기에 저장')[0]!);
    // 세 번째 카드(모두)의 저장하기.
    fireEvent.click(screen.getAllByRole('button', { name: '저장하기' })[2]!);
    const slot = useSlotStore.getState().slots[0];
    expect(slot?.weekly?.name).toBe('서울 외 1 · 2023–2026');
    expect(slot?.monthly?.name).toBe('서울 외 1 · 2023–2026');
  });
});
