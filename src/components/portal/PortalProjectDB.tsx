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
                      <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        {p.projectNm}
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
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                      {(p.budgetAmt / 100000000).toFixed(1)} 억원
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
                  <span className="font-bold text-sm text-blue-900">
                    {(p.budgetAmt / 100000000).toFixed(1)} 억원
                  </span>
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
    </div>
  );
};
