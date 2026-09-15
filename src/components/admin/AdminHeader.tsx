import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Globe,
  Bell,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { USERS } from '../../data/mockData';

export const AdminHeader: React.FC = () => {
  const {
    setCurrentView,
    currentUser,
    switchRole,
    approvals,
    projects,
    setAdminTab,
    setActiveProjectDetailId,
  } = useApp();

  // Count pending approvals
  const pendingApprovalsCount = approvals.filter((a) => a.statusCd === 'PENDING').length;

  // Count delayed schedules
  const delayedSchedulesCount = projects.reduce((acc, p) => {
    const delayed = (p.schedules || []).filter((s) => s.delayYn === 'Y').length;
    return acc + delayed;
  }, 0);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm md:text-base text-white tracking-tight">
                국토교통 ODA 사업DB 관리시스템
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded border border-blue-400/30">
                KIDC ADMIN
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              해외건설협회 클라우드 인프라 기반 사업 전 주기 통합 DB
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3">
          {/* Notifications: Pending Approvals & Delays */}
          <div className="flex items-center space-x-2">
            {pendingApprovalsCount > 0 && (
              <button
                onClick={() => setAdminTab('approvals')}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="결재 대기 목록 바로가기"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>결재대기 {pendingApprovalsCount}건</span>
              </button>
            )}

            {delayedSchedulesCount > 0 && (
              <button
                onClick={() => setAdminTab('schedules')}
                className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="지연 공정 목록 바로가기"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>지연일정 {delayedSchedulesCount}건</span>
              </button>
            )}
          </div>

          {/* User Role Switcher for Test Evaluation */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1 flex items-center space-x-2">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-slate-200">{currentUser.userNm}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-900 text-blue-200 rounded font-mono">
              {currentUser.role}
            </span>
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value as any)}
              className="bg-slate-900 text-slate-300 border border-slate-700 text-xs rounded px-1.5 py-0.5 cursor-pointer focus:ring-1 focus:ring-blue-500"
              title="역할 전환"
            >
              {USERS.map((u) => (
                <option key={u.userId} value={u.role}>
                  {u.roleNm} ({u.userNm})
                </option>
              ))}
            </select>
          </div>

          {/* Switch to Public Portal */}
          <button
            onClick={() => setCurrentView('portal')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">대국민 포털로 이동</span>
            <span className="sm:hidden">포털</span>
          </button>
        </div>
      </div>
    </header>
  );
};
