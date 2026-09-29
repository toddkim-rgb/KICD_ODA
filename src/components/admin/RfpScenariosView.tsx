import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileCheck2,
  DollarSign,
  TrendingUp,
  Globe,
  ArrowRight,
  ShieldCheck,
  FileDiff,
  Award,
  Plus,
  Send,
  Building2,
  Calendar,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Project, ApprovalRequest } from '../../types';

export const RfpScenariosView: React.FC = () => {
  const {
    projects,
    approvals,
    currentUser,
    switchRole,
    setAdminTab,
    setActiveProjectDetailId,
    setCompareReproposalData,
    createReproposal,
    addDeliberationRecord,
    submitApprovalStep,
    resubmitApproval,
    finalizeConfirmedVersion,
    saveSavingsPlan,
    approveSavingsPlan,
    addBudgetDisbursement,
    updatePdmActual,
    setEndlineEvaluation,
    reviewPublicDisclosure,
    approvePublicDisclosure,
    addPublicErrata,
  } = useApp();

  const [activeScenario, setActiveScenario] = useState<1 | 2 | 3 | 4 | 5>(1);

  // -------------------------------------------------------------
  // Scenario 1: Reproposal State
  // -------------------------------------------------------------
  const [selectedBaseProjId, setSelectedBaseProjId] = useState<string>('ODA-2023-0012');
  const [repropTitle, setRepropTitle] = useState<string>('콜롬비아 보고타시 간선급행버스(BRT) 지능형교통체계(ITS) 고도화 (2차 재제안)');
  const [repropBudget, setRepropBudget] = useState<number>(2400000000);
  const [repropType, setRepropType] = useState<string>('복합형(MP+ITS 실증구축)');
  const [repropCountermeasure, setRepropCountermeasure] = useState<string>(
    '1. 단순 컨설팅에서 보고타 BRT 1호선 연계 실증 설계 및 한국 ITS 파일럿 장비 포함\n2. 보고타시 교통국장 직속 특별TF 구성 및 수원국 재원 매칭 합의 확보'
  );

  // New deliberation form
  const [delibRound, setDelibRound] = useState<number>(2);
  const [delibCommittee, setDelibCommittee] = useState<string>('제45차 국제개발협력위원회(국개위)');
  const [delibResult, setDelibResult] = useState<'SELECTED' | 'CONDITION_SELECTED' | 'HELD' | 'REJECTED'>('SELECTED');
  const [delibReasons, setDelibReasons] = useState<string>('1차 미선정 지적사항에 대한 철저한 보완조치 확인 및 수원국 수용성 인정');

  // -------------------------------------------------------------
  // Scenario 2: Multi-step Approval State
  // -------------------------------------------------------------
  const [selectedApprId, setSelectedApprId] = useState<number>(9001);
  const [apprComment, setApprComment] = useState<string>('');
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState<boolean>(false);
  const [resubmitBudget, setResubmitBudget] = useState<number>(3350000000);
  const [resubmitComment, setResubmitComment] = useState<string>(
    '인니 신수도청(OIKN) 사전 실무협의 공문 및 산출내역서 보완 첨부하여 재상신합니다.'
  );

  // -------------------------------------------------------------
  // Scenario 3: Budget & Bid Savings State
  // -------------------------------------------------------------
  const [budgetProjId, setBudgetProjId] = useState<string>('ODA-2025-0008');
  const [isSavingsPlanModalOpen, setIsSavingsPlanModalOpen] = useState<boolean>(false);
  const [savingsPlanTitle, setSavingsPlanTitle] = useState<string>('보고타 주요 간선 교차로 2개소 AI 영상인식 드론 정밀계측 용역');
  const [savingsPlanCategory, setSavingsPlanCategory] = useState<string>('과업 고도화 및 정밀실측');
  const [savingsPlanAmt, setSavingsPlanAmt] = useState<number>(90000000);
  const [savingsPlanRationale, setSavingsPlanRationale] = useState<string>(
    '현지 통행속도 정밀 실측을 통하여 신호 알고리즘 모델링 정확도를 25% 개선'
  );

  const [isDisbursementModalOpen, setIsDisbursementModalOpen] = useState<boolean>(false);
  const [disbTitle, setDisbTitle] = useState<string>('2차 기성금 (최종 시뮬레이션 완료)');
  const [disbAmt, setDisbAmt] = useState<number>(250000000);
  const [disbCategory, setDisbCategory] = useState<'ADVANCE' | 'INTERIM' | 'FINAL'>('INTERIM');

  // -------------------------------------------------------------
  // Scenario 4: PDM State
  // -------------------------------------------------------------
  const [pdmProjId, setPdmProjId] = useState<string>('ODA-2024-0015');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<number>(501);
  const [pdmActualInput, setPdmActualInput] = useState<number>(65);
  const [pdmEvidenceDoc, setPdmEvidenceDoc] = useState<string>('하노이_스마트시티_2025_실측데이터_검증보고서.pdf');

  // -------------------------------------------------------------
  // Scenario 5: Public Disclosure State
  // -------------------------------------------------------------
  const [pubProjId, setPubProjId] = useState<string>('ODA-2024-0015');
  const [reviewPrivacy, setReviewPrivacy] = useState<boolean>(true);
  const [reviewCost, setReviewCost] = useState<boolean>(true);
  const [reviewDiplo, setReviewDiplo] = useState<boolean>(true);
  const [reviewLicense, setReviewLicense] = useState<boolean>(true);
  const [reviewOpinion, setReviewOpinion] = useState<string>('개인정보 및 원가단가 비식별 분리 완료, 대국민 공개 기준 부합');

  const [isErrataModalOpen, setIsErrataModalOpen] = useState<boolean>(false);
  const [errataField, setErrataField] = useState<string>('executingAgencyNm');
  const [errataFieldLabel, setErrataFieldLabel] = useState<string>('수행기관명');
  const [errataBefore, setErrataBefore] = useState<string>('한국토지주택공사');
  const [errataAfter, setErrataAfter] = useState<string>('한국토지주택공사(LH) 컨소시엄');
  const [errataReason, setErrataReason] = useState<string>('공동수급체(대우건설, LGCNS) 참여 표기 명확화에 따른 정정');

  // Selected Entities
  const selectedBaseProj = projects.find((p) => p.projectId === selectedBaseProjId) || projects[0];
  const selectedBudgetProj = projects.find((p) => p.projectId === budgetProjId) || projects[0];
  const selectedPdmProj = projects.find((p) => p.projectId === pdmProjId) || projects[0];
  const selectedPubProj = projects.find((p) => p.projectId === pubProjId) || projects[0];
  const activeApproval = approvals.find((a) => a.apprId === selectedApprId) || approvals[0];

  const unselectedProjects = projects.filter((p) => p.stageCd === 'REJECTED' || p.stageCd === 'HELD' || p.isPreserved);
  const activeBudget = selectedBudgetProj?.budgets?.[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Master Scenario Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              국토교통 ODA 주요 업무 프로세스
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
              미선정 재제안, 다단계 결재·확정, 낙찰차액 활용승인, PDM·추적조사, 대국민 공개 및 정정 이력의 주요 전 주기를 인터랙티브하게 검증하고 실시간 처리할 수 있습니다.
            </p>
          </div>

          {/* Quick Role Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col gap-2 shrink-0">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentUser.userNm} ({currentUser.positionNm} / {currentUser.roleNm})</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-white/10 text-[11px]">
              <span className="text-slate-400">권한전환:</span>
              <button
                onClick={() => switchRole('R-02')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  currentUser.role === 'R-02' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                담당자(R-02)
              </button>
              <button
                onClick={() => switchRole('R-03')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  currentUser.role === 'R-03' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                팀장(R-03)
              </button>
              <button
                onClick={() => switchRole('R-01')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  currentUser.role === 'R-01' ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                센터장(R-01)
              </button>
            </div>
          </div>
        </div>

        {/* 5 Scenario Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-6 pt-6 border-t border-white/10">
          {[
            {
              id: 1,
              title: '1. 미선정 재제안',
              flow: '보존 → 재제안 → 비교 → 심의',
              icon: GitBranch,
              activeBg: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30',
            },
            {
              id: 2,
              title: '2. 등록·결재·확정',
              flow: '작성 → 상신 → 승인 → 반려 → 확정',
              icon: FileCheck2,
              activeBg: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30',
            },
            {
              id: 3,
              title: '3. 계약·낙찰차액',
              flow: '배정 → 계약 → 차액 → 승인 → 집행',
              icon: DollarSign,
              activeBg: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30',
            },
            {
              id: 4,
              title: '4. PDM과 성과',
              flow: '기준선 → 목표 → 실적 → 종료선 → 추적',
              icon: TrendingUp,
              activeBg: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30',
            },
            {
              id: 5,
              title: '5. 홈페이지 공개',
              flow: '확정 → 검토 → 승인 → 게시 → 정정',
              icon: Globe,
              activeBg: 'bg-teal-600 text-white shadow-lg shadow-teal-600/30',
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScenario === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveScenario(tab.id as any)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? `${tab.activeBg} border-white/20 font-bold scale-[1.02]`
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold truncate">{tab.title}</span>
                </div>
                <div className="text-[10px] opacity-80 font-mono truncate">{tab.flow}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          SCENARIO 1: 미선정 사업 재제안
          원사업 보존 → 재제안 생성 → 변경 비교 → 재심의 결과 누적
      ======================================================== */}
      {activeScenario === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Step Pipeline Banner */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
              시나리오 1 프로세스 흐름 (RFP 요건 충족)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-600" />
                1단계: 원사업 보존 (영구불변)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-300 text-indigo-900 rounded-xl font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                2단계: 보완 재제안 생성
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-900 rounded-xl font-bold flex items-center gap-1.5">
                <FileDiff className="w-4 h-4 text-blue-600" />
                3단계: 회차별 변경 대조 (Diff)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                4단계: 재심의 결과 누적 관리
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Step 1 & Step 2 */}
            <div className="lg:col-span-5 space-y-6">
              {/* 1단계: 원사업 보존 영역 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">미선정 탈락 원사업 보존</h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                    보존본 (이력 불변)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    보존 대상 미선정 사업 선택
                  </label>
                  <select
                    value={selectedBaseProjId}
                    onChange={(e) => setSelectedBaseProjId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold bg-white"
                  >
                    {unselectedProjects.map((p) => (
                      <option key={p.projectId} value={p.projectId}>
                        [{p.projectId}] {p.projectNm} ({p.stageNm})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedBaseProj && (
                  <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-rose-900">{selectedBaseProj.projectId}</span>
                      <span className="text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-semibold">
                        보존일: {selectedBaseProj.preservedAt || '2023-11-20'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 line-clamp-1">{selectedBaseProj.projectNm}</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-rose-200">
                      <div>수원국: <strong className="text-slate-800">{selectedBaseProj.countryNm}</strong></div>
                      <div>사업비: <strong className="text-rose-800">{selectedBaseProj.budgetAmt.toLocaleString()}원 ({(selectedBaseProj.budgetAmt / 100000000).toFixed(1)}억원)</strong></div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-rose-200 text-[11px] text-rose-950">
                      <strong>1차 심의 탈락사유:</strong>
                      <p className="mt-0.5 text-slate-700 whitespace-pre-line leading-relaxed">
                        {selectedBaseProj.deliberations?.[0]?.mainReasons || '과업 범위 구체성 부족 및 수원국 재원 매칭 확약 미비'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 2단계: 재제안 생성 폼 */}
              <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">보완 재제안서 생성</h3>
                  </div>
                  <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                    원사업 번호 자동연계
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">재제안 사업명</label>
                    <input
                      type="text"
                      value={repropTitle}
                      onChange={(e) => setRepropTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">조정 총 사업비 (원)</label>
                      <input
                        type="number"
                        step={100000000}
                        value={repropBudget}
                        onChange={(e) => setRepropBudget(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block font-mono">
                        {(repropBudget || 0).toLocaleString()}원 ({((repropBudget || 0) / 100000000).toFixed(1)}억원)
                      </span>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">과업 추진유형</label>
                      <input
                        type="text"
                        value={repropType}
                        onChange={(e) => setRepropType(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      1차 탈락사유 조치계획 및 보완점
                    </label>
                    <textarea
                      rows={3}
                      value={repropCountermeasure}
                      onChange={(e) => setRepropCountermeasure(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!selectedBaseProj) return;
                      createReproposal(selectedBaseProj.projectId, {
                        projectNm: repropTitle,
                        budgetAmt: repropBudget,
                        projectTypeNm: repropType,
                        countermeasurePlan: repropCountermeasure,
                      });
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>원사업 보존 확정 및 2차 재제안 과제 생성</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Step 3 (Diff) & Step 4 (Deliberations) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 3단계: 변경 비교 (Side-by-side Diff) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">
                      원사업 vs 재제안 회차별 변경 대조 (Diff Comparison)
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      const base = projects.find((p) => p.projectId === 'ODA-2023-0012') || selectedBaseProj;
                      const target = projects.find((p) => p.projectId === 'ODA-2025-0008') || projects[0];
                      setCompareReproposalData({ base, target });
                    }}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>전체화면 정밀 비교창 열기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 w-24">비교 항목</th>
                        <th className="p-2.5 w-1/3 bg-rose-50 text-rose-900">1차 원사업 (Before)</th>
                        <th className="p-2.5 w-1/3 bg-indigo-50 text-indigo-900">2차 보완 재제안 (After)</th>
                        <th className="p-2.5">보완 및 기대효과</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-600">총 사업비</td>
                        <td className="p-2.5 text-rose-800 font-mono">15.0 억원</td>
                        <td className="p-2.5 text-indigo-800 font-mono font-bold bg-indigo-50/30">24.0 억원 (+9억원)</td>
                        <td className="p-2.5 text-slate-500">현장 실증 테스트베드 비용 반영</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-600">사업 유형</td>
                        <td className="p-2.5 text-slate-600">개발컨설팅(단순 MP)</td>
                        <td className="p-2.5 text-indigo-900 font-bold bg-indigo-50/30">복합형(MP+ITS 파일럿 실증)</td>
                        <td className="p-2.5 text-slate-500">수원국 수용성 및 실효성 강화</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-600">수원국 협력체계</td>
                        <td className="p-2.5 text-slate-600">보고타시 일반교통과</td>
                        <td className="p-2.5 text-indigo-900 font-bold bg-indigo-50/30">교통국장 직속 특별TF 구성</td>
                        <td className="p-2.5 text-slate-500">추진동력 및 부처간 인허가 보강</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-600">탈락사유 조치</td>
                        <td className="p-2.5 text-rose-800">단순 계획에 머물러 탈락</td>
                        <td className="p-2.5 text-emerald-800 font-bold bg-emerald-50/30">한국 ITS 실증모델 결합 통과</td>
                        <td className="p-2.5 text-slate-500">국개위 재심의 승인 근거</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4단계: 재심의 결과 누적 관리 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      4
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">
                      회차별 재심의 결과 누적 타임라인 (ODA-2025-0008)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    차수별 심사의결서 누적 관리
                  </span>
                </div>

                {/* Deliberations Timeline */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[11px]">
                        제 1차 심의: 미선정(탈락)
                      </span>
                      <span className="font-mono text-slate-500">2023-09-15 | 의결서: MOLIT-ODA-2023-DEC</span>
                    </div>
                    <div className="font-bold text-slate-800">국토교통 ODA 실무기획위원회 심의 결과</div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      과업 범위의 구체성 부족, 단순 컨설팅 위주로 실효성 미흡, 수원국 재원 매칭 확약 미비로 미선정 의결됨.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        제 2차 재심의: 최종 선정 (승인 통과)
                      </span>
                      <span className="font-mono text-emerald-800 font-semibold">2025-01-20 | 의결서: CIDC-2025-APP-042</span>
                    </div>
                    <div className="font-bold text-slate-800">제44차 국제개발협력위원회(국개위) 재심의 결과</div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      1차 탈락 사유에 대한 철저한 보완(ITS 실증 결합 및 특별TF 구성)이 확인되어 24억원으로 재심의 최종 승인 확정됨.
                    </p>
                  </div>
                </div>

                {/* Add Next Deliberation Form */}
                <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                  <div className="font-semibold text-slate-800">신규 심의/재심의 결과 추가 등록</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="위원회명 (예: 제45차 국개위)"
                      value={delibCommittee}
                      onChange={(e) => setDelibCommittee(e.target.value)}
                      className="p-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                    <select
                      value={delibResult}
                      onChange={(e) => setDelibResult(e.target.value as any)}
                      className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                    >
                      <option value="SELECTED">선정 (통과)</option>
                      <option value="CONDITION_SELECTED">조건부선정</option>
                      <option value="HELD">보류</option>
                      <option value="REJECTED">미선정(탈락)</option>
                    </select>
                    <button
                      onClick={() => {
                        addDeliberationRecord('ODA-2025-0008', {
                          projectId: 'ODA-2025-0008',
                          roundNo: 3,
                          committeeNm: delibCommittee,
                          delibYmd: new Date().toISOString().slice(0, 10),
                          resultCd: delibResult,
                          resultNm: delibResult === 'SELECTED' ? '선정(통과)' : delibResult,
                          mainReasons: delibReasons,
                          countermeasurePlan: '차기 과업 관리 철저',
                          docNo: `CIDC-2026-REC-0${Math.floor(Math.random() * 90 + 10)}`,
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      심의결과 누적 추가
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCENARIO 2: 등록·수정·결재·확정
          담당자 작성 → 상신 → 팀장·센터장 승인 → 반려·재상신 → 승인본 확정
      ======================================================== */}
      {activeScenario === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Step Pipeline Banner */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              시나리오 2 프로세스 흐름 (다단계 전자결재 & 버전 확정)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                1단계: 담당자 작성·상신
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-900 rounded-xl font-bold flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                2단계: 팀장 1차 검토승인
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-purple-50 border border-purple-300 text-purple-900 rounded-xl font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                3단계: 센터장 최종 승인
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl font-bold flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                4단계: 반려 사유 & 보완 재상신
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                5단계: 승인본 확정 아카이빙
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Approval Queue & Resubmit test */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-xs text-slate-900">진행 중인 전자결재 문서</h3>
                  <span className="text-[11px] text-blue-600 font-bold">{approvals.length}건</span>
                </div>

                <div className="space-y-2 text-xs">
                  {approvals.map((appr) => {
                    const isSelected = selectedApprId === appr.apprId;
                    return (
                      <div
                        key={appr.apprId}
                        onClick={() => setSelectedApprId(appr.apprId)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                            : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              appr.statusCd === 'PENDING'
                                ? 'bg-amber-100 text-amber-900'
                                : appr.statusCd === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {appr.statusNm}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">#{appr.apprId}</span>
                        </div>
                        <div className="font-bold text-slate-900 line-clamp-1">{appr.title}</div>
                        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                          <span>기안자: {appr.requestedByNm}</span>
                          <span className="font-mono">{appr.requestedAt?.slice(0, 10)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 반려된 결재 건 보완 재상신 전용 카드 */}
              {activeApproval && activeApproval.statusCd === 'RETURNED' && (
                <div className="bg-rose-50 border border-rose-300 p-5 rounded-2xl shadow-xs space-y-3 text-xs">
                  <div className="flex items-center space-x-2 text-rose-900 font-bold">
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>반려 건 확인 및 2차 보완 재상신</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-rose-200 text-slate-800">
                    <strong className="text-rose-900 text-[11px] block mb-1">결재권자 반려의견:</strong>
                    {activeApproval.returnReason || '수원국 협의 공문 누락으로 보완 필요'}
                  </div>
                  <button
                    onClick={() => setIsResubmitModalOpen(true)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>수정 후 2차 보완 재상신 실행</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right 8 Cols: Multi-step Workflow & Decision */}
            <div className="lg:col-span-8 space-y-6">
              {activeApproval ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  {/* Approval Title & Metadata */}
                  <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 text-xs mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded">
                          결재번호 {activeApproval.apprId}
                        </span>
                        <span className="text-slate-500 font-mono">대상: {activeApproval.targetId}</span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900">{activeApproval.title}</h2>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-slate-400">상신일시</div>
                      <div className="font-mono text-slate-700">{activeApproval.requestedAt}</div>
                    </div>
                  </div>

                  {/* Multi-step Approval Line Visualizer */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-800">다단계 전자결재 진행선 (Approval Line)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {/* Step 1 */}
                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500 font-semibold">1단계: 기안상신</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="font-bold text-slate-900">{activeApproval.requestedByNm}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">상신 완료</div>
                      </div>

                      {/* Step 2 */}
                      <div
                        className={`p-3 rounded-xl border ${
                          activeApproval.currentStepNo === 2 && activeApproval.statusCd === 'PENDING'
                            ? 'bg-blue-50 border-blue-400 shadow-2xs'
                            : activeApproval.currentStepNo && activeApproval.currentStepNo > 2
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-blue-700 font-semibold">2단계: 팀장 1차 검토</span>
                          {activeApproval.currentStepNo && activeApproval.currentStepNo > 2 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          )}
                        </div>
                        <div className="font-bold text-slate-900">박진우 (부서장/실장)</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {activeApproval.currentStepNo === 2 ? '검토 대기중' : '1차 검토 승인완료'}
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div
                        className={`p-3 rounded-xl border ${
                          activeApproval.currentStepNo === 3 && activeApproval.statusCd === 'PENDING'
                            ? 'bg-purple-50 border-purple-400 shadow-2xs'
                            : activeApproval.statusCd === 'APPROVED'
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-purple-700 font-semibold">3단계: 센터장 최종승인</span>
                          {activeApproval.statusCd === 'APPROVED' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <div className="font-bold text-slate-900">이사장 / 센터장</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {activeApproval.statusCd === 'APPROVED' ? '최종 승인확정' : '최종 결재 대기'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Side-by-Side Diff Table */}
                  <div>
                    <div className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                      <FileDiff className="w-4 h-4 text-blue-600" />
                      <span>상신 전·후 데이터 대조 (Side-by-Side Diff)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                        <div className="font-bold text-slate-700">변경 전 (Before) 원천 데이터</div>
                        {activeApproval.beforePayloadJson ? (
                          Object.entries(activeApproval.beforePayloadJson).map(([k, v]) => (
                            <div key={k} className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                              <span>{k}:</span>
                              <strong className="font-mono text-slate-800">{String(v)}</strong>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-400 italic py-2">원천 변경전 없음 (신규)</div>
                        )}
                      </div>

                      <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1.5">
                        <div className="font-bold text-blue-950">변경 후 상신안 (After) 승인시 적용</div>
                        {activeApproval.payloadJson ? (
                          Object.entries(activeApproval.payloadJson).map(([k, v]) => (
                            <div key={k} className="flex justify-between py-1 border-b border-blue-200 text-blue-900">
                              <span>{k}:</span>
                              <strong className="font-mono text-blue-950 bg-blue-100/70 px-1 rounded">{String(v)}</strong>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-400 italic py-2">상세 없음</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Multi-step Approval Decision Actions */}
                  {activeApproval.statusCd === 'PENDING' && (
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-slate-800">
                          결재 심의 의견 작성 ({activeApproval.currentStepNo === 2 ? '팀장 1차 검토' : '센터장 최종결재'})
                        </label>
                        <span className="text-[11px] text-blue-600 font-semibold">
                          현재 로그인: {currentUser.userNm} ({currentUser.roleNm})
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={apprComment}
                        onChange={(e) => setApprComment(e.target.value)}
                        placeholder="결재 심의 의견 및 보완 지시사항을 기재하세요..."
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                      />

                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            submitApprovalStep(activeApproval.apprId, 'REJECT', apprComment || '보완 반려');
                            setApprComment('');
                          }}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          반려 (보완 요구)
                        </button>
                        <button
                          onClick={() => {
                            submitApprovalStep(activeApproval.apprId, 'SUPPLEMENT', apprComment || '보완 요청');
                            setApprComment('');
                          }}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          보완요청
                        </button>
                        <button
                          onClick={() => {
                            submitApprovalStep(activeApproval.apprId, 'APPROVE', apprComment);
                            setApprComment('');
                          }}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {activeApproval.currentStepNo === 2 ? '1차 팀장 검토 승인' : '센터장 최종 승인확정'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 5단계: 승인본 확정 이력 아카이브 */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>승인본 확정 아카이빙 이력 (Confirmed Version History)</span>
                      </div>
                      <button
                        onClick={() => finalizeConfirmedVersion(activeApproval.targetId, '사업계획 승인본 공식 아카이브 확정')}
                        className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold hover:bg-emerald-100"
                      >
                        + 신규 확정본 스냅샷 보존
                      </button>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                      {projects.find((p) => p.projectId === activeApproval.targetId)?.confirmedVersions?.length ? (
                        projects.find((p) => p.projectId === activeApproval.targetId)?.confirmedVersions?.map((v) => (
                          <div key={v.versionSeq} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                            <div>
                              <span className="font-mono font-bold text-emerald-700 mr-2">{v.versionNo}</span>
                              <span className="text-slate-800 font-semibold">{v.summary}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              <span>확정자: {v.confirmedByNm}</span> | <span>{v.confirmedAt}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-center py-2 italic text-[11px]">
                          아직 확정된 승인본 스냅샷이 없습니다. 최종 결재 승인 시 자동 확정 보관됩니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
                  선택된 결재 건이 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Modal: 반려 건 수정 후 2차 보완 재상신 */}
          {isResubmitModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900">2차 보완 재상신서 작성</h3>
                  <button onClick={() => setIsResubmitModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">사업비 보완 조정액 (원)</label>
                    <input
                      type="number"
                      step={50000000}
                      value={resubmitBudget}
                      onChange={(e) => setResubmitBudget(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block font-mono">
                      {(resubmitBudget || 0).toLocaleString()}원 ({((resubmitBudget || 0) / 100000000).toFixed(1)}억원)
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">보완 사유 및 재상신 설명</label>
                    <textarea
                      rows={3}
                      value={resubmitComment}
                      onChange={(e) => setResubmitComment(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setIsResubmitModalOpen(false)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      if (activeApproval) {
                        resubmitApproval(
                          activeApproval.apprId,
                          { ...activeApproval.payloadJson, budgetAmt: resubmitBudget },
                          resubmitComment
                        );
                      }
                      setIsResubmitModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                  >
                    보완 재상신 제출
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SCENARIO 3: 계약·집행·낙찰차액
          배정액 → 계약액 → 낙찰차액 → 활용계획 승인 → 집행 → 잔액
      ======================================================== */}
      {activeScenario === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Step Pipeline Banner */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
              시나리오 3 프로세스 흐름 (낙찰차액 자동계산 및 활용승인 정산)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                1단계: 배정액 확정
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-900 rounded-xl font-bold flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                2단계: 계약 체결액
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-300 text-indigo-900 rounded-xl font-bold flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                3단계: 낙찰차액 자동산출
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-purple-50 border border-purple-300 text-purple-900 rounded-xl font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                4단계: 활용계획 승인
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-teal-50 border border-teal-300 text-teal-900 rounded-xl font-bold flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-teal-600" />
                5단계: 기성 집행
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                6단계: 집행 잔액 정산
              </span>
            </div>
          </div>

          {/* Project Selector for Budget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">예산·계약·낙찰차액 관리 대상 사업</label>
              <select
                value={budgetProjId}
                onChange={(e) => setBudgetProjId(e.target.value)}
                className="w-full sm:w-96 p-2 border border-slate-300 rounded-xl font-bold bg-white"
              >
                {projects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    [{p.projectId}] {p.projectNm}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsSavingsPlanModalOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>낙찰차액 활용계획 수립</span>
              </button>
              <button
                onClick={() => setIsDisbursementModalOpen(true)}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <DollarSign className="w-4 h-4" />
                <span>기성 집행액 등록</span>
              </button>
            </div>
          </div>

          {/* 6 Metric KPI Breakdown Cards */}
          {activeBudget && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-semibold block mb-1">1. 배정액 (A)</span>
                <div className="text-base font-black text-slate-900 font-mono">
                  {activeBudget.budgetAmt.toLocaleString()}원
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{(activeBudget.budgetAmt / 100000000).toFixed(2)}억원 • 정부 배정 예산</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
                <span className="text-blue-900 font-semibold block mb-1">2. 계약액 (B)</span>
                <div className="text-base font-black text-blue-900 font-mono">
                  {activeBudget.contractAmt.toLocaleString()}원
                </div>
                <div className="text-[10px] text-blue-700 mt-1">{(activeBudget.contractAmt / 100000000).toFixed(2)}억원 • 용역 낙찰 계약액</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 shadow-xs">
                <span className="text-indigo-900 font-semibold block mb-1">3. 낙찰차액 (A-B)</span>
                <div className="text-base font-black text-indigo-900 font-mono">
                  {(activeBudget.budgetAmt - activeBudget.contractAmt).toLocaleString()}원
                </div>
                <div className="text-[10px] text-indigo-700 mt-1 font-bold">{((activeBudget.budgetAmt - activeBudget.contractAmt) / 100000000).toFixed(2)}억원 • 자동 산출 완료</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-xs">
                <span className="text-purple-900 font-semibold block mb-1">4. 차액 활용 승인</span>
                <div className="text-sm font-black text-purple-950 truncate">
                  {activeBudget.savingUsePlanObj?.status === 'APPROVED' ? '승인완료' : '승인대기중'}
                </div>
                <div className="text-[10px] text-purple-700 mt-1 truncate">
                  {activeBudget.savingUsePlan || '활용계획 수립됨'}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-teal-200 bg-teal-50/20 shadow-xs">
                <span className="text-teal-900 font-semibold block mb-1">5. 기성 집행액 (C)</span>
                <div className="text-base font-black text-teal-900 font-mono">
                  {activeBudget.executedAmt.toLocaleString()}원
                </div>
                <div className="text-[10px] text-teal-700 mt-1">
                  {(activeBudget.executedAmt / 100000000).toFixed(2)}억원 (집행률 {activeBudget.contractAmt > 0 ? ((activeBudget.executedAmt / activeBudget.contractAmt) * 100).toFixed(1) : 0}%)
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-semibold block mb-1">6. 집행 잔액 (B-C)</span>
                <div className="text-base font-black text-slate-900 font-mono">
                  {(activeBudget.contractAmt - activeBudget.executedAmt).toLocaleString()}원
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{((activeBudget.contractAmt - activeBudget.executedAmt) / 100000000).toFixed(2)}억원 • 정산 대기 잔액</div>
              </div>
            </div>
          )}

          {/* Savings Utilization Plan Card & Disbursements Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Savings Utilization Plan Detail & Approval */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-indigo-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    4
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">낙찰차액 활용계획 및 승인 현황</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    activeBudget?.savingUsePlanObj?.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {activeBudget?.savingUsePlanObj?.status === 'APPROVED' ? '승인 확정' : '결재 대기'}
                </span>
              </div>

              {activeBudget?.savingUsePlanObj ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
                    <div className="font-bold text-slate-900 text-xs">
                      {activeBudget.savingUsePlanObj.title}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>활용 예정액: <strong className="text-indigo-900 font-mono">{activeBudget.savingUsePlanObj.plannedAmt.toLocaleString()}원 ({(activeBudget.savingUsePlanObj.plannedAmt / 100000000).toFixed(2)}억원)</strong></div>
                      <div>구분: <strong className="text-slate-800">{activeBudget.savingUsePlanObj.category}</strong></div>
                    </div>
                    <div className="text-slate-700 pt-2 border-t border-indigo-200/60 leading-relaxed">
                      <strong>활용 사유:</strong> {activeBudget.savingUsePlanObj.rationale}
                    </div>
                    {activeBudget.savingUsePlanObj.approvedAt && (
                      <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                        ✓ 승인일시: {activeBudget.savingUsePlanObj.approvedAt} ({activeBudget.savingUsePlanObj.approverNm})
                      </div>
                    )}
                  </div>

                  {activeBudget.savingUsePlanObj.status !== 'APPROVED' && (
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => approveSavingsPlan(selectedBudgetProj.projectId, activeBudget.budgetSeq, false, '재원 재검토 반려')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                      >
                        계획 반려
                      </button>
                      <button
                        onClick={() => approveSavingsPlan(selectedBudgetProj.projectId, activeBudget.budgetSeq, true)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>활용계획 승인 확정 (부서장)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  아직 수립된 낙찰차액 활용계획이 없습니다. 상단의 '낙찰차액 활용계획 수립' 버튼을 클릭하세요.
                </div>
              )}
            </div>

            {/* Right 6 cols: Disbursement Execution Payments */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-teal-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-teal-100">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                    5
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">차수별 기성금 집행 내역 (Disbursements)</h3>
                </div>
                <span className="text-teal-800 font-semibold text-[11px]">
                  총 {activeBudget?.disbursements?.length || 0}차 지급
                </span>
              </div>

              <div className="space-y-2">
                {activeBudget?.disbursements?.map((d) => (
                  <div key={d.paymentSeq} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                          {d.roundNo}차 ({d.categoryNm})
                        </span>
                        <span>{d.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        지급일: {d.paidYmd} | 증빙: {d.invoiceDocNo}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-teal-900 text-sm">
                        {d.paidAmt.toLocaleString()}원
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">
                        ({(d.paidAmt / 100000000).toFixed(2)} 억원)
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold">지급완료</span>
                    </div>
                  </div>
                ))}

                {(!activeBudget?.disbursements || activeBudget.disbursements.length === 0) && (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    아직 등록된 기성금 집행 내역이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal: 낙찰차액 활용계획 수립 */}
          {isSavingsPlanModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900">낙찰차액 활용계획서 작성 및 상신</h3>
                  <button onClick={() => setIsSavingsPlanModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">활용 과업명</label>
                    <input
                      type="text"
                      value={savingsPlanTitle}
                      onChange={(e) => setSavingsPlanTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">활용 금액 (원)</label>
                      <input
                        type="number"
                        step={10000000}
                        value={savingsPlanAmt}
                        onChange={(e) => setSavingsPlanAmt(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block font-mono">
                        {(savingsPlanAmt || 0).toLocaleString()}원 ({((savingsPlanAmt || 0) / 100000000).toFixed(2)}억원)
                      </span>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">활용 구분</label>
                      <select
                        value={savingsPlanCategory}
                        onChange={(e) => setSavingsPlanCategory(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="과업 고도화 및 정밀실측">과업 고도화 및 정밀실측</option>
                        <option value="추가 현지조사 및 검증">추가 현지조사 및 검증</option>
                        <option value="성과확산 세미나 확대">성과확산 세미나 확대</option>
                        <option value="국고 잔액 반납">국고 잔액 반납</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">활용 타당성 및 기대효과</label>
                    <textarea
                      rows={3}
                      value={savingsPlanRationale}
                      onChange={(e) => setSavingsPlanRationale(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button onClick={() => setIsSavingsPlanModalOpen(false)} className="px-3 py-1.5 text-slate-600 rounded-lg">취소</button>
                  <button
                    onClick={() => {
                      if (activeBudget) {
                        saveSavingsPlan(selectedBudgetProj.projectId, activeBudget.budgetSeq, {
                          title: savingsPlanTitle,
                          plannedAmt: savingsPlanAmt,
                          category: savingsPlanCategory,
                          rationale: savingsPlanRationale,
                          approveImmediately: false,
                        });
                      }
                      setIsSavingsPlanModalOpen(false);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                  >
                    활용계획 상신
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: 기성 집행액 등록 */}
          {isDisbursementModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900">기성 집행액 지급 등록</h3>
                  <button onClick={() => setIsDisbursementModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">집행 기성명</label>
                    <input
                      type="text"
                      value={disbTitle}
                      onChange={(e) => setDisbTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">지급 금액 (원)</label>
                      <input
                        type="number"
                        step={10000000}
                        value={disbAmt}
                        onChange={(e) => setDisbAmt(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block font-mono">
                        {(disbAmt || 0).toLocaleString()}원 ({((disbAmt || 0) / 100000000).toFixed(2)}억원)
                      </span>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">기성 구분</label>
                      <select
                        value={disbCategory}
                        onChange={(e) => setDisbCategory(e.target.value as any)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="ADVANCE">착수 선금</option>
                        <option value="INTERIM">중간 기성금</option>
                        <option value="FINAL">최종 준공금</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button onClick={() => setIsDisbursementModalOpen(false)} className="px-3 py-1.5 text-slate-600 rounded-lg">취소</button>
                  <button
                    onClick={() => {
                      if (activeBudget) {
                        addBudgetDisbursement(selectedBudgetProj.projectId, activeBudget.budgetSeq, {
                          title: disbTitle,
                          paidYmd: new Date().toISOString().slice(0, 10),
                          paidAmt: disbAmt,
                          category: disbCategory,
                          categoryNm: disbCategory === 'ADVANCE' ? '선금' : disbCategory === 'INTERIM' ? '중간기성' : '준공금',
                          invoiceDocNo: `INV-${Date.now().toString().slice(-6)}`,
                        });
                      }
                      setIsDisbursementModalOpen(false);
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold"
                  >
                    집행 등록 완료
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SCENARIO 4: PDM과 종료 후 성과
          기준선 → 목표 → 실적·증빙 → 종료선 → 차수별 추적조사
      ======================================================== */}
      {activeScenario === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Step Pipeline Banner */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
              시나리오 4 프로세스 흐름 (PDM 전 주기 & 종료 후 사후 추적조사)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                1단계: 기준선 (Baseline)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-900 rounded-xl font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                2단계: 목표치 (Target)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                3단계: 실적 및 증빙 첨부
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                4단계: 종료선 종합평가
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-purple-50 border border-purple-300 text-purple-900 rounded-xl font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                5단계: 차수별 추적조사 (1~3차)
              </span>
            </div>
          </div>

          {/* Project Selector for PDM */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">성과 관리 대상 사업 선택</label>
              <select
                value={pdmProjId}
                onChange={(e) => setPdmProjId(e.target.value)}
                className="w-full sm:w-96 p-2 border border-slate-300 rounded-xl font-bold bg-white"
              >
                {projects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    [{p.projectId}] {p.projectNm} ({p.stageNm})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setAdminTab('performance')}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>성과/추적조사 대장 바로가기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PDM Indicators Table (Baseline vs Target vs Actual + Evidence) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                사업 성과관리 PDM 지표 매트릭스 (기준선·목표·실적·증빙)
              </h3>
              <span className="text-xs text-slate-500">
                {selectedPdmProj.indicators?.length || 0}개 지표 등록됨
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 w-16">레벨</th>
                    <th className="p-3">지표명</th>
                    <th className="p-3 w-24 text-right">기준선(착수)</th>
                    <th className="p-3 w-24 text-right">목표치(종료)</th>
                    <th className="p-3 w-28 text-right bg-emerald-50 text-emerald-900 font-bold">실적치(현재)</th>
                    <th className="p-3 w-20 text-center">달성률</th>
                    <th className="p-3 w-48">실적 증빙자료 파일</th>
                    <th className="p-3 w-20 text-center">갱신</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedPdmProj.indicators?.map((ind) => {
                    const rate = ind.targetVal > 0 ? ((ind.actualVal / ind.targetVal) * 100).toFixed(0) : '0';
                    return (
                      <tr key={ind.indicatorId} className="hover:bg-slate-50/70">
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                            {ind.indicatorLevel}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-900">
                          {ind.indicatorNm}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-600">
                          {ind.baselineVal} {ind.unit}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-blue-900">
                          {ind.targetVal} {ind.unit}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-800 bg-emerald-50/30">
                          {ind.actualVal} {ind.unit}
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-mono font-bold text-slate-800">{rate}%</span>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, Number(rate))}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          {ind.evidenceDocNm ? (
                            <span className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer">
                              📎 {ind.evidenceDocNm}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">증빙문서 미첨부</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedIndicatorId(ind.indicatorId);
                              setPdmActualInput(ind.actualVal);
                              updatePdmActual(selectedPdmProj.projectId, ind.indicatorId, ind.actualVal + 5, '2025_하반기_현장실측보고서.pdf');
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded text-[10px] font-bold"
                          >
                            +5 실적갱신
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {(!selectedPdmProj.indicators || selectedPdmProj.indicators.length === 0) && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                        해당 사업에 등록된 PDM 지표가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Endline Evaluation & Multi-Round Tracking Surveys */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: 종료선 종합평가 */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
                    4
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">종료선 종합 성과평가 (Endline Evaluation)</h3>
                </div>
                <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-amber-100 text-amber-800">
                  {selectedPdmProj.endlineEval?.gradeNm || '평가 완료'}
                </span>
              </div>

              {selectedPdmProj.endlineEval ? (
                <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-900 font-extrabold text-sm">
                      종합 평가 등급: {selectedPdmProj.endlineEval.gradeNm} ({selectedPdmProj.endlineEval.score}점)
                    </span>
                    <span className="font-mono text-slate-500">{selectedPdmProj.endlineEval.evalYmd}</span>
                  </div>
                  <div className="text-slate-600">
                    평가 주체: <strong>{selectedPdmProj.endlineEval.evaluatorNm}</strong>
                  </div>
                  <div className="text-slate-700 leading-relaxed pt-2 border-t border-amber-200/60">
                    <strong>전략적 종합의견:</strong> {selectedPdmProj.endlineEval.strategicFeedback}
                  </div>
                  <div className="text-[11px] text-blue-700 font-semibold pt-1">
                    📎 종료평가보고서: {selectedPdmProj.endlineEval.summaryReportDocNm}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
                  <p className="text-slate-500">아직 종료선 평가가 등록되지 않았습니다.</p>
                  <button
                    onClick={() => {
                      setEndlineEvaluation(selectedPdmProj.projectId, {
                        evalYmd: new Date().toISOString().slice(0, 10),
                        grade: 'A',
                        gradeNm: '우수 (A등급)',
                        score: 91,
                        evaluatorNm: '국토교통 ODA 사후종합평가위원회',
                        summaryReportDocNm: `${selectedPdmProj.projectId}_종료선_최종평가보고서.pdf`,
                        strategicFeedback: '수원국 핵심 인프라로 정상 기능 중이며, 후속 사업 연계성이 매우 우수함',
                        sustainForecast: 'HIGH',
                      });
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                  >
                    종료선 종합평가 등록 실행
                  </button>
                </div>
              )}
            </div>

            {/* Right 6 cols: 차수별 누적 사후 추적조사 (1~3차) */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-purple-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                    5
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">차수별 사후 추적조사 및 후속 수주 누적</h3>
                </div>
                <span className="text-purple-800 font-semibold text-[11px]">
                  총 {selectedPdmProj.trackingSurveys?.length || 0}회차 조사
                </span>
              </div>

              <div className="space-y-3">
                {selectedPdmProj.trackingSurveys?.map((srv) => (
                  <div key={srv.surveyId} className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[11px]">
                        제 {srv.roundNo}차 추적조사 ({srv.baseYmd})
                      </span>
                      <span className="text-emerald-700 font-bold text-[11px]">
                        성과유지: {srv.sustainYn === 'Y' ? '유지(안정)' : '미흡'}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {srv.outputUsageDesc}
                    </p>
                    {srv.krCompanyOrderAmt && (
                      <div className="p-2 bg-white rounded-lg border border-purple-200 flex items-center justify-between">
                        <span className="text-purple-900 font-semibold">국내 기업 후속 수주 실적:</span>
                        <span className="font-mono font-bold text-purple-950">
                          {srv.krCompanyOrderAmt.toLocaleString()}원 ({(srv.krCompanyOrderAmt / 100000000).toFixed(1)}억원)
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {(!selectedPdmProj.trackingSurveys || selectedPdmProj.trackingSurveys.length === 0) && (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    등록된 사후 추적조사가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCENARIO 5: 홈페이지 공개 및 정정 이력
          내부 확정정보 → 공개 검토 → 공개 승인 → 게시 → 정정 이력
      ======================================================== */}
      {activeScenario === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Step Pipeline Banner */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">
              시나리오 5 프로세스 흐름 (대국민 공개 심의 및 정정 공시 이력)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                1단계: 내부 확정정보 선별
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-900 rounded-xl font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                2단계: 공개 적합성 4대 검토
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-300 text-indigo-900 rounded-xl font-bold flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                3단계: 공개 승인 의결
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-teal-50 border border-teal-300 text-teal-900 rounded-xl font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-600" />
                4단계: 대국민 포털 실시간 게시
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl font-bold flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                5단계: 정정 공시 이력 보존
              </span>
            </div>
          </div>

          {/* Project Selector for Public Disclosure */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">공개 심의 및 공시 대상 사업</label>
              <select
                value={pubProjId}
                onChange={(e) => setPubProjId(e.target.value)}
                className="w-full sm:w-96 p-2 border border-slate-300 rounded-xl font-bold bg-white"
              >
                {projects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    [{p.projectId}] {p.projectNm} ({p.isPublic === 'Y' ? '대국민 공개중' : '비공개'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsErrataModalOpen(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>정보 정정 공시 등록 (Errata)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: 공개 검토 4대 체크리스트 & 승인 */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    2·3
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">공개 적합성 4대 점검 체크리스트 & 공개승인</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    selectedPubProj.isPublic === 'Y' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedPubProj.isPublic === 'Y' ? '공개 완료' : '비공개'}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'privacy',
                    label: '1. 개인정보 비식별 조치 여부',
                    desc: '수행인력 주민번호, 휴대전화 등 민감정보 마스킹 완료',
                    checked: reviewPrivacy,
                    setter: setReviewPrivacy,
                  },
                  {
                    id: 'cost',
                    label: '2. 비공개 세부 원가/단가 분리 여부',
                    desc: '기업 영업비밀에 해당하는 품셈 및 비공개 세부단가 제외',
                    checked: reviewCost,
                    setter: setReviewCost,
                  },
                  {
                    id: 'diplo',
                    label: '3. 수원국 외교 보안 사항 점검',
                    desc: '수원국 정부와의 대외비 협의사항 및 국가안보 관련 내용 없음',
                    checked: reviewDiplo,
                    setter: setReviewDiplo,
                  },
                  {
                    id: 'license',
                    label: '4. 산출물 배포 라이선스 적합성',
                    desc: '보고서 및 도면 자료의 대국민 공공누리(KOGL) 배포 허용',
                    checked: reviewLicense,
                    setter: setReviewLicense,
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">공개 심의 검토의견</label>
                <textarea
                  rows={2}
                  value={reviewOpinion}
                  onChange={(e) => setReviewOpinion(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    reviewPublicDisclosure(selectedPubProj.projectId, {
                      isReviewed: true,
                      reviewedAt: new Date().toISOString().slice(0, 10),
                      reviewerNm: `${currentUser.userNm} (${currentUser.positionNm})`,
                      privacyCheck: reviewPrivacy,
                      costSecurityCheck: reviewCost,
                      diplomaticCheck: reviewDiplo,
                      licenseCheck: reviewLicense,
                      reviewOpinion,
                    });
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold"
                >
                  검토의견 저장
                </button>
                <button
                  onClick={() => approvePublicDisclosure(selectedPubProj.projectId, 'NONE', '공개 중단')}
                  className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-bold"
                >
                  비공개 처리
                </button>
                <button
                  onClick={() => approvePublicDisclosure(selectedPubProj.projectId, 'FULL', reviewOpinion)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>대국민 포털 공개 승인 및 즉시 게시</span>
                </button>
              </div>
            </div>

            {/* Right 6 cols: 대국민 포털 게시 미리보기 & 정정 이력 공시 목록 */}
            <div className="lg:col-span-6 space-y-6">
              {/* 대국민 포털 게시 상태 카드 */}
              <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                      4
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">대국민 홈페이지 실시간 게시 현황</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    포털 DB 연동
                  </span>
                </div>

                <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-teal-900 font-bold">{selectedPubProj.projectId}</span>
                    <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded font-semibold">
                      공개범위: {selectedPubProj.disclosureApproval?.disclosureScope || 'FULL (전체공개)'}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{selectedPubProj.projectNm}</div>
                  <p className="text-slate-600 text-[11px] line-clamp-2">
                    {selectedPubProj.overview || '국토교통 ODA 지원 사업 정보'}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-2 border-t border-teal-200/60">
                    <div>수원국: <strong className="text-slate-800">{selectedPubProj.countryNm}</strong></div>
                    <div>분야: <strong className="text-slate-800">{selectedPubProj.sectorNm}</strong></div>
                    <div>사업비: <strong className="text-slate-800 font-mono">{selectedPubProj.budgetAmt.toLocaleString()}원 ({(selectedPubProj.budgetAmt / 100000000).toFixed(1)}억원)</strong></div>
                  </div>
                </div>
              </div>

              {/* 5단계: 정정 공시 이력 (Errata Notices) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      5
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">
                      공개 정보 정정 공시 이력 (Errata / Revision History)
                    </h3>
                  </div>
                  <span className="text-slate-500 font-mono">
                    {selectedPubProj.errataList?.length || 0}건 공시
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedPubProj.errataList?.map((err) => (
                    <div key={err.errataSeq} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px]">
                          정정공시 {err.noticeNo}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">{err.errataYmd}</span>
                      </div>
                      <div className="font-bold text-slate-900">
                        [{err.fieldLabel}] 항목 정정
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">정정 전:</span>
                          <span className="text-rose-700 line-through font-medium">{err.beforeVal}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">정정 후:</span>
                          <span className="text-emerald-700 font-bold">{err.afterVal}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <strong>정정 사유:</strong> {err.reason} (공시책임자: {err.authorNm})
                      </div>
                    </div>
                  ))}

                  {(!selectedPubProj.errataList || selectedPubProj.errataList.length === 0) && (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      등록된 정정 공시 이력이 없습니다. 상단의 '정보 정정 공시 등록'을 통해 투명한 수정 공시를 등록할 수 있습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal: 정정 공시 등록 */}
          {isErrataModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900">대국민 공개 정보 정정 공시 등록</h3>
                  <button onClick={() => setIsErrataModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">정정 대상 항목</label>
                    <select
                      value={errataField}
                      onChange={(e) => {
                        const val = e.target.value;
                        setErrataField(val);
                        setErrataFieldLabel(
                          val === 'executingAgencyNm' ? '수행기관명' : val === 'budgetAmt' ? '총 사업비' : '과업명'
                        );
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="executingAgencyNm">수행기관명</option>
                      <option value="budgetAmt">총 사업비</option>
                      <option value="projectNm">사업명</option>
                      <option value="endYmd">사업 종료일자</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">정정 전 내용</label>
                      <input
                        type="text"
                        value={errataBefore}
                        onChange={(e) => setErrataBefore(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-rose-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">정정 후 내용</label>
                      <input
                        type="text"
                        value={errataAfter}
                        onChange={(e) => setErrataAfter(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-emerald-700 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">정정 사유 (대국민 공시용)</label>
                    <textarea
                      rows={3}
                      value={errataReason}
                      onChange={(e) => setErrataReason(e.target.value)}
                      placeholder="수행기관 컨소시엄 협약 추가 또는 최종 계약금액 확정에 따른 정정 사유를 입력하세요."
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button onClick={() => setIsErrataModalOpen(false)} className="px-3 py-1.5 text-slate-600 rounded-lg">취소</button>
                  <button
                    onClick={() => {
                      addPublicErrata(selectedPubProj.projectId, {
                        targetField: errataField,
                        fieldLabel: errataFieldLabel,
                        beforeVal: errataBefore,
                        afterVal: errataAfter,
                        reason: errataReason,
                      });
                      setIsErrataModalOpen(false);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs"
                  >
                    정정 공시 즉시 등록
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
