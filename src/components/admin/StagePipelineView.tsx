import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, StageCode } from '../../types';
import {
  GitPullRequest,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Eye,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { CODES } from '../../data/mockData';

export const StagePipelineView: React.FC = () => {
  const { projects, updateProjectStage, setActiveProjectDetailId } = useApp();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [targetStage, setTargetStage] = useState<StageCode>('REVIEW');
  const [stageNote, setStageNote] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group columns
  const columns: { stage: StageCode; label: string; bg: string; border: string; text: string }[] = [
    { stage: 'DISCOVERED', label: '1. 사업 발굴 (N-2)', bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-900' },
    { stage: 'PRELIM', label: '2. 예비검토 (N-1)', bg: 'bg-blue-50/70', border: 'border-blue-200', text: 'text-blue-900' },
    { stage: 'REVIEW', label: '3. 국개위 심의', bg: 'bg-indigo-50/70', border: 'border-indigo-200', text: 'text-indigo-900' },
    { stage: 'CONFIRMED', label: '4. 사업 확정 (N년)', bg: 'bg-teal-50/70', border: 'border-teal-200', text: 'text-teal-900' },
    { stage: 'CONTRACTED', label: '5. 계약 및 착수', bg: 'bg-sky-50/70', border: 'border-sky-200', text: 'text-sky-900' },
    { stage: 'ONGOING', label: '6. 수행 및 관리', bg: 'bg-blue-100/50', border: 'border-blue-300', text: 'text-blue-900' },
    { stage: 'CLOSED', label: '7. 종료·사후관리', bg: 'bg-purple-50/70', border: 'border-purple-200', text: 'text-purple-900' },
  ];

  const handleOpenAdvanceModal = (p: Project) => {
    setSelectedProject(p);
    setTargetStage(p.stageCd);
    setStageNote('');
    setIsModalOpen(true);
  };

  const handleStageChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const stageObj = CODES.stages.find((s) => s.code === targetStage);
    updateProjectStage(
      selectedProject.projectId,
      targetStage,
      stageObj?.name || targetStage,
      stageNote || '단계 변경 처리'
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>LIFECYCLE PIPELINE BOARD</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">단계별 추진현황 파이프라인 (F-110 ~ F-113)</h1>
        <p className="text-xs text-slate-500 mt-1">
          N-2년 신규 발굴부터 예비검토, 국제개발협력위원회(국개위) 심의·선정, 계약, 수행, 종료 및 사후 추적조사까지 칸반 형태로 한눈에 파악하고 단계를 전환합니다.
        </p>
      </div>

      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {columns.map((col) => {
            const colProjects = projects.filter((p) => {
              if (col.stage === 'REVIEW') {
                return p.stageCd === 'REVIEW' || p.stageCd === 'SELECTED' || p.stageCd === 'HELD' || p.stageCd === 'REJECTED';
              }
              if (col.stage === 'CLOSED') {
                return p.stageCd === 'CLOSED' || p.stageCd === 'FOLLOWUP';
              }
              return p.stageCd === col.stage;
            });

            return (
              <div
                key={col.stage}
                className={`flex-1 flex flex-col rounded-2xl border ${col.border} ${col.bg} p-3.5 min-w-[200px] shadow-2xs`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
                  <h3 className={`font-bold text-xs ${col.text}`}>{col.label}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-white/80 rounded-full border border-slate-200 text-slate-700">
                    {colProjects.length}
                  </span>
                </div>

                {/* Cards in this stage */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {colProjects.map((p) => (
                    <div
                      key={p.projectId}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{p.projectId}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded">
                          {p.countryNm}
                        </span>
                      </div>

                      <h4
                        onClick={() => setActiveProjectDetailId(p.projectId)}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug"
                      >
                        {p.projectNm}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>{p.sectorNm}</span>
                        <span className="font-mono font-bold text-slate-800">
                          {(p.budgetAmt / 100000000).toFixed(1)} 억원
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            p.stageCd === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : p.stageCd === 'HELD'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-50 text-blue-800'
                          }`}
                        >
                          {p.stageNm}
                        </span>

                        <button
                          onClick={() => handleOpenAdvanceModal(p)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          단계전환
                        </button>
                      </div>
                    </div>
                  ))}

                  {colProjects.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs italic">
                      해당 단계 과제 없음
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advance Stage Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">사업 추진단계 변경 (F-111, F-112)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                닫기
              </button>
            </div>

            <form onSubmit={handleStageChangeSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-400">대상 사업</div>
                <div className="font-bold text-slate-900 text-sm">{selectedProject.projectNm}</div>
                <div className="text-slate-500 font-mono mt-0.5">
                  {selectedProject.projectId} • 현재: {selectedProject.stageNm}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  변경할 목표 단계 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {CODES.stages.map((s) => (
                    <option key={s.code} value={s.code}>
                      [{s.code}] {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  단계 변경 사유 및 심의결과 기록 (F-112)
                </label>
                <textarea
                  rows={3}
                  placeholder="예: 2025년도 제2차 국개위 분과위 심의 결과 최종 선정 확정 및 예산 배정 완료"
                  value={stageNote}
                  onChange={(e) => setStageNote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  * 탈락/보류의 경우 구체적인 사유를 입력하면 향후 재제안(F-104) 및 이력 추적(F-140)에 활용됩니다.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  변경 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
