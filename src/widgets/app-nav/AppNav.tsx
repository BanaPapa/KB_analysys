import type { JSX } from 'react';
import { useThemeStore } from '../../shared/lib/theme';

// 통합 셸의 좌측 네비게이션. R3_Naver(매물시세) 모듈의 Estate OS 사이드바와
// 동일한 마크업/디자인을 사용해 통합 후에도 네비게이션이 흔들리지 않도록 한다.
// 현재 단독 개발 중인 모듈은 'KB 시계열 분석'(active/LIVE)뿐이며 나머지는 비활성.

type ModStatus = 'live' | 'soon';

const SOON_TIP = '현재 개발중이므로 추가예정입니다';

interface NavModule {
  key: string;
  label: string;
  status: ModStatus;
  active?: boolean;
  icon: JSX.Element;
}

const NAV_MODULES: NavModule[] = [
  {
    key: 'kb-timeseries',
    label: 'KB 시계열 분석',
    status: 'live',
    active: true,
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M3 3v18h18" />
        <path d="M7 15l3-4 3 2 4-7" />
      </svg>
    ),
  },
  {
    key: 'kb-price',
    label: 'KB시세',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M3 21h18" />
        <rect x="5" y="11" width="3" height="7" />
        <rect x="10.5" y="6" width="3" height="12" />
        <rect x="16" y="9" width="3" height="9" />
      </svg>
    ),
  },
  {
    key: 'naver',
    label: '매물시세',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M3 7h7v14H3z" />
        <path d="M14 3h7v18h-7z" />
        <path d="M6 11h1M6 15h1M17 7h1M17 11h1" />
      </svg>
    ),
  },
  {
    key: 'real-deal',
    label: '실거래가',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M3 17l5-6 4 3 6-8" />
        <path d="M16 6h3v3" />
      </svg>
    ),
  },
  {
    key: 'subscription',
    label: '지역별 청약현황',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M14 3v5h5" />
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'reviews',
    label: '입주민 리뷰',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" />
      </svg>
    ),
  },
  {
    key: 'brokers',
    label: '중개업소 추출',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M3 9l1-5h16l1 5" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    key: 'commercial',
    label: '상업시설 특화',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    key: 'location',
    label: '입지분석',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    key: 'school',
    label: '학군상세',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
  {
    key: 'development',
    label: '개발계획',
    status: 'soon',
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M3 21h18" />
        <path d="M6 21V4h12v17" />
        <path d="M9 9h6M9 13h6" />
      </svg>
    ),
  },
];

interface AppNavProps {
  onToggleCollapse: () => void;
}

export function AppNav({ onToggleCollapse }: AppNavProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <aside className="eos-side">
      <button className="eos-side-toggle" title="사이드바 접기" onClick={onToggleCollapse}>
        <svg viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="eos-brand">
        <div className="eos-brand-mark" />
        <div className="eos-brand-tx">
          <b>Estate&nbsp;OS</b>
          <span>Analytics</span>
        </div>
      </div>

      <nav className="eos-nav">
        <div className="eos-nav-sec">Workspace</div>
        {NAV_MODULES.map((m) => (
          <button
            key={m.key}
            className={`eos-nav-item${m.active ? ' active' : ''}${m.status === 'soon' ? ' disabled' : ''}`}
            aria-disabled={m.status === 'soon'}
            aria-current={m.active ? 'page' : undefined}
            title={m.status === 'soon' ? SOON_TIP : m.label}
          >
            {m.icon}
            <span className="eos-nav-label">{m.label}</span>
            <span className={`eos-dot${m.status === 'live' ? ' live' : ''}`} />
          </button>
        ))}

        <div className="eos-nav-sec">시스템</div>
        <button className="eos-nav-item disabled" aria-disabled title={SOON_TIP}>
          <svg className="ic" viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="eos-nav-label">회원 승인</span>
          <span className="eos-dot" />
        </button>
        <button className="eos-nav-item disabled" aria-disabled title={SOON_TIP}>
          <svg className="ic" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="eos-nav-label">설정</span>
          <span className="eos-dot" />
        </button>
      </nav>

      <div className="eos-acct">
        <div className="eos-acct-av">KB</div>
        <div className="eos-acct-tx">
          <b>부동산 애널리스트</b>
          <span>데이터 데스크 · Pro</span>
        </div>
        <button
          className="eos-icon-btn"
          style={{ marginLeft: 'auto', width: 32, height: 32 }}
          title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <svg viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
}
