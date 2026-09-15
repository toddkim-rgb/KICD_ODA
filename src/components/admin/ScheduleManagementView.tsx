import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Schedule } from '../../types';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit2,
  Filter,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const ScheduleManagementView: React.FC = () => {
  const { projects, updateSchedule, setActiveProjectDetailId } = useApp();

  const [filterDelayed, setFilterDelayed] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [editingSchedule, setEditingSchedule] = useState<{
    projectId: string;
    projectNm: string;
    schedule: Schedule;
  } | null>(null);

  const [formPlanYmd, setFormPlanYmd] = useState('');
  const [formActualYmd, setFormActualYmd] = useState('');
  const [formDelayYn, setFormDelayYn] = useState<'Y' | 'N'>('N');
  const [formDelayReason, setFormDelayReason] = useState('');
  const [formActionPlan, setFormActionPlan] = useState('');

  // Collect all schedules across projects
  const allSchedules = projects.flatMap((p) =>
    (p.schedules || []).map((s) => ({
      projectId: p.projectId,
      projectNm: p.projectNm,
      countryNm: p.countryNm,
      sectorNm: p.sectorNm,
      schedule: s,
    }))
  );

  const filtered = allSchedules.filter((item) => {
    if (filterDelayed && item.schedule.delayYn !== 'Y') return false;
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      const matchProj = item.projectNm.toLowerCase().includes(q);
      const matchSch = item.schedule.scheduleNm.toLowerCase().includes(q);
      const matchCountry = item.countryNm.toLowerCase().includes(q);
      if (!matchProj && !matchSch && !matchCountry) return false;
    }
    return true;
  });

  const delayedCount = allSchedules.filter((s) => s.schedule.delayYn === 'Y').length;

  const handleOpenEdit = (item: typeof allSchedules[0]) => {
    setEditingSchedule({
      projectId: item.projectId,
      projectNm: item.projectNm,
      schedule: item.schedule,
    });
    setFormPlanYmd(item.schedule.planYmd);
    setFormActualYmd(item.schedule.actualYmd || '');
    setFormDelayYn(item.schedule.delayYn);
    setFormDelayReason(item.schedule.delayReason || '');
    setFormActionPlan(item.schedule.actionPlan || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;

    updateSchedule(editingSchedule.projectId, editingSchedule.schedule.scheduleSeq, {
      planYmd: formPlanYmd,
      actualYmd: formActualYmd || undefined,
      delayYn: formDelayYn,
      delayReason: formDelayReason,
      actionPlan: formActionPlan,
      statusCd: formActualYmd ? 'COMPLETED' : formDelayYn === 'Y' ? 'DELAYED' : 'IN_PROGRESS',
    });

    setEditingSchedule(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>PROJECT MILESTONES & MONITORING</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">일정 및 마일스톤 관리 (F-120 ~ F-123)</h1>
            <p className="text-xs text-slate-500 mt-1">
              착수보고, 현지조사, 중간보고, 중간점검, 최종보고 등 핵심 마일스톤의 계획 대비 실적과 지연 사유 및 만회 대책을 관리합니다.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterDelayed(!filterDelayed)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border ${
                filterDelayed
                  ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                  : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>지연 공정만 보기 ({delayedCount}건)</span>
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <input
            type="text"
            placeholder="사업명, 공정명, 국가명 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full sm:w-80 p-2 text-xs border border-slate-300 rounded-lg bg-white"
          />
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-24">사업코드</th>
                <th className="p-3.5">연계 사업명</th>
                <th className="p-3.5 w-32">마일스톤 공정</th>
                <th className="p-3.5 w-28">계획일자</th>
                <th className="p-3.5 w-28">실제일자</th>
                <th className="p-3.5 w-24 text-center">지연 여부</th>
                <th className="p-3.5">지연사유 및 만회 대책 (F-122)</th>
                <th className="p-3.5 w-20 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const s = item.schedule;
                const isDelayed = s.delayYn === 'Y';

                return (
                  <tr
                    key={`${item.projectId}-${s.scheduleSeq}`}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isDelayed ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-slate-600">{item.projectId}</td>
                    <td className="p-3.5">
                      <div
                        onClick={() => setActiveProjectDetailId(item.projectId)}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                      >
                        {item.projectNm}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.countryNm} • {item.sectorNm}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">{s.scheduleNm}</td>
                    <td className="p-3.5 font-mono text-slate-700">{s.planYmd}</td>
                    <td className="p-3.5 font-mono">
                      {s.actualYmd ? (
                        <span className="text-emerald-700 font-bold">{s.actualYmd}</span>
                      ) : (
                        <span className="text-slate-400">미완료</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      {isDelayed ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3 mr-0.5" /> 지연
                        </span>
                      ) : s.actualYmd ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> 완료
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          <Clock className="w-3 h-3 mr-0.5" /> 진행중
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {s.delayReason ? (
                        <div className="space-y-1">
                          <div className="text-rose-900 font-medium line-clamp-1">
                            <strong>사유:</strong> {s.delayReason}
                          </div>
                          {s.actionPlan && (
                            <div className="text-blue-800 text-[11px] line-clamp-1">
                              <strong>만회:</strong> {s.actionPlan}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                        title="공정 일정 수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    일치하는 공정 마일스톤이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">마일스톤 일정 및 지연 대책 입력 (F-122)</h3>
              <button
                onClick={() => setEditingSchedule(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                닫기
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-400">대상 사업 및 공정</div>
                <div className="font-bold text-slate-900 text-sm">{editingSchedule.projectNm}</div>
                <div className="text-blue-700 font-bold mt-0.5">
                  마일스톤: {editingSchedule.schedule.scheduleNm}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">계획 일자</label>
                  <input
                    type="date"
                    value={formPlanYmd}
                    onChange={(e) => setFormPlanYmd(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">실제 완료 일자</label>
                  <input
                    type="date"
                    value={formActualYmd}
                    onChange={(e) => setFormActualYmd(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">지연 여부 (F-121)</label>
                <select
                  value={formDelayYn}
                  onChange={(e) => setFormDelayYn(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold"
                >
                  <option value="N">정상 (N)</option>
                  <option value="Y">지연 발생 (Y)</option>
                </select>
              </div>

              {formDelayYn === 'Y' && (
                <div className="space-y-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <div>
                    <label className="block text-rose-900 font-bold mb-1">
                      지연 사유 (F-122) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="예: 수원국 협력부처(MoC) 승인 절차 2개월 지연"
                      value={formDelayReason}
                      onChange={(e) => setFormDelayReason(e.target.value)}
                      className="w-full p-2 border border-rose-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-rose-900 font-bold mb-1">
                      만회 대책 (F-122) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="예: 현지 조사단 복수 투입 및 중간보고서 작성 병행 추진"
                      value={formActionPlan}
                      onChange={(e) => setFormActionPlan(e.target.value)}
                      className="w-full p-2 border border-rose-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="px-3.5 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  일정 저장 (변경이력 기록)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
