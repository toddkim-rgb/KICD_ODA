import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, Filter, FileSpreadsheet, User, Calendar, Database } from 'lucide-react';

export const AuditHistoryView: React.FC = () => {
  const { changeHistories, exportToCsv, setActiveProjectDetailId } = useApp();

  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = changeHistories.filter((h) => {
    if (typeFilter !== 'ALL' && h.changeType !== typeFilter) return false;
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      const matchTarget = h.targetId.toLowerCase().includes(q);
      const matchField = h.fieldLabel.toLowerCase().includes(q);
      const matchUser = h.changedByName.toLowerCase().includes(q);
      const matchBefore = (h.beforeVal || '').toLowerCase().includes(q);
      const matchAfter = (h.afterVal || '').toLowerCase().includes(q);
      if (!matchTarget && !matchField && !matchUser && !matchBefore && !matchAfter) return false;
    }
    return true;
  });

  const handleExport = () => {
    const data = filtered.map((h) => ({
      이력순번: h.histSeq,
      변경일시: h.changedAt,
      변경구분: h.changeType,
      테이블명: h.targetTable,
      대상식별자: h.targetId,
      변경필드: h.fieldLabel,
      변경전값: h.beforeVal || '-',
      변경후값: h.afterVal || '-',
      작업자: `${h.changedByName} (${h.changedBy})`,
      클라이언트IP: h.clientIp,
    }));
    exportToCsv(data, '국토교통_ODA_데이터감사_변경이력');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <History className="w-3.5 h-3.5" />
              <span>SECURITY & DATA AUDIT TRAIL</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">데이터 변경이력 추적 (F-140 ~ F-142)</h1>
            <p className="text-xs text-slate-500 mt-1">
              사업 기본정보, 일정, 예산, 산출물, 승인 결과 등 모든 데이터 변경 내역을 <strong>sy_change_hist 감사 테이블</strong>에 자동 기록하고 역추적합니다.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>감사 로그 엑셀 다운로드</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative sm:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">통합 검색</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="사업코드, 변경항목, 작업자, 전/후 값 검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">변경 유형</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 변경유형 (INSERT/UPDATE/DELETE)</option>
              <option value="INSERT">INSERT (신규등록)</option>
              <option value="UPDATE">UPDATE (수정/승인)</option>
              <option value="DELETE">DELETE (삭제)</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            감사 로그 목록 ({filtered.length}건 기록됨)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Spring AOP / Transactional Audit Interceptor
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-16">순번</th>
                <th className="p-3.5 w-24">유형</th>
                <th className="p-3.5 w-28">대상 식별자</th>
                <th className="p-3.5 w-32">변경 필드</th>
                <th className="p-3.5">변경 전 (Before)</th>
                <th className="p-3.5">변경 후 (After)</th>
                <th className="p-3.5 w-36">작업자 (IP)</th>
                <th className="p-3.5 w-32 font-mono">작업일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((h) => (
                <tr key={h.histSeq} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">{h.histSeq}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.changeType === 'INSERT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : h.changeType === 'UPDATE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {h.changeType}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-700">
                    <span
                      onClick={() => setActiveProjectDetailId(h.targetId)}
                      className="hover:text-blue-600 hover:underline cursor-pointer"
                    >
                      {h.targetId}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900">{h.fieldLabel}</td>
                  <td className="p-3.5 text-slate-500 font-mono max-w-xs truncate">
                    {h.beforeVal ? (/^\d+$/.test(h.beforeVal) ? Number(h.beforeVal).toLocaleString() : h.beforeVal) : '-'}
                  </td>
                  <td className="p-3.5 text-blue-950 font-bold font-mono max-w-xs truncate bg-blue-50/30">
                    {h.afterVal ? (/^\d+$/.test(h.afterVal) ? Number(h.afterVal).toLocaleString() : h.afterVal) : '-'}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <div className="font-semibold">{h.changedByName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{h.clientIp}</div>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono">{h.changedAt}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    일치하는 감사 로그 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
