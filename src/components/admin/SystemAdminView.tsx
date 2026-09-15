import React from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Shield, Key, Database, Download, CheckCircle2, UserCheck, Layers } from 'lucide-react';
import { USERS, CODES } from '../../data/mockData';

export const SystemAdminView: React.FC = () => {
  const { showToast, exportToCsv } = useApp();

  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        사업명: '베트남 하노이 스마트 교통체계 구축 (예시)',
        국가코드: 'VN',
        수원국명: '베트남',
        분야코드: 'TRANS',
        사업유형: 'SYSTEM',
        사업비_원: 3500000000,
        착수일: '2026-03-01',
        종료일: '2028-02-28',
        발주기관: '국토교통부',
        제안기관: '베트남 교통부 (MoT)',
        수행기관: '선정중',
        대국민공개_YN: 'Y',
      },
    ];
    exportToCsv(templateRows, 'KIDC_국토교통_ODA_사업일괄등록_표준양식');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>SYSTEM ARCHITECTURE & RBAC SECURITY</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">시스템 및 권한 관리 (F-301 ~ F-310)</h1>
        <p className="text-xs text-slate-500 mt-1">
          역할 기반 접근 제어(RBAC, R-01~R-05), 표준 공통코드 체계, 데이터 백업 및 엑셀 일괄 등록 서식을 관리합니다.
        </p>
      </div>

      {/* 2-Columns: RBAC Roles and Batch Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles Table */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900">시스템 권한 체계 (RBAC R-01 ~ R-05)</h2>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { code: 'R-01', name: '총괄관리자 (KIDC)', desc: '시스템 전 권한, 사용자 승인, 공통코드 및 보안 감사로그 조회' },
              { code: 'R-02', name: 'ODA 사업담당자', desc: '사업 등록/수정, 마일스톤 관리, 산출물 등록 및 결재 상신' },
              { code: 'R-03', name: '부서장 (결재권자)', desc: '사업 등록 및 중요정보 변경 상신안에 대한 최종 승인/반려/보완' },
              { code: 'R-04', name: '수행기관 (기업/공공)', desc: '담당 계약 과제의 진척률 보고, 산출물 업로드 및 일정 관리' },
              { code: 'R-05', name: '일반 / 수원국', desc: '대국민 포털 공개(Y) 사업 및 산출물 조회/다운로드' },
            ].map((r) => (
              <div key={r.code} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded text-[10px]">
                    {r.code}
                  </span>
                  <span className="font-bold text-slate-900">{r.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Batch Template & Infrastructure */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Download className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-sm text-slate-900">엑셀 대량 일괄 등록 양식 (F-310)</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              기존 분산 파일이나 수기 관리되던 과거 사업정보를 시스템에 일괄 이관하기 위한 국토교통 ODA 표준 서식을 내려받습니다.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>표준 엑셀 업로드 템플릿 다운로드 (.csv/.xlsx)</span>
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Layers className="w-4 h-4 text-slate-700" />
              <h2 className="font-bold text-sm text-slate-900">인프라 및 보안 아키텍처 현황</h2>
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">호스팅 클라우드:</span>
                <strong className="text-slate-800">해외건설협회 전용 클라우드 존</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">데이터베이스:</span>
                <strong className="text-slate-800">RDBMS (MariaDB / PostgreSQL 표준)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">감사 로깅:</span>
                <strong className="text-emerald-700 font-bold">sy_change_hist 트랜잭션 전수 적재 중</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">백업 주기:</span>
                <strong className="text-slate-800">일 1회 증분, 주 1회 전체 암호화 백업</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Dictionary Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">국토교통 ODA 표준 공통코드 체계 (6대 분야)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {CODES.sectors.map((s) => (
            <div key={s.code} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-mono text-[10px] text-blue-600 font-bold block">{s.code}</span>
              <strong className="text-slate-900">{s.name}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
