import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Search, Filter, FolderDown, Eye, CheckCircle2 } from 'lucide-react';
import { CODES } from '../../data/mockData';

export const PortalOutputs: React.FC = () => {
  const { projects, setActiveProjectDetailId, showToast } = useApp();

  const [keyword, setKeyword] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');

  // Collect public documents only
  const allPublicDocs = projects.flatMap((p) =>
    (p.documents || [])
      .filter((d) => d.isPublic === 'Y')
      .map((d) => ({
        ...d,
        countryNm: p.countryNm,
        sectorCd: p.sectorCd,
        sectorNm: p.sectorNm,
      }))
  );

  const filteredDocs = allPublicDocs.filter((d) => {
    if (docTypeFilter !== 'ALL' && d.docTypeCd !== docTypeFilter) return false;
    if (sectorFilter !== 'ALL' && d.sectorCd !== sectorFilter) return false;
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      const matchFile = d.fileNm.toLowerCase().includes(q);
      const matchProj = d.projectNm.toLowerCase().includes(q);
      const matchCountry = d.countryNm.toLowerCase().includes(q);
      if (!matchFile && !matchProj && !matchCountry) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>PROJECT DELIVERABLES & REPORTS</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">국토교통 ODA 사업산출물</h1>
            <p className="text-xs text-slate-500 mt-1">
              사업기획서, 중간·최종보고서, 사후평가서 등 사업 수행 과정에서 생산된 신뢰도 높은 연구·조사 산출물을 다운로드할 수 있습니다.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-blue-50/70 p-3 rounded-xl border border-blue-200/60 max-w-sm">
            <span className="font-bold text-blue-900 block mb-0.5">산출물 활용 안내</span>
            공개 보고서는 연구 및 비영리 목적으로 자유롭게 활용 가능하며, 출처 표기(국토교통부·KIDC)를 준수해야 합니다.
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <label className="block text-slate-600 font-semibold mb-1">산출물명 / 사업명 검색</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="보고서명, 국가, 키워드..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">문서 유형</label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 문서유형</option>
              <option value="PLAN">사업계획서</option>
              <option value="REPORT">보고서 (중간/최종)</option>
              <option value="EVAL">성과·사후평가서</option>
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
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <div>
          공개 산출물 <strong className="text-blue-700 font-bold">{filteredDocs.length}</strong>건이 검색되었습니다.
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden shadow-xs">
        {filteredDocs.map((doc) => (
          <div
            key={doc.docId}
            className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl mt-0.5 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                    {doc.docTypeNm}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded">
                    {doc.countryNm} • {doc.sectorNm}
                  </span>
                  <span className="text-[11px] text-slate-400">{doc.fileSize}</span>
                  <span className="text-[11px] text-slate-400">• {doc.createdAt}</span>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer">
                  {doc.fileNm}
                </h3>
                <p
                  onClick={() => setActiveProjectDetailId(doc.projectId)}
                  className="text-xs text-slate-500 hover:text-blue-600 hover:underline cursor-pointer mt-1"
                >
                  연계 사업: {doc.projectNm} ({doc.projectId})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 md:self-center">
              <button
                onClick={() => setActiveProjectDetailId(doc.projectId)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>사업정보</span>
              </button>
              <button
                onClick={() => showToast(`[${doc.fileNm}] 다운로드를 시작합니다.`, 'success')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>다운로드</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            검색 조건에 맞는 공개 산출물이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
