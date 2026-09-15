import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApprovalRequest } from '../../types';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Eye,
  MessageSquare,
  FileDiff,
  ShieldCheck,
} from 'lucide-react';

export const ApprovalManagementView: React.FC = () => {
  const { approvals, processApproval, currentUser, setActiveProjectDetailId } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUPPLEMENT'>('ALL');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [comment, setComment] = useState('');

  const filteredApprovals = approvals.filter((a) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'REJECTED') return a.statusCd === 'RETURNED' || (a.statusCd as string) === 'REJECTED';
    return a.statusCd === statusFilter;
  });

  const pendingCount = approvals.filter((a) => a.statusCd === 'PENDING').length;
  const isApprover = currentUser.role === 'R-03' || currentUser.role === 'R-01';

  const handleAction = (status: 'APPROVED' | 'REJECTED' | 'SUPPLEMENT') => {
    if (!selectedApproval) return;
    processApproval(selectedApproval.apprId, status, comment);
    setSelectedApproval(null);
    setComment('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>APPROVAL WORKFLOW & DIFF COMPARISON</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">결재 관리 (F-145 ~ F-205)</h1>
            <p className="text-xs text-slate-500 mt-1">
              사업 등록 및 주요 항목 변경 시 <strong>상신 전·후 데이터 대조(Diff)</strong> 검토 후 부서장(R-03) 승인·반려·보완요청을 처리합니다.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {!isApprover && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-medium">
                현재 [{currentUser.roleNm}] 권한입니다. 승인 처리는 [R-03 부서장] 권한으로 전환 후 테스트 가능합니다.
              </div>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mt-5 pt-5 border-t border-slate-200 flex flex-wrap gap-2 text-xs">
          {[
            { key: 'ALL', label: '전체 결재 건', count: approvals.length },
            { key: 'PENDING', label: '결재 대기', count: pendingCount, highlight: true },
            { key: 'APPROVED', label: '승인 완료', count: approvals.filter((a) => a.statusCd === 'APPROVED').length },
            { key: 'REJECTED', label: '반려', count: approvals.filter((a) => a.statusCd === 'REJECTED').length },
            { key: 'SUPPLEMENT', label: '보완 요청', count: approvals.filter((a) => a.statusCd === 'SUPPLEMENT').length },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setStatusFilter(btn.key as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center space-x-1.5 border ${
                statusFilter === btn.key
                  ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{btn.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  btn.highlight && btn.count > 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Approvals Grid: Master / Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 px-1">
            결재 목록 ({filteredApprovals.length}건)
          </div>

          <div className="space-y-2.5">
            {filteredApprovals.map((appr) => {
              const isSelected = selectedApproval?.apprId === appr.apprId;

              return (
                <div
                  key={appr.apprId}
                  onClick={() => {
                    setSelectedApproval(appr);
                    setComment(appr.approverComment || '');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        appr.statusCd === 'PENDING'
                          ? 'bg-amber-100 text-amber-900'
                          : appr.statusCd === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : appr.statusCd === 'REJECTED'
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      {appr.statusNm}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{appr.apprId}</span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{appr.title}</h3>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>상신: {appr.requestedByNm}</span>
                    <span>{appr.requestedAt}</span>
                  </div>
                </div>
              );
            })}

            {filteredApprovals.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                해당 조건의 결재 문서가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Diff & Decision Area */}
        <div className="lg:col-span-2">
          {selectedApproval ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-5 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {selectedApproval.apprId}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      대상: {selectedApproval.targetId}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{selectedApproval.title}</h2>
                </div>

                <div className="text-right text-xs">
                  <div className="text-slate-400">상신일시</div>
                  <div className="font-mono text-slate-700">{selectedApproval.requestedAt}</div>
                </div>
              </div>

              {/* F-147: Side-by-Side Diff Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <FileDiff className="w-4 h-4 text-blue-600" />
                    <span>상신 전·후 데이터 대조 (Side-by-Side Diff)</span>
                  </h3>
                  <button
                    onClick={() => setActiveProjectDetailId(selectedApproval.targetId)}
                    className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>사업 상세정보 조회</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Before */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>변경 전 (Before)</span>
                      <span className="text-[10px] text-slate-400">원천 데이터</span>
                    </div>
                    {selectedApproval.beforePayloadJson ? (
                      <div className="space-y-1 text-xs">
                        {Object.entries(selectedApproval.beforePayloadJson).map(([key, val]) => (
                          <div key={key} className="flex justify-between py-1 border-b border-slate-200/60">
                            <span className="text-slate-500">{key}:</span>
                            <span className="font-semibold text-slate-800 font-mono">
                              {typeof val === 'number' ? val.toLocaleString() : String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center italic">
                        신규 등록 건 (변경 전 데이터 없음)
                      </p>
                    )}
                  </div>

                  {/* After */}
                  <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-200 space-y-2">
                    <div className="text-xs font-bold text-blue-950 flex items-center justify-between">
                      <span>변경 후 상신안 (After)</span>
                      <span className="text-[10px] text-blue-600 font-semibold">승인 시 적용</span>
                    </div>
                    {selectedApproval.payloadJson ? (
                      <div className="space-y-1 text-xs">
                        {Object.entries(selectedApproval.payloadJson).map(([key, val]) => (
                          <div key={key} className="flex justify-between py-1 border-b border-blue-200/60">
                            <span className="text-blue-900 font-medium">{key}:</span>
                            <span className="font-bold text-blue-950 font-mono bg-blue-100/60 px-1 rounded">
                              {typeof val === 'number' ? val.toLocaleString() : String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center italic">상세 없음</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Decision Section */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  결재 의견 및 심의 피드백 (F-148)
                </label>
                <textarea
                  rows={3}
                  disabled={selectedApproval.statusCd !== 'PENDING' || !isApprover}
                  placeholder={
                    isApprover
                      ? '승인, 반려, 보완요청에 대한 구체적인 의견 및 지시사항을 기재하세요.'
                      : '부서장 권한이 있어야 의견을 남기고 결재를 처리할 수 있습니다.'
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white disabled:bg-slate-100 disabled:text-slate-500"
                />

                {selectedApproval.statusCd === 'PENDING' && isApprover && (
                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      onClick={() => handleAction('SUPPLEMENT')}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      보완 요청
                    </button>
                    <button
                      onClick={() => handleAction('REJECTED')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      반려
                    </button>
                    <button
                      onClick={() => handleAction('APPROVED')}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>최종 승인 및 DB 반영</span>
                    </button>
                  </div>
                )}

                {selectedApproval.statusCd !== 'PENDING' && (
                  <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                    <strong>처리 완료:</strong> {selectedApproval.approvedAt}에 {selectedApproval.approvedByNm}님이 [{selectedApproval.statusNm}] 처리하였습니다.
                    {selectedApproval.approverComment && (
                      <div className="mt-1 text-slate-800 italic">
                        의견: "{selectedApproval.approverComment}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 space-y-2">
              <CheckSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p>좌측 목록에서 검토할 결재 문서를 선택하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
