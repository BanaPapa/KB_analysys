import { describe, expect, it } from 'vitest';
import { toExportMarkdown, toExportJson, toXlsxBlob, toClipboardMarkdown } from '../../../src/features/analysis/lib/export';
import type { AnalysisScope, AnalysisDataset } from '../../../src/entities/analysis';

const scope: AnalysisScope = {
  mode: 'weekly',
  regions: ['gangnam'],
  regionLabels: { gangnam: '강남구' },
  period: { from: '2026-01-01', to: '2026-06-01' },
  tabs: ['weekly-price'],
};

const summary = { latest: 2, start: 1, changeAbs: 1, changePct: 100, min: 1, max: 2, mean: 1.5, direction: 'up' as const };
const datasets: AnalysisDataset[] = [
  {
    tab: 'weekly-price', metric: 'saleIndex', label: '매매지수', unit: '',
    byRegion: { gangnam: { summary, series: [{ date: '2026-01-01', value: 1 }, { date: '2026-02-01', value: 2 }], sampled: false } },
  },
];

describe('export builders', () => {
  it('toExportMarkdown: 보고서 + 데이터 JSON 블록을 포함한다', () => {
    const md = toExportMarkdown('## 결론\n상승입니다.', scope, datasets);
    expect(md).toContain('상승입니다');
    expect(md).toContain('## 데이터');
    expect(md).toContain('```json');
    expect(md).toContain('강남구'); // 지역 라벨
    expect(md).toContain('"metric": "saleIndex"');
  });

  it('toExportMarkdown: ===TAB=== 구분선을 # 제목으로 변환하고 챕터를 실선으로 구분한다(멀티탭)', () => {
    const md = toExportMarkdown('===TAB: 종합===\n본문1\n===TAB: 강남구===\n본문2', scope, datasets);
    expect(md).toContain('# 종합');
    expect(md).toContain('# 강남구');
    expect(md).not.toContain('===TAB:');
    // 챕터 사이 실선(---) 구분
    expect(md).toMatch(/본문1\n\n---\n\n# 강남구/);
  });

  it('toExportJson: 분석(원문+구조화)과 데이터를 구분해 담는다', () => {
    const report = '## 결론\n상승.\n\n## 핵심 내용\n1. 첫째.\n\n## 판단 근거\n1. 지수 +100%.\n\n## 의문점\n1. 왜 올랐나?\n   프롬프트: 거래량을 함께 확인해줘.';
    const obj = JSON.parse(toExportJson(report, scope, datasets));
    expect(obj.analysis.raw).toBe(report);
    expect(obj.analysis.tabs[0].conclusion).toContain('상승');
    expect(obj.analysis.tabs[0].keyPoints[0]).toEqual({ point: '첫째.', basis: '지수 +100%.' });
    expect(obj.analysis.tabs[0].questions[0]).toEqual({ question: '왜 올랐나?', prompt: '거래량을 함께 확인해줘.' });
    expect(obj.scope.regions).toEqual(['gangnam']);
    expect(obj.datasets).toHaveLength(1);
  });

  it('toXlsxBlob: 비어 있지 않은 xlsx Blob을 만든다', () => {
    const blob = toXlsxBlob('## 결론\n상승.', scope, datasets);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('toClipboardMarkdown: 멀티탭 보고서를 챕터 실선으로 구분한다', () => {
    const text = toClipboardMarkdown('===TAB: 종합===\n본문1\n===TAB: 강남구===\n본문2');
    expect(text).toContain('# 종합');
    expect(text).toMatch(/\n---\n/);
  });
});
