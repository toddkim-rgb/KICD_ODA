import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, PlusCircle, GitBranch, Sparkles } from 'lucide-react';
import { CODES } from '../../data/mockData';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseProjectIdForReproposal?: string;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  baseProjectIdForReproposal,
}) => {
  const { addProject, projects } = useApp();

  const [projectNm, setProjectNm] = useState('');
  const [countryCd, setCountryCd] = useState('VN');
  const [sectorCd, setSectorCd] = useState('URBAN');
  const [projectTypeCd, setProjectTypeCd] = useState('CONSULTING');
  const [budgetAmt, setBudgetAmt] = useState(2000000000);
  const [startYmd, setStartYmd] = useState('2026-03-01');
  const [endYmd, setEndYmd] = useState('2027-12-31');
  const [orderingAgencyNm, setOrderingAgencyNm] = useState('국토교통부');
  const [proposingAgencyNm, setProposingAgencyNm] = useState('');
  const [executingAgencyNm, setExecutingAgencyNm] = useState('선정중 (입찰예정)');
  const [overview, setOverview] = useState('');
  const [expectedEffect, setExpectedEffect] = useState('');
  const [isPublic, setIsPublic] = useState<'Y' | 'N'>('Y');
  const [isReproposal, setIsReproposal] = useState(!!baseProjectIdForReproposal);
  const [selectedBaseId, setSelectedBaseId] = useState(baseProjectIdForReproposal || '');

  if (!isOpen) return null;

  // Unselected/rejected projects that can be reproposed
  const unselectedProjects = projects.filter(
    (p) => p.stageCd === 'REJECTED' || p.stageCd === 'HELD' || p.statusCd.includes('REJECTED')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const countryObj = {
      VN: { name: '베트남', region: 'SEA', regionNm: '동남아시아' },
      ID: { name: '인도네시아', region: 'SEA', regionNm: '동남아시아' },
      PH: { name: '필리핀', region: 'SEA', regionNm: '동남아시아' },
      MN: { name: '몽골', region: 'CA', regionNm: '중앙아시아' },
      UZ: { name: '우즈베키스탄', region: 'CA', regionNm: '중앙아시아' },
      CO: { name: '콜롬비아', region: 'LATAM', regionNm: '중남미' },
      PY: { name: '파라과이', region: 'LATAM', regionNm: '중남미' },
      TZ: { name: '탄자니아', region: 'AFRICA', regionNm: '아프리카' },
    }[countryCd] || { name: '베트남', region: 'SEA', regionNm: '동남아시아' };

    const sectorObj = CODES.sectors.find((s) => s.code === sectorCd);
    const typeObj = CODES.projectTypes.find((t) => t.code === projectTypeCd);

    addProject(
      {
        projectNm,
        countryCd,
        countryNm: countryObj.name,
        regionCd: countryObj.region,
        regionNm: countryObj.regionNm,
        sectorCd: sectorCd as any,
        sectorNm: sectorObj?.name || '도시',
        projectTypeCd: projectTypeCd as any,
        projectTypeNm: typeObj?.name || '개발컨설팅',
        budgetAmt: Number(budgetAmt),
        budgetCurrency: 'KRW',
        startYmd,
        endYmd,
        orderingAgencyNm,
        proposingAgencyNm: proposingAgencyNm || `${countryObj.name} 주무부처`,
        executingAgencyNm,
        overview,
        expectedEffect,
        isPublic,
        stageCd: isReproposal ? 'REVIEW' : 'DISCOVERED',
        stageNm: isReproposal ? '국개위 심의상정 (재제안)' : '사업발굴 (N-2년)',
      },
      isReproposal && selectedBaseId ? selectedBaseId : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-700/50 rounded-lg">
              <PlusCircle className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">국토교통 ODA 사업 신규 등록 (F-101)</h2>
              <p className="text-xs text-blue-200">
                사업 발굴부터 심의·의결, 계약체결까지 전 주기를 관리할 기본 정보를 등록합니다.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* F-104: Reproposal Link Option */}
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-indigo-950 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isReproposal}
                  onChange={(e) => setIsReproposal(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>미선정(탈락) 사업 재제안 연결 등록 (F-104 연계체계)</span>
              </label>
              <span className="text-[10px] text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                심의이력 승계
              </span>
            </div>

            {isReproposal && (
              <div className="pt-2 border-t border-indigo-200">
                <label className="block text-slate-700 font-semibold mb-1">
                  연결할 1차 원사업 (미선정/탈락 과제 선택)
                </label>
                <select
                  value={selectedBaseId}
                  onChange={(e) => {
                    setSelectedBaseId(e.target.value);
                    const sel = projects.find((p) => p.projectId === e.target.value);
                    if (sel) {
                      setProjectNm(`[재제안] ${sel.projectNm.replace(/\[.*?\]\s*/g, '')}`);
                      setCountryCd(sel.countryCd);
                      setSectorCd(sel.sectorCd);
                      setBudgetAmt(Math.round(sel.budgetAmt * 1.2));
                    }
                  }}
                  className="w-full p-2 bg-white border border-indigo-300 rounded-md font-medium text-slate-800"
                >
                  <option value="">-- 원사업을 선택하세요 --</option>
                  {unselectedProjects.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      [{p.projectId}] {p.projectNm} ({p.countryNm} / {p.sectorNm})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-indigo-700 mt-1">
                  * 원사업의 검토 결과와 비교 분석이 가능한 F-105 회차별 대조표가 자동 구성됩니다.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              사업명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: 베트남 다낭 친환경 복합교통체계 마스터플랜 및 시범구축"
              value={projectNm}
              onChange={(e) => setProjectNm(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">수원국</label>
              <select
                value={countryCd}
                onChange={(e) => setCountryCd(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="VN">베트남 (동남아)</option>
                <option value="ID">인도네시아 (동남아)</option>
                <option value="PH">필리핀 (동남아)</option>
                <option value="MN">몽골 (중앙아)</option>
                <option value="UZ">우즈베키스탄 (중앙아)</option>
                <option value="CO">콜롬비아 (중남미)</option>
                <option value="PY">파라과이 (중남미)</option>
                <option value="TZ">탄자니아 (아프리카)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">분야</label>
              <select
                value={sectorCd}
                onChange={(e) => setSectorCd(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                {CODES.sectors.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">사업 유형</label>
              <select
                value={projectTypeCd}
                onChange={(e) => setProjectTypeCd(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                {CODES.projectTypes.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                총 사업비 (KRW) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                step={100000000}
                value={budgetAmt}
                onChange={(e) => setBudgetAmt(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
                {budgetAmt.toLocaleString()}원 ({(budgetAmt / 100000000).toFixed(1)} 억원)
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">대국민 포털 공개 여부</label>
              <select
                value={isPublic}
                onChange={(e) => setIsPublic(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Y">공개 (대국민 사업DB 및 산출물 노출)</option>
                <option value="N">비공개 (내부 전용 검토과제)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">착수 예정일</label>
              <input
                type="date"
                value={startYmd}
                onChange={(e) => setStartYmd(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">종료 예정일</label>
              <input
                type="date"
                value={endYmd}
                onChange={(e) => setEndYmd(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">발주 기관</label>
              <input
                type="text"
                value={orderingAgencyNm}
                onChange={(e) => setOrderingAgencyNm(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">수원국 제안 기관</label>
              <input
                type="text"
                placeholder="예: 베트남 건설부 (MoC)"
                value={proposingAgencyNm}
                onChange={(e) => setProposingAgencyNm(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">사업 개요 및 주요 과업</label>
            <textarea
              rows={3}
              placeholder="수원국 개발 수요 및 한국형 국토교통 인프라/시스템 적용 방안 기재"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors"
            >
              사업 등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
