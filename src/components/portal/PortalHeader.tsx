import React from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, Database, FileText, BarChart3, BookOpen, Shield, LogIn, ExternalLink, ChevronRight } from 'lucide-react';
import { USERS } from '../../data/mockData';

export const PortalHeader: React.FC = () => {
  const { portalTab, setPortalTab, setCurrentView, currentUser, switchRole } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Ministry Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-200">국토교통부 | 해외건설협회</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">국제개발협력센터 (KIDC) 공식 ODA 대국민 포털</span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Quick Role Switcher for seamless evaluator testing */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">테스트 권한:</span>
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value as any)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] focus:ring-1 focus:ring-blue-400 cursor-pointer"
            >
              {USERS.map((u) => (
                <option key={u.userId} value={u.role}>
                  {u.roleNm} ({u.userNm})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setCurrentView('admin')}
            className="flex items-center space-x-1 px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[11px] transition-colors"
          >
            <Shield className="w-3 h-3" />
            <span>사업DB 관리시스템 (Admin)</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main GNB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setPortalTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight">
                  국토교통 ODA
                </span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full">
                  KIDC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                국제개발협력센터 사업DB 통합 정보망
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {[
              { key: 'home', label: '포털 홈', icon: Globe },
              { key: 'projects', label: '사업DB', icon: Database },
              { key: 'outputs', label: '사업산출물', icon: FileText },
              { key: 'stats', label: '사업통계', icon: BarChart3 },
              { key: 'policy', label: '성과·평가 및 법령', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = portalTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setPortalTab(tab.key as any)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Admin Link */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setCurrentView('admin')}
              className="px-2.5 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>관리시스템</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
