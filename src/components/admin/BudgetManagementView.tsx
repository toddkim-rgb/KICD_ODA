import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  FileSpreadsheet,
  TrendingUp,
  Percent,
  Calculator,
  Edit2,
  CheckCircle2,
  Eye,
} from 'lucide-react';

export const BudgetManagementView: React.FC = () => {
  const { projects, updateBudget, exportToCsv, setActiveProjectDetailId } = useApp();

  const [keyword, setKeyword] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Totals
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget?.allocatedAmt || p.budgetAmt), 0);
  const totalContract = projects.reduce((acc, p) => acc + (p.budget?.contractAmt || 0), 0);
  const totalSaving = projects.reduce((acc, p) => acc + (p.budget?.savingAmt || 0), 0);
  const totalExecuted = projects.reduce((acc, p) => acc + (p.budget?.executedAmt || 0), 0);
  const avgExecutionRate = totalContract > 0 ? ((totalExecuted / totalContract) * 100).toFixed(1) : '0';

  const filteredProjects = projects.filter((p) => {
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      const matchNm = p.projectNm.toLowerCase().includes(q);
      const matchId = p.projectId.toLowerCase().includes(q);
      const matchAgency = p.executingAgencyNm.toLowerCase().includes(q);
      if (!matchNm && !matchId && !matchAgency) return false;
    }
    return true;
  });

  const handleExport = () => {
    const data = filteredProjects.map((p) => {
      const b = p.budget;
      return {
        사업코드: p.projectId,
        사업명: p.projectNm,
        수원국: p.countryNm,
        수행기관: p.executingAgencyNm,
        예산액_원: b?.allocatedAmt || p.budgetAmt,
        계약금액_원: b?.contractAmt || 0,
        낙찰차액_원: b?.savingAmt || 0,
        집행액_원: b?.executedAmt || 0,
        집행잔액_원: b?.balanceAmt || 0,
        집행률_퍼센트: b?.contractAmt ? ((b.executedAmt / b.contractAmt) * 100).toFixed(1) : '0',
        낙찰차액_활용계획: b?.savingUsePlan || '-',
      };
    });
    exportToCsv(data, '국토교통_ODA_예산및계약_집행대장');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>BUDGET & CONTRACT EXECUTION</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">예산 및 계약 관리 (F-130 ~ F-135)</h1>
            <p className="text-xs text-slate-500 mt-1">
              예산 배정, 계약 체결, <strong>낙찰차액 자동 계산(예산 - 계약금액)</strong>, 차액 활용계획 및 집행률·집행잔액을 통합 관리합니다.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>예산·계약 대장 엑셀 다운로드 (F-135)</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <input
            type="text"
            placeholder="사업명, 코드, 수행기관 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full sm:w-80 p-2 text-xs border border-slate-300 rounded-lg bg-white"
          />
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 font-semibold block mb-1">총 배정 예산</span>
          <div className="text-lg font-black text-slate-900">
            {(totalBudget / 100000000).toFixed(1)} <span className="text-xs font-normal">억원</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <span className="text-blue-900 font-semibold block mb-1">총 계약 체결액</span>
          <div className="text-lg font-black text-blue-900">
            {(totalContract / 100000000).toFixed(1)} <span className="text-xs font-normal">억원</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
          <span className="text-indigo-900 font-semibold block mb-1">낙찰차액 합계 (F-132)</span>
          <div className="text-lg font-black text-indigo-900">
            {(totalSaving / 100000000).toFixed(1)} <span className="text-xs font-normal">억원</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-teal-200 bg-teal-50/20 shadow-xs">
          <span className="text-teal-900 font-semibold block mb-1">총 집행액 (기성지급)</span>
          <div className="text-lg font-black text-teal-900">
            {(totalExecuted / 100000000).toFixed(1)} <span className="text-xs font-normal">억원</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-slate-500 font-semibold block mb-1">평균 집행률 (F-134)</span>
          <div className="text-lg font-black text-slate-900 flex items-center gap-1">
            {avgExecutionRate}%
          </div>
        </div>
      </div>

      {/* Main Budget & Contract Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-24">사업코드</th>
                <th className="p-3.5">사업명 / 수행기관</th>
                <th className="p-3.5 w-24 text-right">예산액(A)</th>
                <th className="p-3.5 w-24 text-right">계약액(B)</th>
                <th className="p-3.5 w-28 text-right bg-indigo-50/50 text-indigo-900 font-bold">
                  낙찰차액(A-B)
                </th>
                <th className="p-3.5 w-24 text-right">집행액(C)</th>
                <th className="p-3.5 w-24 text-right">집행잔액(B-C)</th>
                <th className="p-3.5 w-20 text-center">집행률</th>
                <th className="p-3.5 w-20 text-center">상세조정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p) => {
                const b = p.budget;
                const allocated = b?.allocatedAmt || p.budgetAmt;
                const contract = b?.contractAmt || 0;
                const saving = b?.savingAmt || (contract > 0 ? allocated - contract : 0);
                const executed = b?.executedAmt || 0;
                const balance = b?.balanceAmt || (contract > 0 ? contract - executed : 0);
                const rate = contract > 0 ? ((executed / contract) * 100).toFixed(0) : '0';

                return (
                  <tr key={p.projectId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-600">{p.projectId}</td>
                    <td className="p-3.5">
                      <div
                        onClick={() => setActiveProjectDetailId(p.projectId)}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                      >
                        {p.projectNm}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        수행기관: {p.executingAgencyNm}
                      </div>
                      {b?.savingUsePlan && (
                        <div className="text-[10px] text-indigo-700 bg-indigo-50/80 px-1.5 py-0.5 rounded mt-1 inline-block">
                          차액활용: {b.savingUsePlan}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono font-medium text-slate-700">
                      {(allocated / 100000000).toFixed(2)} 억
                    </td>
                    <td className="p-3.5 text-right font-mono font-medium text-blue-900">
                      {contract > 0 ? `${(contract / 100000000).toFixed(2)} 억` : '-'}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-indigo-900 bg-indigo-50/30">
                      {contract > 0 ? `${(saving / 100000000).toFixed(2)} 억` : '-'}
                    </td>
                    <td className="p-3.5 text-right font-mono font-medium text-teal-800">
                      {executed > 0 ? `${(executed / 100000000).toFixed(2)} 억` : '-'}
                    </td>
                    <td className="p-3.5 text-right font-mono font-medium text-slate-600">
                      {contract > 0 ? `${(balance / 100000000).toFixed(2)} 억` : '-'}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="font-mono font-bold text-slate-800">{rate}%</span>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, Number(rate))}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setActiveProjectDetailId(p.projectId)}
                        className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded text-[11px] font-semibold transition-colors"
                      >
                        상세/조정
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
