import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitPullRequest,
  CheckSquare,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  FileText,
  Building2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    projects,
    approvals,
    changeHistories,
    setAdminTab,
    setActiveProjectDetailId,
  } = useApp();

  const totalBudget = projects.reduce((acc, p) => acc + p.budgetAmt, 0);

  // Group projects by stage pipeline
  const pipelineCounts = {
    DISCOVERED: projects.filter((p) => p.stageCd === 'DISCOVERED').length,
    PRELIM: projects.filter((p) => p.stageCd === 'PRELIM').length,
    REVIEW: projects.filter((p) => p.stageCd === 'REVIEW' || p.stageCd === 'SELECTED' || p.stageCd === 'HELD').length,
    CONFIRMED: projects.filter((p) => p.stageCd === 'CONFIRMED').length,
    CONTRACTED: projects.filter((p) => p.stageCd === 'CONTRACTED').length,
    ONGOING: projects.filter((p) => p.stageCd === 'ONGOING').length,
    CLOSED: projects.filter((p) => p.stageCd === 'CLOSED' || p.stageCd === 'FOLLOWUP').length,
  };

  const pendingApprovals = approvals.filter((a) => a.statusCd === 'PENDING');

  // Collect delayed schedules
  const delayedSchedules = projects.flatMap((p) =>
    (p.schedules || [])
      .filter((s) => s.delayYn === 'Y')
      .map((s) => ({
        ...s,
        projectNm: p.projectNm,
        countryNm: p.countryNm,
      }))
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Top Welcome & KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>총 관리 사업 수</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {projects.length}
            <span className="text-xs font-bold text-slate-500 ml-1">개 과제</span>
          </div>
          <div className="text-[11px] text-blue-700 mt-2 font-medium">
            공개 {projects.filter((p) => p.isPublic === 'Y').length}건 / 비공개 {projects.filter((p) => p.isPublic === 'N').length}건
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>총 사업비 규모</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 tracking-tight font-mono">
            {totalBudget.toLocaleString()}
            <span className="text-xs font-bold text-slate-500 ml-1 font-sans">원</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-2 font-medium">
            전 주기 계약 및 집행 관리 중 ({(totalBudget / 100000000).toFixed(0)}억원)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-1">
            <span>결재 대기 건수</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 tracking-tight">
            {pendingApprovals.length}
            <span className="text-xs font-bold text-amber-700 ml-1">건 대기</span>
          </div>
          <div
            onClick={() => setAdminTab('approvals')}
            className="text-[11px] text-amber-800 mt-2 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            부서장 승인 처리 바로가기 <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs text-rose-900 font-semibold mb-1">
            <span>공정 지연 관리</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-950 tracking-tight">
            {delayedSchedules.length}
            <span className="text-xs font-bold text-rose-700 ml-1">건 지연</span>
          </div>
          <div
            onClick={() => setAdminTab('schedules')}
            className="text-[11px] text-rose-800 mt-2 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            사유 및 조치사항 점검 <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Stage Pipeline Banner (F-110 ~ F-113) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">전 주기 단계별 추진현황 파이프라인 (F-113)</h2>
            <p className="text-xs text-slate-500">
              N-2년 발굴부터 N년 확정, 수행, 종료 및 사후 추적조사까지의 단계별 과제 분포
            </p>
          </div>
          <button
            onClick={() => setAdminTab('stages')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>파이프라인 보드 보기</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          {[
            { label: '발굴 (N-2)', count: pipelineCounts.DISCOVERED, color: 'bg-amber-50 border-amber-300 text-amber-900' },
            { label: '예비검토 (N-1)', count: pipelineCounts.PRELIM, color: 'bg-blue-50 border-blue-300 text-blue-900' },
            { label: '국개위 심의', count: pipelineCounts.REVIEW, color: 'bg-indigo-50 border-indigo-300 text-indigo-900' },
            { label: '확정 (N년)', count: pipelineCounts.CONFIRMED, color: 'bg-teal-50 border-teal-300 text-teal-900' },
            { label: '계약체결', count: pipelineCounts.CONTRACTED, color: 'bg-sky-50 border-sky-300 text-sky-900' },
            { label: '수행중', count: pipelineCounts.ONGOING, color: 'bg-blue-600 border-blue-700 text-white' },
            { label: '종료·사후관리', count: pipelineCounts.CLOSED, color: 'bg-purple-50 border-purple-300 text-purple-900' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => setAdminTab('stages')}
              className={`p-3.5 rounded-xl border ${item.color} shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between`}
            >
              <span className="text-[11px] font-semibold opacity-80">{item.label}</span>
              <div className="text-xl font-black mt-2">{item.count} <span className="text-xs font-normal">건</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Columns: Pending Approvals & Delayed Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approvals Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-900">결재 대기함 (부서장 승인 필요)</h3>
            </div>
            <button
              onClick={() => setAdminTab('approvals')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              전체보기
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingApprovals.map((appr) => (
              <div
                key={appr.apprId}
                onClick={() => setAdminTab('approvals')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/20 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px]">
                    {appr.statusNm}
                  </span>
                  <span className="text-[10px] text-slate-400">{appr.requestedAt}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{appr.title}</h4>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>상신자: {appr.requestedByNm}</span>
                  <span className="font-mono text-slate-400">{appr.targetId}</span>
                </div>
              </div>
            ))}

            {pendingApprovals.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                현재 대기 중인 결재 건이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Delayed Schedules Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-sm text-slate-900">공정 지연 및 긴급 조치 대상</h3>
            </div>
            <button
              onClick={() => setAdminTab('schedules')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              전체보기
            </button>
          </div>

          <div className="space-y-2.5">
            {delayedSchedules.map((sch) => (
              <div
                key={sch.scheduleSeq}
                onClick={() => setAdminTab('schedules')}
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 hover:border-rose-300 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-900">{sch.scheduleNm}</span>
                  <span className="text-[11px] text-rose-700 font-mono font-bold">계획: {sch.planYmd}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">{sch.projectNm}</p>
                {sch.delayReason && (
                  <p className="text-[11px] text-rose-700 font-medium bg-white p-1.5 rounded border border-rose-200">
                    사유: {sch.delayReason}
                  </p>
                )}
              </div>
            ))}

            {delayedSchedules.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                현재 지연 중인 주요 공정 일정이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Audit Log Snapshot (F-140) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">최근 시스템 변경 및 감사 이력 (sy_change_hist)</h3>
          <button
            onClick={() => setAdminTab('audit')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            전체 이력 추적
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {changeHistories.slice(0, 4).map((hist) => (
            <div key={hist.histSeq} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    hist.changeType === 'INSERT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : hist.changeType === 'UPDATE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {hist.changeType}
                </span>
                <div>
                  <span className="font-semibold text-slate-800 mr-2">{hist.fieldLabel}</span>
                  <span className="text-slate-500 font-mono">[{hist.targetId}]</span>
                  <span className="text-slate-400 ml-2">
                    {hist.beforeVal} &rarr; <strong className="text-slate-700">{hist.afterVal}</strong>
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                {hist.changedByName} ({hist.changedAt})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
