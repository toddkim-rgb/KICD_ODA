import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, TrackingSurvey } from '../../types';
import {
  TrendingUp,
  Award,
  Plus,
  Calendar,
  Globe,
  DollarSign,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';

export const PerformanceManagementView: React.FC = () => {
  const { projects, addTrackingSurvey, setActiveProjectDetailId, exportToCsv } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.find((p) => p.trackingSurveys && p.trackingSurveys.length > 0)?.projectId || projects[0]?.projectId || ''
  );
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // New Survey Form State
  const [surveyYear, setSurveyYear] = useState(2026);
  const [surveyRound, setSurveyRound] = useState(2);
  const [evalGrade, setEvalGrade] = useState<'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'>('GOOD');
  const [facilityStatus, setFacilityStatus] = useState('정상 운영 중');
  const [systemUsageRate, setSystemUsageRate] = useState(85);
  const [krOrderAmt, setKrOrderAmt] = useState(5000000000);
  const [krOrderDesc, setKrOrderDesc] = useState('');
  const [surveyorNm, setSurveyorNm] = useState('한국건설기술연구원 조사단');
  const [overallOpinion, setOverallOpinion] = useState('');

  const selectedProject = projects.find((p) => p.projectId === selectedProjectId);

  // Aggregate stats across all tracking surveys
  const allSurveys = projects.flatMap((p) =>
    (p.trackingSurveys || []).map((s) => ({
      ...s,
      projectId: p.projectId,
      projectNm: p.projectNm,
      countryNm: p.countryNm,
    }))
  );

  const totalFollowupWins = allSurveys.reduce((acc, s) => acc + (s.krCompanyOrderAmt || 0), 0);

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    addTrackingSurvey(selectedProject.projectId, {
      surveyYear,
      surveyRound,
      surveyDate: `${surveyYear}-10-15`,
      evalGrade,
      facilityStatus,
      systemUsageRate,
      krCompanyOrderAmt: Number(krOrderAmt),
      krCompanyOrderDesc: krOrderDesc,
      surveyorNm,
      overallOpinion,
    });

    setIsSurveyModalOpen(false);
  };

  const handleExportSurveys = () => {
    const data = allSurveys.map((s) => ({
      사업코드: s.projectId,
      사업명: s.projectNm,
      수원국: s.countryNm,
      조사연도: s.surveyYear,
      조사차수: `${s.surveyRound}차`,
      평가등급: s.evalGrade,
      시설시스템가동률: `${s.systemUsageRate}%`,
      국내기업수주액_원: s.krCompanyOrderAmt,
      후속수주내용: s.krCompanyOrderDesc,
      조사기관: s.surveyorNm,
    }));
    exportToCsv(data, '국토교통_ODA_사후추적조사_누적현황');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>POST-EVALUATION & FOLLOW-UP IMPACT</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">성과 및 사후 추적조사 관리 (F-170 ~ F-176)</h1>
            <p className="text-xs text-slate-500 mt-1">
              사업 종료 후 1~3년간 차수별(1차, 2차, 3차) 누적 추적조사를 통해 <strong>시설·시스템 가동률, 성과 정착도 및 국내 기업 후속 수주 실적</strong>을 관리합니다.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleExportSurveys}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>추적조사 엑셀 다운로드 (F-176)</span>
            </button>
            <button
              onClick={() => setIsSurveyModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>신규 차수 추적조사 등록 (F-173)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 font-semibold block mb-1">총 누적 추적조사 건수</span>
          <div className="text-2xl font-black text-slate-900">
            {allSurveys.length} <span className="text-xs font-normal">회차 누적</span>
          </div>
          <div className="text-[11px] text-blue-700 mt-2 font-medium">
            종료사업 1차~3차 정례 조사
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs">
          <span className="text-purple-900 font-semibold block mb-1">국내 기업 해외 후속 수주 누적</span>
          <div className="text-2xl font-black text-purple-950 font-mono">
            {totalFollowupWins.toLocaleString()} <span className="text-xs font-normal font-sans">원</span>
          </div>
          <div className="text-[11px] text-purple-700 mt-2 font-medium">
            국토교통 ODA 연계 후속 인프라 사업 ({(totalFollowupWins / 100000000).toFixed(0)}억원)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 font-semibold block mb-1">성과 정착 우수(A등급 이상) 비율</span>
          <div className="text-2xl font-black text-emerald-700">
            {allSurveys.length > 0
              ? `${(
                  (allSurveys.filter((s) => s.evalGrade === 'EXCELLENT' || s.evalGrade === 'GOOD').length /
                    allSurveys.length) *
                  100
                ).toFixed(0)}%`
              : '0%'}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            수원국 자체 운영 및 현지 인력 안착
          </div>
        </div>
      </div>

      {/* Project Selector & Cumulative Survey View (F-173) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              추적조사 이력 조회 대상 사업 선택
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="p-2 border border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-900 w-full sm:w-96"
            >
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  [{p.projectId}] {p.projectNm} ({p.trackingSurveys?.length || 0}회차 조사)
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <button
              onClick={() => setActiveProjectDetailId(selectedProject.projectId)}
              className="text-xs font-bold text-blue-600 hover:underline shrink-0"
            >
              사업 상세정보 확인
            </button>
          )}
        </div>

        {/* Multi-Round Cards */}
        {selectedProject && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{selectedProject.projectNm} - 차수별 누적 추적조사 결과 (F-173)</span>
              </h3>
              <span className="text-xs text-slate-500">
                총 {selectedProject.trackingSurveys?.length || 0}회차 진행됨
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedProject.trackingSurveys || []).map((srv) => (
                <div
                  key={srv.surveySeq}
                  className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-blue-300 transition-all text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-extrabold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded-lg text-xs">
                      제 {srv.surveyRound}차 추적조사 ({srv.surveyYear}년)
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        srv.evalGrade === 'EXCELLENT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : srv.evalGrade === 'GOOD'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      평가: {srv.evalGrade}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">조사일자:</span>
                      <strong className="text-slate-800 font-mono">{srv.surveyDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">조사수행기관:</span>
                      <strong className="text-slate-800">{srv.surveyorNm}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">시설·장비 상태:</span>
                      <strong className="text-slate-800">{srv.facilityStatus}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">시스템 가동률:</span>
                      <strong className="text-emerald-700 font-bold">{srv.systemUsageRate}%</strong>
                    </div>
                  </div>

                  {/* Follow-up Win (F-174) */}
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                      국내 기업 후속 수주 실적 (F-174)
                    </span>
                    <div className="text-sm font-black text-purple-950 font-mono">
                      {srv.krCompanyOrderAmt
                        ? `${srv.krCompanyOrderAmt.toLocaleString()}원 (${(srv.krCompanyOrderAmt / 100000000).toFixed(1)}억원)`
                        : '수주 실적 없음'}
                    </div>
                    {srv.krCompanyOrderDesc && (
                      <p className="text-[11px] text-purple-900 line-clamp-2">
                        {srv.krCompanyOrderDesc}
                      </p>
                    )}
                  </div>

                  {srv.overallOpinion && (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                      <strong>종합의견:</strong> {srv.overallOpinion}
                    </div>
                  )}
                </div>
              ))}

              {(!selectedProject.trackingSurveys || selectedProject.trackingSurveys.length === 0) && (
                <div className="col-span-3 p-12 text-center text-slate-400 border border-dashed border-slate-300 rounded-2xl">
                  아직 등록된 사후 추적조사 내역이 없습니다. 상단의 '신규 차수 추적조사 등록'을 통해 1차 조사를 등록하세요.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Survey Modal (F-173) */}
      {isSurveyModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">사후 추적조사 차수 등록 (F-173)</h3>
              <button onClick={() => setIsSurveyModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                닫기
              </button>
            </div>

            <form onSubmit={handleCreateSurvey} className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-400">대상 사업</div>
                <div className="font-bold text-slate-900 text-sm">{selectedProject.projectNm}</div>
                <div className="text-slate-500 font-mono mt-0.5">{selectedProject.projectId}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">조사 연도</label>
                  <input
                    type="number"
                    value={surveyYear}
                    onChange={(e) => setSurveyYear(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">조사 차수</label>
                  <select
                    value={surveyRound}
                    onChange={(e) => setSurveyRound(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={1}>1차 추적조사 (종료 1년 후)</option>
                    <option value={2}>2차 추적조사 (종료 2년 후)</option>
                    <option value={3}>3차 추적조사 (종료 3년 후)</option>
                    <option value={4}>4차 특별점검</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">평가 등급</label>
                  <select
                    value={evalGrade}
                    onChange={(e) => setEvalGrade(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="EXCELLENT">EXCELLENT (매우 우수)</option>
                    <option value="GOOD">GOOD (우수/안정)</option>
                    <option value="FAIR">FAIR (보통/주의)</option>
                    <option value="POOR">POOR (미흡/사후보완)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">시스템/시설 가동률 (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={systemUsageRate}
                    onChange={(e) => setSystemUsageRate(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">시설 및 장비 운영상태</label>
                <input
                  type="text"
                  value={facilityStatus}
                  onChange={(e) => setFacilityStatus(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">
                    국내 기업 후속 수주액 (원) (F-174)
                  </label>
                  <input
                    type="number"
                    step={100000000}
                    value={krOrderAmt}
                    onChange={(e) => setKrOrderAmt(Number(e.target.value))}
                    className="w-full p-2 border border-purple-300 rounded-lg bg-white font-mono font-bold"
                  />
                  <span className="text-[11px] text-purple-700 mt-0.5 block font-mono">
                    {krOrderAmt.toLocaleString()}원 ({(krOrderAmt / 100000000).toFixed(1)} 억원)
                  </span>
                </div>
                <div>
                  <label className="block text-purple-900 font-bold mb-1">후속 수주 상세 내용</label>
                  <input
                    type="text"
                    placeholder="예: ODA 마스터플랜 기반 EDCF 차관 후속 본사업(1,200억원) 한국 컨소시엄 수주"
                    value={krOrderDesc}
                    onChange={(e) => setKrOrderDesc(e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">조사기관 / 조사단장</label>
                <input
                  type="text"
                  value={surveyorNm}
                  onChange={(e) => setSurveyorNm(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">종합 평가 의견</label>
                <textarea
                  rows={2}
                  placeholder="현지 인력 교육 효과, 수원국 정부 만족도 및 사후관리 이슈 기재"
                  value={overallOpinion}
                  onChange={(e) => setOverallOpinion(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSurveyModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  추적조사 저장 (누적)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
