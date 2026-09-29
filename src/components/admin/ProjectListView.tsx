import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Upload,
  GitBranch,
  Eye,
  Trash2,
  Lock,
  Unlock,
  ChevronRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { CODES } from '../../data/mockData';
import { ProjectFormModal } from '../modals/ProjectFormModal';

export const ProjectListView: React.FC = () => {
  const {
    projects,
    setActiveProjectDetailId,
    setCompareTargetProjectId,
    exportToCsv,
    showToast,
    currentUser,
  } = useApp();

  const [keyword, setKeyword] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [publicFilter, setPublicFilter] = useState('ALL');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [baseIdForReproposal, setBaseIdForReproposal] = useState<string | undefined>(undefined);

  // Filtered projects
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (stageFilter !== 'ALL' && p.stageCd !== stageFilter) return false;
      if (sectorFilter !== 'ALL' && p.sectorCd !== sectorFilter) return false;
      if (publicFilter !== 'ALL' && p.isPublic !== publicFilter) return false;
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchTitle = p.projectNm.toLowerCase().includes(q);
        const matchCountry = p.countryNm.toLowerCase().includes(q);
        const matchId = p.projectId.toLowerCase().includes(q);
        const matchAgency = p.executingAgencyNm.toLowerCase().includes(q);
        if (!matchTitle && !matchCountry && !matchId && !matchAgency) return false;
      }
      return true;
    });
  }, [projects, stageFilter, sectorFilter, publicFilter, keyword]);

  const handleExport = () => {
    const data = filtered.map((p) => ({
      사업코드: p.projectId,
      사업명: p.projectNm,
      추진단계: p.stageNm,
      수원국: p.countryNm,
      분야: p.sectorNm,
      유형: p.projectTypeNm,
      예산_원: p.budgetAmt,
      시작일: p.startYmd,
      종료일: p.endYmd,
      수행기관: p.executingAgencyNm,
      대국민공개: p.isPublic,
    }));
    exportToCsv(data, 'KIDC_국토교통_ODA_사업목록');
  };

  const handleBatchUploadClick = () => {
    showToast('엑셀 일괄 업로드 서식 검증 완료: 3건의 신규 과제가 시뮬레이션으로 등록되었습니다.', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600">PROJECT DATABASE MANAGEMENT</span>
            <h1 className="text-xl font-bold text-slate-900">사업정보 관리 (F-101 ~ F-106)</h1>
            <p className="text-xs text-slate-500 mt-1">
              국토교통 ODA 전 과제의 등록, 심의 이력 승계(재제안), 계약/집행 데이터 및 대국민 공개 상태를 종합 관리합니다.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleBatchUploadClick}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="서식 엑셀 일괄 등록"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>엑셀 일괄 등록</span>
            </button>

            <button
              onClick={handleExport}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>목록 엑셀 다운로드</span>
            </button>

            <button
              onClick={() => {
                setBaseIdForReproposal(undefined);
                setIsFormModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>신규 사업 등록 (F-101)</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <label className="block text-slate-600 font-semibold mb-1">통합 검색</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="사업명, 코드, 국가, 수행기관..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">추진단계</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 추진단계</option>
              {CODES.stages.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">분야</label>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 분야</option>
              {CODES.sectors.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">대국민 공개 여부</label>
            <select
              value={publicFilter}
              onChange={(e) => setPublicFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 공개상태</option>
              <option value="Y">공개 (Y)</option>
              <option value="N">비공개 (N)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count and Reproposal Tip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 px-1">
        <div>
          총 <strong className="text-blue-700 font-bold">{filtered.length}</strong>건의 사업이 관리되고 있습니다.
        </div>
        <div className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
          <span>F-104/F-105: 재제안 이력이 있는 과제는 회차별 변경내역 대조표를 즉시 열람할 수 있습니다.</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-24">사업코드</th>
                <th className="p-3.5">사업명 / 제안기관</th>
                <th className="p-3.5 w-24">수원국</th>
                <th className="p-3.5 w-24">분야</th>
                <th className="p-3.5 w-28">추진단계</th>
                <th className="p-3.5 w-32 text-right">사업비 (원)</th>
                <th className="p-3.5 w-20 text-center">공개</th>
                <th className="p-3.5 w-32 text-center">연계/대조표</th>
                <th className="p-3.5 w-24 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const isReproposed = (p.relations || []).some((r) => r.relationTypeCd === 'REPROPOSAL');
                const isUnselected = p.stageCd === 'REJECTED' || p.stageCd === 'HELD';

                return (
                  <tr key={p.projectId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-700">{p.projectId}</td>
                    <td className="p-3.5">
                      <div
                        onClick={() => setActiveProjectDetailId(p.projectId)}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                      >
                        {p.projectNm}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-2">
                        <span>제안: {p.proposingAgencyNm || '-'}</span>
                        <span>•</span>
                        <span>수행: {p.executingAgencyNm}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">{p.countryNm}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                        {p.sectorNm}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded text-[11px]">
                        {p.stageNm}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900" title={`${(p.budgetAmt / 100000000).toFixed(1)}억원`}>
                      <div>{p.budgetAmt.toLocaleString()}원</div>
                      <div className="text-[10px] text-slate-400 font-normal font-sans">{(p.budgetAmt / 100000000).toFixed(1)} 억원</div>
                    </td>
                    <td className="p-3.5 text-center">
                      {p.isPublic === 'Y' ? (
                        <span className="inline-flex items-center text-emerald-600 text-[10px] font-bold">
                          <Unlock className="w-3 h-3 mr-0.5" /> 공개
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-400 text-[10px] font-semibold">
                          <Lock className="w-3 h-3 mr-0.5" /> 비공개
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      {isReproposed ? (
                        <button
                          onClick={() => setCompareTargetProjectId(p.projectId)}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold flex items-center space-x-1 mx-auto cursor-pointer"
                        >
                          <GitBranch className="w-3 h-3 text-indigo-600" />
                          <span>회차대조표 (F-105)</span>
                        </button>
                      ) : isUnselected ? (
                        <button
                          onClick={() => {
                            setBaseIdForReproposal(p.projectId);
                            setIsFormModalOpen(true);
                          }}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-bold flex items-center space-x-1 mx-auto cursor-pointer"
                          title="탈락 사유 보완 후 재제안 사업으로 연결 등록"
                        >
                          <Plus className="w-3 h-3" />
                          <span>재제안 등록 (F-104)</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setActiveProjectDetailId(p.projectId)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center space-x-1 mx-auto cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>상세/수정</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        baseProjectIdForReproposal={baseIdForReproposal}
      />
    </div>
  );
};
