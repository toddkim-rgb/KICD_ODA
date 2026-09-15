import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowRight, CheckCircle, AlertTriangle, GitCompare, RefreshCw, FileText } from 'lucide-react';

export const ReproposalCompareModal: React.FC = () => {
  const { compareReproposalData, setCompareReproposalData, setActiveProjectDetailId } = useApp();

  if (!compareReproposalData) return null;

  const { base, target } = compareReproposalData;
  const relation = target.relations?.find((r) => r.baseProjectId === base.projectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/50 rounded-lg text-indigo-200">
              <GitCompare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-500/30 text-indigo-200 rounded border border-indigo-400/30">
                  과업 관리 표준 F-105
                </span>
                <h2 className="text-lg font-bold">미선정·재제안 사업 회차별 변경이력 정밀 비교</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                국개위 심의 미선정(탈락) 사유를 보완하여 재제안된 사업의 사업비·추진방식·과업범위 연속 비교 체계
              </p>
            </div>
          </div>
          <button
            onClick={() => setCompareReproposalData(null)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Summary Cards of Both Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Base (Original) Project */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 1차 원사업 (미선정·탈락)
                </span>
                <span className="font-mono text-xs text-rose-700 font-semibold">{base.projectId}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2">{base.projectNm}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-rose-200">
                <div>수원국: <strong className="text-slate-800">{base.countryNm}</strong></div>
                <div>분야: <strong className="text-slate-800">{base.sectorNm}</strong></div>
                <div>사업비: <strong className="text-rose-700 font-semibold">{base.budgetAmt.toLocaleString()}원</strong></div>
                <div>상태: <strong className="text-rose-700 font-semibold">{base.stageNm}</strong></div>
              </div>
            </div>

            {/* Target (Re-proposal) Project */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 2차 재제안 (심의통과·수행중)
                </span>
                <span className="font-mono text-xs text-emerald-700 font-semibold">{target.projectId}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2">{target.projectNm}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-emerald-200">
                <div>수원국: <strong className="text-slate-800">{target.countryNm}</strong></div>
                <div>분야: <strong className="text-slate-800">{target.sectorNm}</strong></div>
                <div>사업비: <strong className="text-emerald-700 font-semibold">{target.budgetAmt.toLocaleString()}원</strong></div>
                <div>상태: <strong className="text-emerald-700 font-semibold">{target.stageNm}</strong></div>
              </div>
            </div>
          </div>

          {/* Core Diff Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-sm text-slate-800">주요 변경 항목 대조표 (Diff Comparison)</span>
              </div>
              <span className="text-xs text-slate-500">
                연결 방식: {relation?.relationType === 'REPROPOSAL' ? '보완 재제안 (REPROPOSAL)' : '후속/연계 (FOLLOWUP)'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-28">비교 항목</th>
                    <th className="p-3 w-1/3 bg-rose-50/40 text-rose-900">1차 원사업 제안 내용 (Before)</th>
                    <th className="p-3 w-1/3 bg-emerald-50/40 text-emerald-900">2차 보완 재제안 내용 (After)</th>
                    <th className="p-3">보완 사유 및 기대효과</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {relation?.diffDetails && relation.diffDetails.length > 0 ? (
                    relation.diffDetails.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-semibold text-slate-800 bg-slate-50/50">{item.label}</td>
                        <td className="p-3 text-slate-700 font-mono bg-rose-50/20">{String(item.before)}</td>
                        <td className="p-3 font-bold text-emerald-700 font-mono bg-emerald-50/20">{String(item.after)}</td>
                        <td className="p-3 text-slate-600">{item.comment || '국개위 심의의견 수렴 및 보완'}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800 bg-slate-50/50">총 사업비</td>
                        <td className="p-3 text-slate-700 font-mono bg-rose-50/20">{base.budgetAmt.toLocaleString()}원</td>
                        <td className="p-3 font-bold text-emerald-700 font-mono bg-emerald-50/20">{target.budgetAmt.toLocaleString()}원</td>
                        <td className="p-3 text-slate-600">현지 조사 고도화 및 파일럿 실증 장비 추가</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800 bg-slate-50/50">사업 유형</td>
                        <td className="p-3 text-slate-700 bg-rose-50/20">{base.projectTypeNm}</td>
                        <td className="p-3 font-bold text-emerald-700 bg-emerald-50/20">{target.projectTypeNm}</td>
                        <td className="p-3 text-slate-600">단순 계획 수립에서 파일럿 실증을 결합한 K-ODA 모델 적용</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800 bg-slate-50/50">사업 기간</td>
                        <td className="p-3 text-slate-700 bg-rose-50/20">{base.startYmd} ~ {base.endYmd}</td>
                        <td className="p-3 font-bold text-emerald-700 bg-emerald-50/20">{target.startYmd} ~ {target.endYmd}</td>
                        <td className="p-3 text-slate-600">수원국 인허가 기간 현실화 반영</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Change Summary Narrative Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> 변경 총괄 요약 (Change Summary)
            </h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              {relation?.changeSummary ||
                '1차 심의 시 지적된 과업의 구체성 및 수원국 매칭 역량을 전면 보완하여 2차 재제안 시 선정 및 성공적으로 착수됨. 발굴 및 심의 과정에서 축적된 검토 결과가 사업계획 보완에 체계적으로 환류된 우수 사례임.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            * 사업DB 관리시스템은 미선정 사업의 모든 검토 이력을 영구 보존하여 지식자산으로 환류합니다.
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCompareReproposalData(null);
                setActiveProjectDetailId(target.projectId);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <span>재제안 사업 상세 바로가기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCompareReproposalData(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
