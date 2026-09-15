import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Building2,
  Train,
  Compass,
  Milestone,
  MapPin,
  FileCheck,
  TrendingUp,
  Download,
  ArrowRight,
  Database,
  CheckCircle,
  BarChart,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { CODES } from '../../data/mockData';

export const PortalHome: React.FC = () => {
  const { projects, setPortalTab, setActiveProjectDetailId } = useApp();

  // Public projects only
  const publicProjects = projects.filter((p) => p.isPublic === 'Y');
  const totalBudget = publicProjects.reduce((acc, cur) => acc + cur.budgetAmt, 0);
  const uniqueCountries = new Set(publicProjects.map((p) => p.countryNm)).size;

  // Calculate domestic enterprise follow-up win amount
  const totalFollowupOrderAmt = projects.reduce((acc, p) => {
    const surveySum = (p.trackingSurveys || []).reduce((sAcc, s) => sAcc + (s.krCompanyOrderAmt || 0), 0);
    return acc + surveySum;
  }, 0);

  // Latest 4 public projects
  const recentProjects = [...publicProjects].slice(0, 4);

  // Latest public documents
  const publicDocs = projects
    .flatMap((p) => (p.documents || []).filter((d) => d.isPublic === 'Y'))
    .slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl border border-blue-900/40">
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300">
            <Globe className="w-3.5 h-3.5" />
            <span>국토교통 ODA 사업DB 관리시스템 공식 포털</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            개발도상국의 지속가능한 인프라,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              한국형 국토교통 ODA
            </span>
            가 함께 만듭니다.
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
            도시·교통·공간정보·도로·철도·토지행정 등 국토교통 분야의 개발컨설팅, 시스템 구축 및 역량강화를 통해
            수원국의 성장을 지원하고, 사업 발굴부터 사후 추적조사까지 전 주기를 투명하게 공개합니다.
          </p>
          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => setPortalTab('projects')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>사업DB 전체 조회</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPortalTab('stats')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center space-x-2 backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
            >
              <BarChart className="w-4 h-4" />
              <span>주요 통계 대시보드</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="text-xs text-slate-500 font-semibold mb-1">총 공개 사업 수</div>
          <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {publicProjects.length}
            <span className="text-sm font-bold text-slate-500 ml-1">개 과제</span>
          </div>
          <div className="text-[11px] text-blue-600 mt-2 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> N-2 발굴 ~ 종료·사후관리
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="text-xs text-slate-500 font-semibold mb-1">총 지원 예산 규모</div>
          <div className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight">
            {(totalBudget / 100000000).toFixed(0)}
            <span className="text-sm font-bold text-slate-500 ml-1">억원</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            국토교통 ODA 단일 전용 예산
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="text-xs text-slate-500 font-semibold mb-1">협력 수원국</div>
          <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {uniqueCountries}
            <span className="text-sm font-bold text-slate-500 ml-1">개국</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-2 font-medium flex items-center gap-1">
            <Globe className="w-3 h-3" /> 아시아·중남미·아프리카
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/30 shadow-xs hover:border-purple-300 transition-all">
          <div className="text-xs text-purple-900 font-semibold mb-1">국내 기업 후속 수주 성과</div>
          <div className="text-2xl md:text-3xl font-black text-purple-900 tracking-tight">
            {(totalFollowupOrderAmt / 100000000).toFixed(0)}
            <span className="text-sm font-bold text-purple-700 ml-1">억원</span>
          </div>
          <div className="text-[11px] text-purple-700 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 종료사업 추적조사 집계
          </div>
        </div>
      </div>

      {/* 6 Major Sectors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">국토교통 ODA 6대 중점 지원 분야</h2>
            <p className="text-xs text-slate-500">한국의 선진 국토교통 인프라 기술과 정책 경험을 개도국에 공유합니다.</p>
          </div>
          <button
            onClick={() => setPortalTab('projects')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>전체보기</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { code: 'URBAN', name: '도시 (스마트시티)', icon: Building2, desc: '도시계획 및 스마트시티 관제' },
            { code: 'TRANS', name: '교통 (ITS·물류)', icon: Milestone, desc: '지능형교통체계 및 간선교통' },
            { code: 'SPATIAL', name: '공간정보', icon: Compass, desc: '3차원 GIS 및 디지털트윈' },
            { code: 'ROAD', name: '도로 (교통안전)', icon: MapPin, desc: '도로망 기본계획 및 안전체계' },
            { code: 'RAIL', name: '철도 (고속·도시)', icon: Train, desc: '철도망 마스터플랜 및 운영역량' },
            { code: 'LAND', name: '토지행정 (지적)', icon: Layers, desc: '디지털 지적도 및 토지등록시스템' },
          ].map((sec) => {
            const Icon = sec.icon;
            const count = publicProjects.filter((p) => p.sectorCd === sec.code).length;
            return (
              <div
                key={sec.code}
                onClick={() => setPortalTab('projects')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 mb-1">
                  {sec.name}
                </h3>
                <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">{sec.desc}</p>
                <div className="mt-3 text-[11px] font-bold text-slate-600">
                  {count}개 과제 추진
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Projects & Recent Reports 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Public Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">최신 공개 ODA 사업 현황</h2>
            <button
              onClick={() => setPortalTab('projects')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
            >
              <span>사업DB 바로가기</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((p) => (
              <div
                key={p.projectId}
                onClick={() => setActiveProjectDetailId(p.projectId)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 font-bold text-slate-700 rounded">
                      {p.projectId}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {p.countryNm} • {p.sectorNm}
                    </span>
                    <span className="text-[11px] text-slate-500">{p.projectTypeNm}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors">
                    {p.projectNm}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center space-x-3">
                    <span>수행기관: <strong className="text-slate-700">{p.executingAgencyNm}</strong></span>
                    <span>기간: {p.startYmd} ~ {p.endYmd}</span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="text-xs text-slate-400">사업비</div>
                  <div className="text-sm font-bold text-slate-900">
                    {(p.budgetAmt / 100000000).toFixed(1)} 억원
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {p.stageNm}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Public Documents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">최신 공개 산출물</h2>
            <button
              onClick={() => setPortalTab('outputs')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              전체
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {publicDocs.map((doc) => (
              <div key={doc.docId} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                      {doc.docTypeNm}
                    </span>
                    <span className="text-[10px] text-slate-400">{doc.createdAt}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {doc.fileNm}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">{doc.projectNm}</p>
                </div>
                <button
                  onClick={() => alert(`[${doc.fileNm}] 다운로드를 시작합니다.`)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors shrink-0 mt-1"
                  title="다운로드"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Notice Card */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>국토교통 ODA 정보공개 원칙</span>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              본 시스템은 ODA 투명성 제고를 위해 사업기획서, 중간보고서, 사후평가서 등 검증된 성과 산출물을 국민에게 개방하고 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Lifecycle Diagram Section */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">국토교통 ODA 사업 전 주기 추진 체계</h2>
          <p className="text-xs text-slate-500">
            사업 발굴 단계부터 심의, 계약, 수행, 그리고 사후 추적조사 및 후속연계까지 통합 관리합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { step: '1', title: '사업 발굴', year: 'N-2년', desc: '수원국 PCP 접수 및 사전검토' },
            { step: '2', title: '예비사업 검토', year: 'N-1년', desc: '타당성 조사 및 수원국 실사' },
            { step: '3', title: '국개위 심의', year: 'N-1년 말', desc: '국제개발협력위원회 심의·선정' },
            { step: '4', title: '사업 확정', year: 'N년', desc: '정부예산 편성 및 과업 확정' },
            { step: '5', title: '계약 및 착수', year: 'N년 상반기', desc: '조달청 공고 및 수행기관 선정' },
            { step: '6', title: '수행 및 종료', year: '12~24개월', desc: '마일스톤 관리 및 성과지표 측정' },
            { step: '7', title: '사후 추적조사', year: '종료 후 1~3년', desc: '차수별 성과유지 및 후속수주 연계' },
          ].map((s) => (
            <div key={s.step} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="w-5 h-5 mx-auto bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {s.step}
              </span>
              <div className="font-bold text-slate-900 pt-1">{s.title}</div>
              <div className="text-[10px] font-mono text-blue-600 font-semibold">{s.year}</div>
              <p className="text-[10px] text-slate-500 leading-tight">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
