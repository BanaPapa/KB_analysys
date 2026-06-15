import { describe, expect, it } from 'vitest';
import { parseTabStructure } from '../../../src/features/analysis/lib/report-structure';

describe('parseTabStructure', () => {
  it('결론·인사이트·핵심 내용·판단 근거·의문점을 파싱한다', () => {
    const body = [
      '## 결론',
      '강하게 상승했다. 흐름이 견조하다.',
      '',
      '## 인사이트',
      '- 통찰 하나',
      '- 통찰 둘',
      '',
      '## 핵심 내용',
      '1. 첫째 발견이다.',
      '2. 둘째 발견이다.',
      '',
      '## 판단 근거',
      '1. 지수 +10%.',
      '2. 전세가율 60%.',
      '',
      '## 의문점',
      '1. 왜 올랐나?',
      '   프롬프트: 거래량 추세를 함께 봐줘.',
      '2. 지속될까?',
      '   프롬프트: 최근 3개월 모멘텀을 확인해줘.',
    ].join('\n');

    const s = parseTabStructure(body);
    expect(s.recognized).toBe(true);
    expect(s.conclusion).toContain('강하게 상승');
    expect(s.insights).toEqual(['통찰 하나', '통찰 둘']);
    expect(s.keyPoints).toEqual([
      { point: '첫째 발견이다.', basis: '지수 +10%.' },
      { point: '둘째 발견이다.', basis: '전세가율 60%.' },
    ]);
    expect(s.questions).toEqual([
      { question: '왜 올랐나?', prompt: '거래량 추세를 함께 봐줘.' },
      { question: '지속될까?', prompt: '최근 3개월 모멘텀을 확인해줘.' },
    ]);
  });

  it('구버전 제목(요약 정리)과 프롬프트 없는 의문점도 처리한다', () => {
    const body = [
      '## 결론',
      '안정적이다.',
      '## 요약 정리',
      '1. 핵심 하나.',
      '## 판단 근거',
      '1. 평균 87.',
      '## 의문점',
      '- 외부 요인은?',
    ].join('\n');

    const s = parseTabStructure(body);
    expect(s.keyPoints).toEqual([{ point: '핵심 하나.', basis: '평균 87.' }]);
    expect(s.questions).toEqual([{ question: '외부 요인은?', prompt: undefined }]);
  });

  it('알려진 섹션이 없으면 recognized=false', () => {
    const s = parseTabStructure('그냥 자유 본문입니다.');
    expect(s.recognized).toBe(false);
  });
});
