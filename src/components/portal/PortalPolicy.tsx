import React from 'react';
import { BookOpen, FileCheck, Download, ExternalLink, ShieldCheck, Scale, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PortalPolicy: React.FC = () => {
  const { showToast } = useApp();

  const guidelines = [
    {
      title: '국토교통 ODA 사업 시행 및 관리지침 (훈령 제1648호)',
      category: '법령·훈령',
      date: '2024-03-15',
      size: '1.8 MB',
      desc: '국토교통 ODA 사업의 발굴, 타당성조사, 사업선정, 용역계약, 사후평가 등 전반적 운영 절차를 규정한 기본 훈령.',
    },
    {
      title: '국토교통 ODA 성과관리(PDM) 및 지표 작성 매뉴얼',
      category: '성과관리 지침',
      date: '2024-05-20',
      size: '4.2 MB',
      desc: '기초선 조사, 사업목적(Purpose) 및 산출물(Output) 지표 정의 방법론, 차수별 추적조사 서식 안내.',
    },
    {
      title: '국토교통 ODA 제안서(PCP) 표준 국·영문 양식 및 작성 가이드',
      category: '표준 서식',
      date: '2025-01-10',
      size: '2.5 MB',
      desc: '수원국 주무관청에서 작성하여 외교부 및 국토교통부로 공식 제출하는 Project Concept Paper 표준 서식.',
    },
    {
      title: '국토교통 ODA 종료사업 사후평가 및 추적조사 가이드라인',
      category: '평가 매뉴얼',
      date: '2024-11-30',
      size: '3.1 MB',
      desc: '종료 후 1~3년 차수별 현지 추적조사, 성과 정착도 진단 및 국내 기업 해외 진출 연계 파급효과 산출 기준.',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>LEGAL & PERFORMANCE MANAGEMENT</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">성과·평가 및 법령·지침</h1>
        <p className="text-xs text-slate-500 mt-1">
          국토교통 ODA 사업의 신뢰성과 투명성을 담보하는 관련 법령, 사업관리지침, PDM 성과관리 표준 매뉴얼을 열람할 수 있습니다.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guidelines.map((g, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded-md border border-blue-200/60">
                  {g.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{g.date}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug mb-2">{g.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{g.desc}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">{g.size}</span>
              <button
                onClick={() => showToast(`[${g.title}] 다운로드를 시작합니다.`, 'info')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>지침 다운로드</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Standard Section */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>국토교통 ODA 시행기관 정량 성과평가 체계</span>
        </div>
        <h2 className="text-lg font-bold">표준화된 성과평가 기반 구축 및 데이터 환류</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          본 사업DB 시스템 구축을 통해 사업 추진일정 준수도, 예산 집행률, PDM 지표 달성도, 핵심 산출물 활용성, 사후 추적조사 결과 및 후속 연계사업 추진 실적을 시행기관별로 표준 데이터로 축적하여 객관적 성과평가를 실현합니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white/10 p-4 rounded-xl border border-white/15">
            <div className="text-xs font-bold text-blue-300 mb-1">1. 공정 및 집행 적시성</div>
            <p className="text-[11px] text-slate-300">마일스톤 일정 준수율 및 연도별 예산 집행잔액 최소화</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/15">
            <div className="text-xs font-bold text-blue-300 mb-1">2. PDM 지표 달성률</div>
            <p className="text-[11px] text-slate-300">수원국 인프라 운영효율 개선 및 전문인력 양성 목표 달성</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/15">
            <div className="text-xs font-bold text-blue-300 mb-1">3. 후속 파급성과 창출</div>
            <p className="text-[11px] text-slate-300">종료 후 3개년 추적조사 기반 국내 기업의 현지 수주 연계</p>
          </div>
        </div>
      </div>
    </div>
  );
};
