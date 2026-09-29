import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  TrendingUp,
  History,
  GitBranch,
  Download,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Globe,
  PlusCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { CODES } from '../../data/mockData';
import { TrackingSurvey } from '../../types';

export const ProjectDetailModal: React.FC = () => {
  const {
    activeProjectDetailId,
    setActiveProjectDetailId,
    projects,
    updateProject,
    toggleDocumentPublic,
    addTrackingSurvey,
    addDocument,
    setCompareReproposalData,
    currentUser,
    exportToCsv,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'basic' | 'stages' | 'schedules' | 'budgets' | 'documents' | 'performance' | 'relations'
  >('basic');

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // New tracking survey state
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [newSurveyRound, setNewSurveyRound] = useState(1);
  const [newSurveyOrg, setNewSurveyOrg] = useState('');
  const [newSurveySustain, setNewSurveySustain] = useState<'Y' | 'N'>('Y');
  const [newSurveyUsage, setNewSurveyUsage] = useState('');
  const [newSurveyFollowup, setNewSurveyFollowup] = useState<'Y' | 'N'>('N');
  const [newSurveyKrCompany, setNewSurveyKrCompany] = useState<'Y' | 'N'>('N');
  const [newSurveyKrAmount, setNewSurveyKrAmount] = useState<number>(0);
  const [newSurveyKrDesc, setNewSurveyKrDesc] = useState('');

  if (!activeProjectDetailId) return null;
  const project = projects.find((p) => p.projectId === activeProjectDetailId);
  if (!project) return null;

  const startEdit = () => {
    setEditForm({
      projectNm: project.projectNm,
      budgetAmt: project.budgetAmt,
      stageCd: project.stageCd,
      startYmd: project.startYmd,
      endYmd: project.endYmd,
      overview: project.overview || '',
      expectedEffect: project.expectedEffect || '',
      isPublic: project.isPublic,
      executingAgencyNm: project.executingAgencyNm,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const isR02 = currentUser.role === 'R-02';
    // If budget changed or stage changed and R-02, optionally send as approval
    updateProject(project.projectId, editForm, '담당자 수정 반영', isR02 && editForm.budgetAmt !== project.budgetAmt);
    setIsEditing(false);
  };

  const handleCreateTrackingSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const survey: Omit<TrackingSurvey, 'surveyId'> = {
      projectId: project.projectId,
      surveyTypeCd: 'TRACKING',
      surveyTypeNm: `${newSurveyRound}차 사후 추적조사`,
      roundNo: Number(newSurveyRound),
      baseYmd: new Date().toISOString().slice(0, 10),
      surveyOrgNm: newSurveyOrg || 'KIDC 자체 사후평가팀',
      sustainYn: newSurveySustain,
      outputUsageDesc: newSurveyUsage || '산출물이 수원국 정책 및 후속 인프라에 정상 적용 중',
      followupNeedYn: newSurveyFollowup,
      krCompanyOrderYn: newSurveyKrCompany,
      krCompanyOrderAmt: newSurveyKrCompany === 'Y' ? Number(newSurveyKrAmount) : 0,
      krCompanyOrderDesc: newSurveyKrDesc,
      indicatorResults: (project.indicators || []).map((ind) => ({
        indicatorId: ind.indicatorId,
        indicatorNm: ind.indicatorNm,
        targetVal: ind.targetVal,
        actualVal: ind.actualVal,
        unit: ind.unit,
        achieved: ind.achievedYn,
      })),
    };

    addTrackingSurvey(project.projectId, survey);
    setShowSurveyModal(false);
    // Reset
    setNewSurveyOrg('');
    setNewSurveyUsage('');
    setNewSurveyKrDesc('');
  };

  // Find if this project has a reproposal relation
  const reproposalRel = project.relations?.find((r) => r.relationType === 'REPROPOSAL');
  const baseProject = reproposalRel ? projects.find((p) => p.projectId === reproposalRel.baseProjectId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs px-2.5 py-1 bg-blue-500/20 text-blue-300 font-bold rounded-md border border-blue-400/30">
              {project.projectId}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
              project.isPublic === 'Y' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {project.isPublic === 'Y' ? '대국민 공개' : '내부 관리전용'}
            </span>
            <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md font-medium">
              {project.stageNm}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {reproposalRel && baseProject && (
              <button
                onClick={() => setCompareReproposalData({ base: baseProject, target: project })}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors"
                title="미선정 원사업과 보완 재제안 내용 대조"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>재제안 회차비교</span>
              </button>
            )}
            <button
              onClick={() => {
                exportToCsv([project], `ODA_${project.projectId}`);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>엑셀 추출</span>
            </button>
            <button
              onClick={() => setActiveProjectDetailId(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Project Title Banner */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-1 flex items-center space-x-2">
                <span>{project.regionNm} &gt; {project.countryNm}</span>
                <span>•</span>
                <span>{project.sectorNm} 분야</span>
                <span>•</span>
                <span>{project.projectTypeNm}</span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                {project.projectNm}
              </h1>
            </div>
            {currentUser.role !== 'R-01' && currentUser.role !== 'R-05' && !isEditing && (
              <button
                onClick={startEdit}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>정보 수정</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto w-[1027.17px] max-w-full h-[60px]">
          {[
            { key: 'basic', label: '기본 정보', icon: Building2 },
            { key: 'stages', label: '추진 단계', icon: History, count: project.stages?.length },
            { key: 'schedules', label: '일정 관리', icon: Calendar, count: project.schedules?.length },
            { key: 'budgets', label: '예산 및 집행', icon: DollarSign },
            { key: 'documents', label: '문서 및 산출물', icon: FileText, count: project.documents?.length },
            { key: 'performance', label: '성과 및 추적조사', icon: TrendingUp, count: project.trackingSurveys?.length },
            { key: 'relations', label: '재제안/연계사업', icon: GitBranch, count: project.relations?.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
                  active
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
          {/* 1. BASIC INFO TAB */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {isEditing ? (
                <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-800">사업 정보 수정 양식</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                      >
                        저장 (승인 요청)
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">사업명</label>
                      <input
                        type="text"
                        value={editForm.projectNm}
                        onChange={(e) => setEditForm({ ...editForm, projectNm: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">총 사업비 (KRW)</label>
                      <input
                        type="number"
                        value={editForm.budgetAmt}
                        onChange={(e) => setEditForm({ ...editForm, budgetAmt: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 font-medium font-mono"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block font-mono">
                        {(editForm.budgetAmt || 0).toLocaleString()}원 ({((editForm.budgetAmt || 0) / 100000000).toFixed(1)} 억원)
                      </span>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">추진단계</label>
                      <select
                        value={editForm.stageCd}
                        onChange={(e) => setEditForm({ ...editForm, stageCd: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500"
                      >
                        {CODES.stages.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">수행기관 (시행기관)</label>
                      <input
                        type="text"
                        value={editForm.executingAgencyNm}
                        onChange={(e) => setEditForm({ ...editForm, executingAgencyNm: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">사업 기간 (시작 ~ 종료)</label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          value={editForm.startYmd}
                          onChange={(e) => setEditForm({ ...editForm, startYmd: e.target.value })}
                          className="w-1/2 p-2 border border-slate-300 rounded-md"
                        />
                        <input
                          type="date"
                          value={editForm.endYmd}
                          onChange={(e) => setEditForm({ ...editForm, endYmd: e.target.value })}
                          className="w-1/2 p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">대국민 홈페이지 공개 여부</label>
                      <select
                        value={editForm.isPublic}
                        onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md"
                      >
                        <option value="Y">공개 (Y)</option>
                        <option value="N">비공개 (N)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">사업 개요 및 추진배경</label>
                      <textarea
                        rows={3}
                        value={editForm.overview}
                        onChange={(e) => setEditForm({ ...editForm, overview: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Metric Summary Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">총 사업비</div>
                      <div className="text-base md:text-lg font-bold text-blue-900 mt-0.5">
                        {project.budgetAmt.toLocaleString()}원
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">사업 기간</div>
                      <div className="text-xs font-bold text-slate-800 mt-1">
                        {project.startYmd} ~ {project.endYmd}
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">수원국 주무부처</div>
                      <div className="text-xs font-bold text-slate-800 mt-1 truncate" title={project.proposingAgencyNm}>
                        {project.proposingAgencyNm}
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">수행기관(시행기관)</div>
                      <div className="text-xs font-bold text-slate-800 mt-1 truncate" title={project.executingAgencyNm}>
                        {project.executingAgencyNm}
                      </div>
                    </div>
                  </div>

                  {/* Two Column Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-200">
                        기본 식별 정보
                      </h3>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">사업 식별코드</span>
                        <span className="font-mono font-bold text-slate-800">{project.projectId}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">수원국 / 권역</span>
                        <span className="font-medium text-slate-800">{project.countryNm} ({project.regionNm})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">국토교통 ODA 분야</span>
                        <span className="font-medium text-slate-800">{project.sectorNm}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">사업 유형</span>
                        <span className="font-medium text-slate-800">{project.projectTypeNm}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">발주 기관</span>
                        <span className="font-medium text-slate-800">{project.orderingAgencyNm}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">대국민 홈페이지 공개</span>
                        <span className="font-bold text-blue-700">{project.isPublic === 'Y' ? '공개' : '비공개'}</span>
                      </div>
                    </div>

                    {/* Right Column: Managers & State */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-200">
                        담당 및 관리 체계
                      </h3>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">주담당자</span>
                        <span className="font-bold text-slate-800">{project.mainManagerNm} (KIDC ODA개발실)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">부담당자</span>
                        <span className="font-medium text-slate-800">{project.subManagerNm}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">추진 상태</span>
                        <span className="font-semibold text-emerald-700">{project.statusNm}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">결재 상태</span>
                        <span className="font-medium text-slate-800">{project.apprStatusCd}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">최근 업데이트</span>
                        <span className="font-mono text-slate-600">2025-08-25</span>
                      </div>
                    </div>
                  </div>

                  {/* Overview & Effect */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      사업 개요 및 추진 배경
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {project.overview || '등록된 상세 개요가 없습니다.'}
                    </p>

                    {project.expectedEffect && (
                      <div className="pt-3 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-blue-900 mb-1">주요 기대효과 및 파급성과</h4>
                        <p className="text-xs text-slate-700 leading-relaxed">{project.expectedEffect}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* 2. STAGES TAB */}
          {activeTab === 'stages' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2">사업 전 주기 단계별 추진현황 이력</h3>
                <p className="text-xs text-slate-500 mb-4">
                  사업 발굴(N-2)부터 예비사업, 국제개발협력위원회 심의·의결, 사업 확정 및 계약체결까지의 전체 의사결정 이력을 추적합니다.
                </p>

                <div className="relative pl-6 border-l-2 border-blue-500 space-y-6">
                  {(project.stages || []).map((stg, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{stg.stageNm}</span>
                          <span className="text-xs font-mono text-slate-500">{stg.decisionYmd}</span>
                        </div>
                        <div className="text-xs font-semibold text-blue-700 mt-1">{stg.statusNm}</div>
                        <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded border border-slate-200">
                          <strong>결정 사유:</strong> {stg.decisionReason}
                        </p>
                        <div className="text-[11px] text-slate-400 mt-2 text-right">
                          처리자: {stg.processedBy} ({stg.processedAt})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. SCHEDULES TAB */}
          {activeTab === 'schedules' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">주요 공정 및 마일스톤 일정</h3>
                    <p className="text-xs text-slate-500">예정일, 완료일, 지연 여부 및 향후 조치사항을 관리합니다.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(project.schedules || []).map((sch) => (
                    <div
                      key={sch.scheduleSeq}
                      className={`p-4 rounded-xl border transition-all ${
                        sch.delayYn === 'Y' ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-900">{sch.scheduleNm}</span>
                            {sch.delayYn === 'Y' ? (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-bold rounded flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> 지연 관리 대상
                              </span>
                            ) : sch.completeYmd ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> 완료
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-semibold rounded">
                                진행 예정
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 mt-1.5 flex items-center space-x-4">
                            <span>계획일: <strong className="text-slate-800">{sch.planYmd}</strong></span>
                            {sch.completeYmd && (
                              <span>실제완료: <strong className="text-emerald-700">{sch.completeYmd}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      {sch.delayReason && (
                        <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs space-y-1">
                          <div className="text-rose-700">
                            <strong>지연 사유:</strong> {sch.delayReason}
                          </div>
                          {sch.actionPlan && (
                            <div className="text-blue-800">
                              <strong>향후 조치계획:</strong> {sch.actionPlan}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. BUDGETS TAB (F-130, F-131) */}
          {activeTab === 'budgets' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">연도별 예산·계약·집행 현황</h3>
                    <p className="text-xs text-slate-500">
                      낙찰차액(예산액-계약액) 및 집행잔액(계약액-집행액)이 자동 산출됩니다.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">회계연도</th>
                        <th className="p-3 text-right">예산액 (A)</th>
                        <th className="p-3 text-right">계약액 (B)</th>
                        <th className="p-3 text-right text-indigo-700">낙찰차액 (A-B)</th>
                        <th className="p-3 text-right">집행액 (C)</th>
                        <th className="p-3 text-right text-emerald-700">집행잔액 (B-C)</th>
                        <th className="p-3 text-center">집행률 (C/B)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(project.budgets || []).map((b) => {
                        const bidSaving = b.budgetAmt - (b.contractAmt || 0);
                        const remain = (b.contractAmt || 0) - b.executedAmt;
                        const rate = b.contractAmt ? ((b.executedAmt / b.contractAmt) * 100).toFixed(1) : '0';
                        return (
                          <React.Fragment key={b.budgetSeq}>
                            <tr className="hover:bg-slate-50 font-medium">
                              <td className="p-3 font-bold text-slate-800">{b.fiscalYear}년도</td>
                              <td className="p-3 text-right font-mono">{b.budgetAmt.toLocaleString()}원</td>
                              <td className="p-3 text-right font-mono text-slate-700">
                                {b.contractAmt ? `${b.contractAmt.toLocaleString()}원` : '-'}
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-indigo-700">
                                {bidSaving > 0 ? `${bidSaving.toLocaleString()}원` : '-'}
                              </td>
                              <td className="p-3 text-right font-mono">{b.executedAmt.toLocaleString()}원</td>
                              <td className="p-3 text-right font-mono font-bold text-emerald-700">
                                {remain.toLocaleString()}원
                              </td>
                              <td className="p-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded font-bold ${
                                    Number(rate) >= 80
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {rate}%
                                </span>
                              </td>
                            </tr>
                            {b.savingUsePlan && (
                              <tr className="bg-indigo-50/40 text-[11px] text-indigo-900 border-b border-indigo-100">
                                <td colSpan={7} className="p-2.5 px-4">
                                  <strong>낙찰차액 활용계획:</strong> {b.savingUsePlan}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. DOCUMENTS TAB (F-136) */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">사업 관련 문서 및 산출물 관리</h3>
                    <p className="text-xs text-slate-500">
                      계획서, 계약서, 보고서 등을 관리하며, 대국민 홈페이지 공개 여부를 토글할 수 있습니다.
                    </p>
                  </div>
                  {currentUser.role !== 'R-01' && (
                    <button
                      onClick={() => {
                        const name = prompt('새로 등록할 산출물 파일명을 입력하세요:', '2025_사업_최종보고서_공개본.pdf');
                        if (name) {
                          addDocument(project.projectId, { fileNm: name, isPublic: 'Y' });
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>산출물 업로드</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                  {(project.documents || []).map((doc) => (
                    <div key={doc.docId} className="p-3.5 flex items-center justify-between hover:bg-slate-50 bg-white">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-800">{doc.fileNm}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {doc.docTypeNm}
                            </span>
                            <span className="text-[10px] text-slate-400">{doc.fileSize}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            등록일: {doc.createdAt} • 등록자: {doc.createdBy}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleDocumentPublic(doc.docId)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 border transition-colors ${
                            doc.isPublic === 'Y'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                          }`}
                          title="대국민 홈페이지 공개 전환"
                        >
                          {doc.isPublic === 'Y' ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>홈페이지 공개</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>내부전용</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => showToast(`[${doc.fileNm}] 다운로드가 시작되었습니다.`, 'info')}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="다운로드"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!project.documents || project.documents.length === 0) && (
                    <div className="p-6 text-center text-xs text-slate-400">등록된 산출물 문서가 없습니다.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. PERFORMANCE & TRACKING SURVEY (F-173, 차수별 누적 관리) */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* PDM Indicators */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">PDM 성과지표 달성 현황</h3>
                  <span className="text-xs text-slate-500">목표값 대비 실제 달성 측정치</span>
                </div>
                <div className="space-y-2.5">
                  {(project.indicators || []).map((ind) => {
                    const pct = ind.targetVal > 0 ? Math.min(100, Math.round((ind.actualVal / ind.targetVal) * 100)) : 100;
                    return (
                      <div key={ind.indicatorId} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-slate-800">{ind.indicatorNm}</span>
                          <span className="font-bold text-blue-700">
                            실적: {ind.actualVal} {ind.unit} / 목표: {ind.targetVal} {ind.unit} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* F-173: Tracking Survey (사후 추적조사 차수 누적) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        종료사업 사후 추적조사 누적 관리
                      </h3>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                        시계열 누적
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      조사기준일 및 차수(Round)별로 성과 유지여부, 핵심 산출물 활용현황, 국내기업 수주성과를 누적 기록합니다.
                    </p>
                  </div>
                  {currentUser.role !== 'R-01' && (
                    <button
                      onClick={() => setShowSurveyModal(true)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>추적조사 결과 등록</span>
                    </button>
                  )}
                </div>

                {/* Survey round cards */}
                <div className="space-y-4">
                  {(project.trackingSurveys || []).map((sv) => (
                    <div key={sv.surveyId} className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-purple-100 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 bg-purple-600 text-white text-xs font-bold rounded">
                            {sv.roundNo}차 추적조사
                          </span>
                          <span className="font-bold text-sm text-slate-800">{sv.surveyTypeNm}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-600">
                          조사기준일: <strong>{sv.baseYmd}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-purple-100">
                          <span className="text-slate-500 block mb-1">성과 지속·유지 여부</span>
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> 정상 가동 및 지속 유지 (Y)
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-purple-100">
                          <span className="text-slate-500 block mb-1">후속·연계사업 추진 필요성</span>
                          <span className="font-bold text-slate-800">
                            {sv.followupNeedYn === 'Y' ? '후속 차관(EDCF) 연계 추진 필요' : '수원국 자체 운영 전환'}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-purple-100">
                          <span className="text-slate-500 block mb-1">국내 기업 연계 수주 실적</span>
                          <span className="font-bold text-indigo-700">
                            {sv.krCompanyOrderYn === 'Y'
                              ? `${(sv.krCompanyOrderAmt || 0).toLocaleString()}원 달성`
                              : '없음'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-purple-100 text-xs">
                        <strong className="text-purple-900 block mb-1">핵심 산출물 활용 현황:</strong>
                        <p className="text-slate-700 leading-relaxed">{sv.outputUsageDesc}</p>
                      </div>

                      {sv.krCompanyOrderDesc && (
                        <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs">
                          <strong className="text-indigo-900 block mb-1">국내 기업 해외 진출 파급성과:</strong>
                          <p className="text-indigo-800 leading-relaxed">{sv.krCompanyOrderDesc}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {(!project.trackingSurveys || project.trackingSurveys.length === 0) && (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                      아직 등록된 사후 추적조사 이력이 없습니다. 종료 사업에 대해 차수별 조사를 등록할 수 있습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 7. RELATIONS TAB (F-104, F-106) */}
          {activeTab === 'relations' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2">사업 간 연계 및 재제안 이력</h3>
                <p className="text-xs text-slate-500 mb-4">
                  미선정 탈락 사업의 재제안(REPROPOSAL) 또는 종료 사업의 후속 연계사업(FOLLOWUP) 관계를 추적합니다.
                </p>

                {project.relations && project.relations.length > 0 ? (
                  <div className="space-y-3">
                    {project.relations.map((rel) => (
                      <div key={rel.relationSeq} className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded">
                              {rel.relationType === 'REPROPOSAL' ? '재제안 연계' : '후속사업 연계'}
                            </span>
                            <span className="font-mono text-xs font-bold text-indigo-900">
                              원사업 코드: {rel.baseProjectId}
                            </span>
                          </div>
                          {baseProject && (
                            <button
                              onClick={() => setCompareReproposalData({ base: baseProject, target: project })}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
                            >
                              <span>회차별 변경내용 비교</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 mt-2 bg-white p-2.5 rounded border border-indigo-100">
                          {rel.changeSummary}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-xs text-slate-400 bg-slate-50 rounded-xl">
                    등록된 연계/재제안 사업 정보가 없습니다.
                  </div>
                )}
              </div>

              {/* 미선정 원사업 보존 상태 안내 카드 */}
              {project.isPreserved && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>미선정 원사업 영구 보존본 (Archived)</span>
                    </span>
                    <span className="text-[11px] text-rose-700 font-mono">
                      보존일시: {project.preservedAt || '2023-11-20'}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    본 과제는 국개위 심의 미선정(탈락) 이력 보존 원칙에 따라 수정이 제한되는 영구 보존본입니다. 변경 사항은 보완 재제안 과제를 생성하여 관리합니다.
                  </p>
                </div>
              )}

              {/* 회차별 심의 및 재심의 결과 누적 */}
              {project.deliberations && project.deliberations.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <h3 className="text-sm font-bold text-slate-900">
                    회차별 재심의 결과 누적 이력
                  </h3>
                  <div className="space-y-2">
                    {project.deliberations.map((d) => (
                      <div
                        key={d.delibSeq}
                        className={`p-3 rounded-xl border ${
                          d.resultCd === 'SELECTED'
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.resultCd === 'SELECTED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            제 {d.roundNo}차 심의: {d.resultNm}
                          </span>
                          <span className="font-mono text-slate-500 text-[10px]">
                            {d.delibYmd} | {d.committeeNm}
                          </span>
                        </div>
                        <p className="text-slate-700 text-[11px] mt-1 leading-relaxed whitespace-pre-line">
                          <strong>심사의견:</strong> {d.mainReasons}
                        </p>
                        {d.countermeasurePlan && (
                          <div className="mt-1.5 p-2 bg-white rounded border border-slate-200 text-[10px] text-slate-600">
                            <strong>보완조치계획:</strong> {d.countermeasurePlan}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            고유식별체계: <strong className="font-mono text-slate-800">{project.projectId}</strong> • 관리자: {project.mainManagerNm}
          </div>
          <button
            onClick={() => setActiveProjectDetailId(null)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Sub-modal: New Tracking Survey Registration */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">사후 추적조사 결과 등록</h3>
              <button onClick={() => setShowSurveyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTrackingSurvey} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">조사 차수</label>
                  <select
                    value={newSurveyRound}
                    onChange={(e) => setNewSurveyRound(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value={1}>1차 추적조사 (종료 1년 후)</option>
                    <option value={2}>2차 추적조사 (종료 2년 후)</option>
                    <option value={3}>3차 추적조사 (종료 3년 후)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">조사 기관명</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 한국평가원 ODA조사팀"
                    value={newSurveyOrg}
                    onChange={(e) => setNewSurveyOrg(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">성과 지속 및 산출물 활용 현황</label>
                <textarea
                  required
                  rows={2}
                  placeholder="시스템 가동률, 현지 지자체 조례 반영 현황 등 입력"
                  value={newSurveyUsage}
                  onChange={(e) => setNewSurveyUsage(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">후속사업 필요 여부</label>
                  <select
                    value={newSurveyFollowup}
                    onChange={(e) => setNewSurveyFollowup(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="Y">필요 (EDCF 차관 또는 2단계 추진)</option>
                    <option value="N">불필요 (수원국 자체 운영)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">국내 기업 후속 수주 여부</label>
                  <select
                    value={newSurveyKrCompany}
                    onChange={(e) => setNewSurveyKrCompany(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="Y">수주 성공 (Y)</option>
                    <option value="N">해당 없음 (N)</option>
                  </select>
                </div>
              </div>

              {newSurveyKrCompany === 'Y' && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded space-y-2">
                  <div>
                    <label className="block text-indigo-900 font-semibold mb-1">국내 기업 수주 금액 (KRW)</label>
                    <input
                      type="number"
                      placeholder="예: 2500000000"
                      value={newSurveyKrAmount}
                      onChange={(e) => setNewSurveyKrAmount(Number(e.target.value))}
                      className="w-full p-2 border border-indigo-200 rounded bg-white font-mono"
                    />
                    <span className="text-[11px] text-indigo-700 mt-1 block font-mono">
                      {(newSurveyKrAmount || 0).toLocaleString()}원 ({((newSurveyKrAmount || 0) / 100000000).toFixed(1)} 억원)
                    </span>
                  </div>
                  <div>
                    <label className="block text-indigo-900 font-semibold mb-1">수주 상세 내용</label>
                    <input
                      type="text"
                      placeholder="예: 국내 SI업체 B사 몽골 현지 지자체 시스템 유지보수 수주"
                      value={newSurveyKrDesc}
                      onChange={(e) => setNewSurveyKrDesc(e.target.value)}
                      className="w-full p-2 border border-indigo-200 rounded bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSurveyModal(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded"
                >
                  취소
                </button>
                <button type="submit" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
