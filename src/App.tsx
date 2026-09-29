import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PortalHeader } from './components/portal/PortalHeader';
import { PortalHome } from './components/portal/PortalHome';
import { PortalProjectDB } from './components/portal/PortalProjectDB';
import { PortalOutputs } from './components/portal/PortalOutputs';
import { PortalStats } from './components/portal/PortalStats';
import { PortalPolicy } from './components/portal/PortalPolicy';

import { AdminHeader } from './components/admin/AdminHeader';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { DashboardView } from './components/admin/DashboardView';
import { ProjectListView } from './components/admin/ProjectListView';
import { StagePipelineView } from './components/admin/StagePipelineView';
import { ScheduleManagementView } from './components/admin/ScheduleManagementView';
import { BudgetManagementView } from './components/admin/BudgetManagementView';
import { DocumentManagementView } from './components/admin/DocumentManagementView';
import { ApprovalManagementView } from './components/admin/ApprovalManagementView';
import { PerformanceManagementView } from './components/admin/PerformanceManagementView';
import { PivotStatsView } from './components/admin/PivotStatsView';
import { AuditHistoryView } from './components/admin/AuditHistoryView';
import { SystemAdminView } from './components/admin/SystemAdminView';
import { RfpScenariosView } from './components/admin/RfpScenariosView';

import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { ReproposalCompareModal } from './components/modals/ReproposalCompareModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, portalTab, adminTab, toasts = [] } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
        {(toasts || []).map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl border flex items-center space-x-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-950 text-rose-200 border-rose-800'
                : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Global Modals */}
      <ProjectDetailModal />
      <ReproposalCompareModal />

      {/* VIEW: Public Portal */}
      {currentView === 'portal' && (
        <div className="flex-1 flex flex-col">
          <PortalHeader />

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
            {portalTab === 'home' && <PortalHome />}
            {portalTab === 'projects' && <PortalProjectDB />}
            {portalTab === 'outputs' && <PortalOutputs />}
            {portalTab === 'stats' && <PortalStats />}
            {portalTab === 'policy' && <PortalPolicy />}
          </main>

          {/* Portal Footer */}
          <footer className="bg-slate-900 text-slate-400 text-xs mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-white text-sm mb-1">
                    국토교통부 | 해외건설협회 | 국제개발협력센터 (KIDC)
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    서울특별시 중구 세종대로 9길 41 대한상공회의소회관 10층 | 대표전화: 02-3406-1188<br />
                    본 국토교통 ODA 사업DB 관리시스템은 해외건설협회 클라우드 인프라를 통해 안정적으로 운영됩니다.
                  </p>
                </div>
                <div className="text-[11px] text-slate-500">
                  Copyright © Ministry of Land, Infrastructure and Transport & ICAK. All Rights Reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* VIEW: Admin Management System */}
      {currentView === 'admin' && (
        <div className="flex-1 flex flex-col">
          <AdminHeader />

          <div className="flex-1 flex overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
              {adminTab === 'rfp-scenarios' && <RfpScenariosView />}
              {adminTab === 'dashboard' && <DashboardView />}
              {adminTab === 'projects' && <ProjectListView />}
              {adminTab === 'stages' && <StagePipelineView />}
              {adminTab === 'schedules' && <ScheduleManagementView />}
              {adminTab === 'budgets' && <BudgetManagementView />}
              {adminTab === 'documents' && <DocumentManagementView />}
              {adminTab === 'approvals' && <ApprovalManagementView />}
              {adminTab === 'performance' && <PerformanceManagementView />}
              {adminTab === 'pivot' && <PivotStatsView />}
              {adminTab === 'audit' && <AuditHistoryView />}
              {adminTab === 'system' && <SystemAdminView />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
