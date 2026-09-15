import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  User,
  ApprovalRequest,
  ChangeHistory,
  TrackingSurvey,
  ProjectBudget,
  ProjectSchedule,
  ProjectDocument,
  RoleType,
  ToastItem,
} from '../types';
import {
  USERS,
  INITIAL_PROJECTS,
  INITIAL_APPROVALS,
  INITIAL_CHANGE_HISTORIES,
} from '../data/mockData';

interface AppContextType {
  // Navigation & Role
  currentView: 'portal' | 'admin';
  setCurrentView: (view: 'portal' | 'admin') => void;
  portalTab: 'home' | 'projects' | 'outputs' | 'stats' | 'policy';
  setPortalTab: (tab: 'home' | 'projects' | 'outputs' | 'stats' | 'policy') => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: RoleType) => void;

  // Data
  projects: Project[];
  approvals: ApprovalRequest[];
  changeHistories: ChangeHistory[];

  // Project Actions
  addProject: (newProj: Partial<Project>, relationWithBaseId?: string) => Project;
  updateProject: (projectId: string, updates: Partial<Project>, comment?: string, asApproval?: boolean) => void;
  deleteProject: (projectId: string) => boolean;

  // Modals & Active selections
  activeProjectDetailId: string | null;
  setActiveProjectDetailId: (id: string | null) => void;
  compareReproposalData: { base: Project; target: Project } | null;
  setCompareReproposalData: (data: { base: Project; target: Project } | null) => void;

  // Approval Actions
  approveRequest: (apprId: number, comment?: string) => void;
  rejectRequest: (apprId: number, comment: string) => void;
  supplementRequest: (apprId: number, comment: string) => void;
  processApproval: (apprId: number, status: 'APPROVED' | 'REJECTED' | 'SUPPLEMENT', comment?: string) => void;

  // Sub-entity Actions
  addTrackingSurvey: (projectId: string, survey: Omit<TrackingSurvey, 'surveyId'>) => void;
  updateBudget: (projectId: string, budgetSeq: number, updates: Partial<ProjectBudget>) => void;
  updateSchedule: (projectId: string, scheduleSeq: number, updates: Partial<ProjectSchedule>) => void;
  toggleDocumentPublic: (docId: number) => void;
  addDocument: (projectId: string, doc: Partial<ProjectDocument>) => void;

  // Utility
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  exportToCsv: (rows: Record<string, any>[], filename: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PROJECTS: 'KIDC_ODA_PROJECTS_V1',
  APPROVALS: 'KIDC_ODA_APPROVALS_V1',
  CHANGES: 'KIDC_ODA_CHANGES_V1',
  USER_ID: 'KIDC_ODA_USER_ID',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'portal' | 'admin'>('portal');
  const [portalTab, setPortalTab] = useState<'home' | 'projects' | 'outputs' | 'stats' | 'policy'>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_ID);
    return USERS.find((u) => u.userId === saved) || USERS[0]; // default: 김태동 (R-02)
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => ({
            ...p,
            relations: p.relations || [],
            stages: p.stages || [],
            schedules: p.schedules || [],
            budgets: p.budgets || [],
            documents: p.documents || [],
            indicators: p.indicators || [],
            trackingSurveys: p.trackingSurveys || [],
          }));
        }
      }
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS);
      return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
    } catch {
      return INITIAL_APPROVALS;
    }
  });

  const [changeHistories, setChangeHistories] = useState<ChangeHistory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHANGES);
      return saved ? JSON.parse(saved) : INITIAL_CHANGE_HISTORIES;
    } catch {
      return INITIAL_CHANGE_HISTORIES;
    }
  });

  const [activeProjectDetailId, setActiveProjectDetailId] = useState<string | null>(null);
  const [compareReproposalData, setCompareReproposalData] = useState<{ base: Project; target: Project } | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANGES, JSON.stringify(changeHistories));
  }, [changeHistories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ID, currentUser.userId);
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastItem = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const switchRole = (role: RoleType) => {
    const user = USERS.find((u) => u.role === role) || USERS[0];
    setCurrentUser(user);
    showToast(`역할이 '${user.roleNm} (${user.userNm})' (으)로 변경되었습니다.`, 'info');
  };

  // Add Project
  const addProject = (newProj: Partial<Project>, relationWithBaseId?: string): Project => {
    const currentYear = new Date().getFullYear();
    const nextSeq = projects.length + 1;
    const generatedId = `ODA-${currentYear}-${String(nextSeq).padStart(4, '0')}`;

    let relations = newProj.relations || [];

    // If this is a reproposal or linked project
    if (relationWithBaseId) {
      const baseProj = projects.find((p) => p.projectId === relationWithBaseId);
      if (baseProj) {
        relations = [
          ...relations,
          {
            relationSeq: Date.now(),
            baseProjectId: baseProj.projectId,
            targetProjectId: generatedId,
            relationType: 'REPROPOSAL',
            proposalRound: 2,
            changeSummary: `원사업(${baseProj.projectId}: ${baseProj.projectNm}) 보완 재제안`,
            diffDetails: [
              {
                field: 'budgetAmt',
                label: '총 사업비',
                before: baseProj.budgetAmt.toLocaleString() + '원',
                after: (newProj.budgetAmt || 0).toLocaleString() + '원',
                comment: '사업비 증감 조정',
              },
              {
                field: 'projectTypeCd',
                label: '사업 유형',
                before: baseProj.projectTypeNm,
                after: newProj.projectTypeNm || '',
                comment: '과업 추진방식 보완',
              },
            ],
          },
        ];
      }
    }

    const created: Project = {
      projectSeq: nextSeq,
      projectId: generatedId,
      projectNm: newProj.projectNm || '신규 국토교통 ODA 사업',
      countryCd: newProj.countryCd || 'VN',
      countryNm: newProj.countryNm || '베트남',
      regionCd: newProj.regionCd || 'SEA',
      regionNm: newProj.regionNm || '동남아시아',
      sectorCd: newProj.sectorCd || 'URBAN',
      sectorNm: newProj.sectorNm || '도시',
      workTypeCd: newProj.workTypeCd || 'CONSULT',
      workTypeNm: newProj.workTypeNm || '마스터플랜',
      projectTypeCd: newProj.projectTypeCd || 'CONSULTING',
      projectTypeNm: newProj.projectTypeNm || '개발컨설팅(MP/FS)',
      orderingAgencyNm: newProj.orderingAgencyNm || '국토교통부',
      proposingAgencyNm: newProj.proposingAgencyNm || '수원국 주무관청',
      executingAgencyNm: newProj.executingAgencyNm || '선정중',
      budgetAmt: Number(newProj.budgetAmt) || 1500000000,
      budgetCurrency: newProj.budgetCurrency || 'KRW',
      startYmd: newProj.startYmd || `${currentYear}-03-01`,
      endYmd: newProj.endYmd || `${currentYear + 1}-12-31`,
      stageCd: newProj.stageCd || 'DISCOVERED',
      stageNm: newProj.stageNm || '사업발굴 (N-2년)',
      statusCd: 'NORMAL',
      statusNm: '정상진행',
      mainManagerId: currentUser.userId,
      mainManagerNm: currentUser.userNm,
      subManagerId: 'lee.hj',
      subManagerNm: '이혜진',
      isPublic: newProj.isPublic || 'N',
      apprStatusCd: 'APPROVED',
      overview: newProj.overview || '',
      expectedEffect: newProj.expectedEffect || '',
      relations,
      budgets: [
        {
          budgetSeq: Date.now(),
          projectId: generatedId,
          fiscalYear: currentYear,
          budgetAmt: Number(newProj.budgetAmt) || 1500000000,
          contractAmt: Math.round((Number(newProj.budgetAmt) || 1500000000) * 0.94),
          executedAmt: 0,
          currency: 'KRW',
        },
      ],
      stages: [
        {
          stageSeq: Date.now(),
          projectId: generatedId,
          stageCd: newProj.stageCd || 'DISCOVERED',
          stageNm: newProj.stageNm || '사업발굴 (N-2년)',
          targetYear: currentYear,
          statusCd: 'CREATED',
          statusNm: '신규 등록 완료',
          decisionYmd: new Date().toISOString().slice(0, 10),
          decisionReason: '신규 국토교통 ODA 발굴 등록',
          processedBy: currentUser.userNm,
          processedAt: new Date().toLocaleString(),
        },
      ],
      schedules: [
        {
          scheduleSeq: Date.now() + 1,
          projectId: generatedId,
          scheduleNm: '예비타당성 조사 및 수원국 사전협의',
          stageCd: newProj.stageCd || 'DISCOVERED',
          planYmd: `${currentYear}-09-30`,
          delayYn: 'N',
          notifyBeforeDays: 14,
        },
      ],
      documents: [],
      indicators: [],
      trackingSurveys: [],
    };

    setProjects((prev) => [created, ...prev]);

    // Record in Change History (sy_change_hist)
    const newHist: ChangeHistory = {
      histSeq: Date.now(),
      targetType: 'PROJECT',
      targetId: generatedId,
      targetNm: created.projectNm,
      fieldNm: 'projectCreate',
      fieldLabel: '사업 신규 등록',
      beforeVal: '-',
      afterVal: `${created.projectId} 등록`,
      changeType: 'INSERT',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
    };
    setChangeHistories((prev) => [newHist, ...prev]);

    showToast(`신규 사업 [${generatedId}] 등록이 완료되었습니다.`, 'success');
    return created;
  };

  // Update Project (Supports direct update OR approval submission if role R-02)
  const updateProject = (
    projectId: string,
    updates: Partial<Project>,
    comment?: string,
    asApproval: boolean = false
  ) => {
    const target = projects.find((p) => p.projectId === projectId);
    if (!target) return;

    if (asApproval) {
      // Create Approval Request
      const newAppr: ApprovalRequest = {
        apprId: Date.now(),
        targetType: 'PROJECT',
        targetId: projectId,
        targetTitle: target.projectNm,
        apprLineId: 1,
        title: `[사업정보 변경 승인요청] ${target.projectNm}`,
        beforePayloadJson: {
          budgetAmt: target.budgetAmt,
          stageCd: target.stageCd,
          endYmd: target.endYmd,
          isPublic: target.isPublic,
        },
        payloadJson: updates,
        statusCd: 'PENDING',
        statusNm: '결재 대기중',
        requestedBy: currentUser.userId,
        requestedByNm: `${currentUser.userNm} (${currentUser.positionNm})`,
        requestedAt: new Date().toLocaleString(),
        comment: comment || '사업정보 변경에 대한 승인을 요청합니다.',
      };

      setApprovals((prev) => [newAppr, ...prev]);
      showToast(`승인권자(부서장)에게 결재 상신이 완료되었습니다. (결재번호: ${newAppr.apprId})`, 'info');
      return;
    }

    // Direct update
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        return { ...p, ...updates };
      })
    );

    // Audit logs for changed fields
    const updatedEntries = Object.entries(updates);
    const newHistories: ChangeHistory[] = updatedEntries.map(([key, val], idx) => ({
      histSeq: Date.now() + idx,
      targetType: 'PROJECT',
      targetId: projectId,
      targetNm: target.projectNm,
      fieldNm: key,
      fieldLabel: key === 'budgetAmt' ? '사업비' : key === 'stageCd' ? '추진단계' : key === 'endYmd' ? '사업종료일' : key,
      beforeVal: String((target as any)[key] ?? '-'),
      afterVal: String(val ?? '-'),
      changeType: 'UPDATE',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
    }));

    setChangeHistories((prev) => [...newHistories, ...prev]);
    showToast(`사업 [${projectId}] 정보가 수정되었습니다.`, 'success');
  };

  const deleteProject = (projectId: string): boolean => {
    const target = projects.find((p) => p.projectId === projectId);
    if (!target) return false;

    setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
    const hist: ChangeHistory = {
      histSeq: Date.now(),
      targetType: 'PROJECT',
      targetId: projectId,
      targetNm: target.projectNm,
      fieldNm: 'delete',
      fieldLabel: '사업 삭제',
      beforeVal: target.projectNm,
      afterVal: '삭제됨',
      changeType: 'DELETE',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
    };
    setChangeHistories((prev) => [hist, ...prev]);
    showToast(`사업 [${projectId}]이(가) 삭제되었습니다.`, 'warning');
    return true;
  };

  // Approval Handlers
  const approveRequest = (apprId: number, comment?: string) => {
    const appr = approvals.find((a) => a.apprId === apprId);
    if (!appr) return;

    // Apply payload to project if target is PROJECT
    if (appr.targetType === 'PROJECT') {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.projectId !== appr.targetId) return p;
          return { ...p, ...appr.payloadJson };
        })
      );
    }

    setApprovals((prev) =>
      prev.map((a) => {
        if (a.apprId !== apprId) return a;
        return {
          ...a,
          statusCd: 'APPROVED',
          statusNm: '승인 완료',
          approverId: currentUser.userId,
          approverNm: `${currentUser.userNm} (${currentUser.positionNm})`,
          processedAt: new Date().toLocaleString(),
          comment: comment || a.comment,
        };
      })
    );

    // Audit log
    const hist: ChangeHistory = {
      histSeq: Date.now(),
      targetType: appr.targetType,
      targetId: appr.targetId,
      targetNm: appr.targetTitle,
      fieldNm: 'approval',
      fieldLabel: '결재 승인 반영',
      beforeVal: JSON.stringify(appr.beforePayloadJson || {}),
      afterVal: JSON.stringify(appr.payloadJson),
      changeType: 'UPDATE',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
      apprId,
    };
    setChangeHistories((prev) => [hist, ...prev]);
    showToast(`결재 [${appr.title}] 건이 최종 승인되어 데이터에 반영되었습니다.`, 'success');
  };

  const rejectRequest = (apprId: number, comment: string) => {
    setApprovals((prev) =>
      prev.map((a) => {
        if (a.apprId !== apprId) return a;
        return {
          ...a,
          statusCd: 'RETURNED',
          statusNm: '반려',
          approverId: currentUser.userId,
          approverNm: `${currentUser.userNm} (${currentUser.positionNm})`,
          processedAt: new Date().toLocaleString(),
          comment: comment || '반려되었습니다.',
        };
      })
    );
    showToast(`결재 건이 반려 처리되었습니다.`, 'warning');
  };

  const supplementRequest = (apprId: number, comment: string) => {
    setApprovals((prev) =>
      prev.map((a) => {
        if (a.apprId !== apprId) return a;
        return {
          ...a,
          statusCd: 'SUPPLEMENT',
          statusNm: '보완요청',
          approverId: currentUser.userId,
          approverNm: `${currentUser.userNm} (${currentUser.positionNm})`,
          processedAt: new Date().toLocaleString(),
          comment: comment || '보완 요청되었습니다.',
        };
      })
    );
    showToast(`상신자에게 보완요청 통보를 전송했습니다.`, 'info');
  };

  const processApproval = (
    apprId: number,
    status: 'APPROVED' | 'REJECTED' | 'SUPPLEMENT',
    comment: string = ''
  ) => {
    if (status === 'APPROVED') {
      approveRequest(apprId, comment);
    } else if (status === 'REJECTED') {
      rejectRequest(apprId, comment);
    } else {
      supplementRequest(apprId, comment);
    }
  };

  // Add Tracking Survey (F-173: 차수별 누적 관리)
  const addTrackingSurvey = (projectId: string, survey: Omit<TrackingSurvey, 'surveyId'>) => {
    const surveyId = Date.now();
    const newSurvey: TrackingSurvey = { ...survey, surveyId };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        const existingSurveys = p.trackingSurveys || [];
        // Check unique (projectId, surveyTypeCd, roundNo)
        const filtered = existingSurveys.filter(
          (s) => !(s.surveyTypeCd === newSurvey.surveyTypeCd && s.roundNo === newSurvey.roundNo)
        );
        return {
          ...p,
          trackingSurveys: [...filtered, newSurvey].sort((a, b) => a.roundNo - b.roundNo),
        };
      })
    );

    const hist: ChangeHistory = {
      histSeq: Date.now(),
      targetType: 'PERFORMANCE',
      targetId: projectId,
      targetNm: projects.find((p) => p.projectId === projectId)?.projectNm,
      fieldNm: 'trackingSurvey',
      fieldLabel: `${survey.surveyTypeNm} (${survey.roundNo}차)`,
      beforeVal: '-',
      afterVal: `조사기준일: ${survey.baseYmd}, 유지여부: ${survey.sustainYn}, 후속수주: ${survey.krCompanyOrderYn}`,
      changeType: 'INSERT',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
    };
    setChangeHistories((prev) => [hist, ...prev]);
    showToast(`${survey.roundNo}차 사후 추적조사 결과가 누적 등록되었습니다.`, 'success');
  };

  // Budget update
  const updateBudget = (projectId: string, budgetSeq: number, updates: Partial<ProjectBudget>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        const updatedBudgets = (p.budgets || []).map((b) => {
          if (b.budgetSeq !== budgetSeq) return b;
          return { ...b, ...updates };
        });
        return { ...p, budgets: updatedBudgets };
      })
    );
    showToast('예산 집행 정보가 업데이트되었습니다.', 'success');
  };

  // Schedule update
  const updateSchedule = (projectId: string, scheduleSeq: number, updates: Partial<ProjectSchedule>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        const updatedSchedules = (p.schedules || []).map((s) => {
          if (s.scheduleSeq !== scheduleSeq) return s;
          return { ...s, ...updates };
        });
        return { ...p, schedules: updatedSchedules };
      })
    );
    showToast('사업 일정이 수정되었습니다.', 'success');
  };

  // Document Toggle Public
  const toggleDocumentPublic = (docId: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        const updatedDocs = (p.documents || []).map((d) => {
          if (d.docId !== docId) return d;
          const next = d.isPublic === 'Y' ? 'N' : 'Y';
          return { ...d, isPublic: next as 'Y' | 'N' };
        });
        return { ...p, documents: updatedDocs };
      })
    );
    showToast('문서의 대국민 홈페이지 공개 여부가 변경되었습니다.', 'info');
  };

  // Add Document
  const addDocument = (projectId: string, doc: Partial<ProjectDocument>) => {
    const target = projects.find((p) => p.projectId === projectId);
    if (!target) return;

    const newDoc: ProjectDocument = {
      docId: Date.now(),
      projectId,
      projectNm: target.projectNm,
      docTypeCd: doc.docTypeCd || 'REPORT',
      docTypeNm: doc.docTypeNm || '보고서',
      stageCd: doc.stageCd || target.stageCd,
      fileNm: doc.fileNm || '첨부문서.pdf',
      fileSize: doc.fileSize || '3.5 MB',
      isPublic: doc.isPublic || 'Y',
      createdAt: new Date().toISOString().slice(0, 10),
      createdBy: currentUser.userNm,
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        return { ...p, documents: [newDoc, ...(p.documents || [])] };
      })
    );
    showToast(`신규 산출물 [${newDoc.fileNm}]이(가) 등록되었습니다.`, 'success');
  };

  // CSV / Excel Export Helper
  const exportToCsv = (rows: Record<string, any>[], filename: string) => {
    if (!rows || rows.length === 0) {
      showToast('내보낼 데이터가 없습니다.', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Excel in Korean
      [
        headers.join(','),
        ...rows.map((row) =>
          headers
            .map((field) => {
              const val = row[field] ?? '';
              return `"${String(val).replace(/"/g, '""')}"`;
            })
            .join(',')
        ),
      ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`[${filename}.csv] 파일로 성공적으로 다운로드되었습니다.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        portalTab,
        setPortalTab,
        adminTab,
        setAdminTab,
        currentUser,
        setCurrentUser,
        switchRole,
        projects,
        approvals,
        changeHistories,
        addProject,
        updateProject,
        deleteProject,
        activeProjectDetailId,
        setActiveProjectDetailId,
        compareReproposalData,
        setCompareReproposalData,
        approveRequest,
        rejectRequest,
        supplementRequest,
        processApproval,
        addTrackingSurvey,
        updateBudget,
        updateSchedule,
        toggleDocumentPublic,
        addDocument,
        toast: toasts[toasts.length - 1] || null,
        toasts,
        showToast,
        exportToCsv,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
