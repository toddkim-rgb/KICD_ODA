import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Download, LayoutGrid, List, ChevronRight, Globe, Building2, Calendar, FileSpreadsheet } from 'lucide-react';
import { CODES } from '../../data/mockData';

export const PortalProjectDB: React.FC = () => {
  const { projects, setActiveProjectDetailId, exportToCsv } = useApp();

  const [keyword, setKeyword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'newest' | 'budgetDesc'>('newest');
  const [isErrataModalOpen, setIsErrataModalOpen] = useState(false);

  // All published errata notices
  const allErrata = useMemo(() => {
    return projects.flatMap((p) => p.errataList || []);
  }, [projects]);

  // Filter public projects only
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => p.isPublic === 'Y')
      .filter((p) => {
        if (selectedRegion !== 'ALL' && p.regionCd !== selectedRegion) return false;
        if (selectedSector !== 'ALL' && p.sectorCd !== selectedSector) return false;
        if (selectedType !== 'ALL' && p.projectTypeCd !== selectedType) return false;
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchTitle = p.projectNm.toLowerCase().includes(q);
          const matchCountry = p.countryNm.toLowerCase().includes(q);
          const matchAgency = p.executingAgencyNm.toLowerCase().includes(q);
          const matchId = p.projectId.toLowerCase().includes(q);
          if (!matchTitle && !matchCountry && !matchAgency && !matchId) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'budgetDesc') return b.budgetAmt - a.budgetAmt;
        return b.startYmd.localeCompare(a.startYmd);
      });
  }, [projects, selectedRegion, selectedSector, selectedType, keyword, sortBy]);

  const handleExport = () => {
    const exportRows = filteredProjects.map((p) => ({
      사업코드: p.projectId,
      사업명: p.projectNm,
      수원국: p.countryNm,
      권역: p.regionNm,
      분야: p.sectorNm,
      사업유형: p.projectTypeNm,
      수행기관: p.executingAgencyNm,
      사업비_원: p.budgetAmt,
      시작일: p.startYmd,
      종료일: p.endYmd,
      추진단계: p.stageNm,
    }));
    exportToCsv(exportRows, '국토교통_ODA_사업DB_공개목록');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>KIDC ODA PROJECT DATABASE</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">국토교통 ODA 사업DB</h1>
            <p className="text-xs text-slate-500 mt-1">
              국가별, 권역별, 분야별, 사업유형별로 공개된 국토교통 ODA 사업 추진현황을 검색하고 상세 정보를 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsErrataModalOpen(true)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>정보 정정 공시 ({allErrata.length}건)</span>
            </button>
            <button
              onClick={handleExport}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>엑셀 다운로드 ({filteredProjects.length}건)</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Keyword Search */}
          <div className="relative">
            <label className="block text-slate-600 font-semibold mb-1">키워드 검색</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="사업명, 국가, 수행기관..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">지역 / 권역</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 권역</option>
              {CODES.regions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">분야</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
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

          {/* Project Type Filter */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">사업 유형</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 유형</option>
              {CODES.projectTypes.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort & Reset */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">정렬</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="newest">최신 착수연도순</option>
              <option value="budgetDesc">사업비 높은순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Control & Result Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <div>
          총 <strong className="text-blue-700 font-bold">{filteredProjects.length}</strong>개의 사업이 조회되었습니다.
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg border transition-colors ${
              viewMode === 'table' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
            }`}
            title="목록형 보기"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg border transition-colors ${
              viewMode === 'grid' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
            }`}
            title="카드형 보기"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View: Table */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 w-28">사업코드</th>
                  <th className="p-3.5">사업명</th>
                  <th className="p-3.5 w-24">수원국</th>
                  <th className="p-3.5 w-24">분야</th>
                  <th className="p-3.5 w-28">유형</th>
                  <th className="p-3.5 w-28 text-right">사업비</th>
                  <th className="p-3.5 w-28 text-center">추진단계</th>
                  <th className="p-3.5 w-16 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.projectId}
                    onClick={() => setActiveProjectDetailId(p.projectId)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 font-mono font-bold text-slate-600">{p.projectId}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {p.projectNm}
                        </span>
                        {p.errataList && p.errataList.length > 0 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsErrataModalOpen(true);
                            }}
                            className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200 px-1.5 py-0.2 rounded font-bold hover:bg-rose-200"
                          >
                            정정공시 {p.errataList.length}건
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-2">
                        <span>수행기관: {p.executingAgencyNm}</span>
                        <span>•</span>
                        <span>{p.startYmd} ~ {p.endYmd}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-slate-800">{p.countryNm}</span>
                      <div className="text-[10px] text-slate-400">{p.regionNm}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                        {p.sectorNm}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{p.projectTypeNm}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900" title={`${(p.budgetAmt / 100000000).toFixed(1)}억원`}>
                      <div>{p.budgetAmt.toLocaleString()}원</div>
                      <div className="text-[10px] text-slate-400 font-normal font-sans">{(p.budgetAmt / 100000000).toFixed(1)} 억원</div>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-semibold rounded-md">
                        {p.stageNm}
                      </span>
                    </td>
                    <td className="p-3.5 text-center text-slate-400 hover:text-blue-600">
                      <ChevronRight className="w-4 h-4 mx-auto" />
                    </td>
                  </tr>
                ))}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      검색 조건에 일치하는 공개 사업이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View: Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => (
            <div
              key={p.projectId}
              onClick={() => setActiveProjectDetailId(p.projectId)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] font-bold text-slate-500">{p.projectId}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {p.stageNm}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-2 hover:text-blue-600">
                  {p.projectNm}
                </h3>
                <div className="space-y-1 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">수원국:</span>
                    <strong className="text-slate-800">{p.countryNm} ({p.regionNm})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">분야/유형:</span>
                    <strong className="text-slate-800">{p.sectorNm} • {p.projectTypeNm}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">수행기관:</span>
                    <strong className="text-slate-800 truncate max-w-[160px]">{p.executingAgencyNm}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">총 사업비</span>
                  <div className="font-bold text-sm text-blue-900 font-mono">
                    {p.budgetAmt.toLocaleString()}원
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">
                    ({(p.budgetAmt / 100000000).toFixed(1)} 억원)
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600 flex items-center space-x-1">
                  <span>상세보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Errata Notices Modal */}
      {isErrataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-bold text-base text-slate-900">
                  국토교통 ODA 대국민 공개정보 정정 공시 내역 (Errata Notices)
                </h3>
              </div>
              <button
                onClick={() => setIsErrataModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              본 정정 공시는 투명한 정보 제공 및 신뢰도 확보를 위해 사업 정보의 정정·수정 사항(사유, 전·후 내용, 정정일자)을 대국민에게 공시하는 공식 창구입니다.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {allErrata.map((err) => (
                <div key={err.errataSeq} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                      정정공시 번호 {err.noticeNo}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">공시일: {err.errataYmd}</span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm">
                    {err.projectNm}
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">정정 전 [{err.fieldLabel}]:</span>
                      <span className="text-rose-700 line-through font-medium">{err.beforeVal}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">정정 후 [{err.fieldLabel}]:</span>
                      <span className="text-emerald-700 font-bold">{err.afterVal}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-700 pt-1">
                    <strong>정정 사유:</strong> {err.reason} (공시책임: {err.authorNm})
                  </div>
                </div>
              ))}

              {allErrata.length === 0 && (
                <div className="p-8 text-center text-slate-400 italic">
                  현재 등록된 공개 정보 정정 공시 내역이 없습니다.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsErrataModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
