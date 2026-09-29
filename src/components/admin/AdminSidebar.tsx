import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  LayoutDashboard,
  Database,
  GitPullRequest,
  Calendar,
  DollarSign,
  FileText,
  CheckSquare,
  TrendingUp,
  Sliders,
  History,
  Settings,
  ChevronRight,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { adminTab, setAdminTab, approvals, projects } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.statusCd === 'PENDING').length;
  const delayedSchedulesCount = projects.reduce((acc, p) => {
    const delayed = (p.schedules || []).filter((s) => s.delayYn === 'Y').length;
    return acc + delayed;
  }, 0);

  const menuItems = [
    {
      key: 'rfp-scenarios',
      label: '주요 업무',
      icon: Sparkles,
      badge: '5대필수',
      badgeColor: 'bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 font-black tracking-tighter',
    },
    { key: 'dashboard', label: '종합 대시보드', icon: LayoutDashboard },
    { key: 'projects', label: '사업정보 관리 (F-101)', icon: Database, badge: projects.length },
    { key: 'stages', label: '단계별 추진현황 (F-110)', icon: GitPullRequest },
    { key: 'schedules', label: '일정 관리 (F-120)', icon: Calendar, badge: delayedSchedulesCount > 0 ? `${delayedSchedulesCount}지연` : undefined, badgeColor: 'bg-rose-500 text-white' },
    { key: 'budgets', label: '예산 및 계약 (F-130)', icon: DollarSign },
    { key: 'documents', label: '문서 및 산출물 (F-136)', icon: FileText },
    { key: 'approvals', label: '결재 관리 (F-145)', icon: CheckSquare, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
    { key: 'performance', label: '성과 및 추적조사 (F-173)', icon: TrendingUp },
    { key: 'pivot', label: '통계 및 동적 피봇 (F-151)', icon: Sliders },
    { key: 'audit', label: '변경이력 추적 (F-140)', icon: History },
    { key: 'system', label: '시스템 및 권한 (F-301)', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-57px)] border-r border-slate-800">
      {/* Navigation section */}
      <div className="p-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider px-4 pt-4">
        사업DB 전 주기 메뉴
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = adminTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setAdminTab(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    item.badgeColor || (active ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cloud & Infrastructure badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950 text-[11px] text-slate-500 space-y-1">
        <div className="text-slate-400 font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>해외건설협회 클라우드 v1.2</span>
        </div>
        <p className="text-[10px] text-slate-500">
          표준 감사로그 AOP 자동 적재 중 (sy_change_hist)
        </p>
      </div>
    </aside>
  );
};
