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

  // ========================================================
  // RFP 5대 핵심 시나리오 전용 액션 함수
  // ========================================================
  // 1. 미선정 사업 재제안
  createReproposal: (
    baseProjectId: string,
    reproposalData: {
      projectNm: string;
      budgetAmt: number;
      projectTypeNm?: string;
      countermeasurePlan: string;
      overview?: string;
    }
  ) => Project | null;
  addDeliberationRecord: (
    projectId: string,
    record: Omit<import('../types').DeliberationRecord, 'delibSeq'>
  ) => void;

  // 2. 등록·수정·결재·확정
  submitApprovalStep: (
    apprId: number,
    action: 'APPROVE' | 'REJECT' | 'SUPPLEMENT',
    comment?: string
  ) => void;
  resubmitApproval: (
    apprId: number,
    updatedPayload: Record<string, any>,
    comment: string
  ) => void;
  finalizeConfirmedVersion: (projectId: string, summary: string) => void;

  // 3. 계약·집행·낙찰차액
  saveSavingsPlan: (
    projectId: string,
    budgetSeq: number,
    plan: {
      title: string;
      plannedAmt: number;
      category: string;
      rationale: string;
      approveImmediately?: boolean;
    }
  ) => void;
  approveSavingsPlan: (
    projectId: string,
    budgetSeq: number,
    approved: boolean,
    comment?: string
  ) => void;
  addBudgetDisbursement: (
    projectId: string,
    budgetSeq: number,
    disbursement: {
      title: string;
      paidYmd: string;
      paidAmt: number;
      category: 'ADVANCE' | 'INTERIM' | 'FINAL';
      categoryNm: string;
      invoiceDocNo?: string;
    }
  ) => void;

  // 4. PDM과 종료 후 성과
  updatePdmActual: (
    projectId: string,
    indicatorId: number,
    actualVal: number,
    evidenceDocNm: string
  ) => void;
  setEndlineEvaluation: (
    projectId: string,
    evalData: import('../types').EndlineEvaluation
  ) => void;

  // 5. 홈페이지 공개 및 정정 이력
  reviewPublicDisclosure: (
    projectId: string,
    review: import('../types').DisclosureReview
  ) => void;
  approvePublicDisclosure: (
    projectId: string,
    scope: 'FULL' | 'SUMMARY' | 'NONE',
    approvalComment?: string
  ) => void;
  addPublicErrata: (
    projectId: string,
    errata: {
      targetField: string;
      fieldLabel: string;
      beforeVal: string;
      afterVal: string;
      reason: string;
    }
  ) => void;

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

  // ========================================================
  // RFP 5대 핵심 시나리오 전용 액션 구현체
  // ========================================================

  // 1. 미선정 사업 재제안 (원사업 보존 -> 재제안 생성 -> 변경 비교 -> 재심의 결과 누적)
  const createReproposal = (
    baseProjectId: string,
    reproposalData: {
      projectNm: string;
      budgetAmt: number;
      projectTypeNm?: string;
      countermeasurePlan: string;
      overview?: string;
    }
  ): Project | null => {
    const baseProj = projects.find((p) => p.projectId === baseProjectId);
    if (!baseProj) {
      showToast('원사업을 찾을 수 없습니다.', 'error');
      return null;
    }

    const currentYear = new Date().getFullYear();
    const nextSeq = projects.length + 1;
    const generatedId = `ODA-${currentYear}-${String(nextSeq).padStart(4, '0')}`;

    // 1-1. 원사업 보존 (영구 불변 보존본 플래그 및 탈락 심의이력 확인)
    const baseDeliberations = baseProj.deliberations && baseProj.deliberations.length > 0
      ? baseProj.deliberations
      : [
          {
            delibSeq: Date.now() - 1000,
            projectId: baseProj.projectId,
            roundNo: 1,
            committeeNm: '국토교통 ODA 실무기획위원회 (1차 심의)',
            delibYmd: `${currentYear - 1}-09-15`,
            resultCd: 'REJECTED' as const,
            resultNm: '미선정(탈락)',
            mainReasons: '과업 범위의 구체성 부족 및 수원국 재원 매칭 확약 미비',
            countermeasurePlan: reproposalData.countermeasurePlan,
            docNo: `MOLIT-ODA-${currentYear - 1}-DEC`,
          },
        ];

    // 1-2. 변경 비교 내역 생성 (Diff comparison)
    const diffDetails = [
      {
        field: 'budgetAmt',
        label: '총 사업비',
        before: `${baseProj.budgetAmt.toLocaleString()}원`,
        after: `${reproposalData.budgetAmt.toLocaleString()}원`,
        comment: '실증 테스트베드 및 현지 조사비 증감 반영',
      },
      {
        field: 'projectNm',
        label: '사업명',
        before: baseProj.projectNm,
        after: reproposalData.projectNm,
        comment: '과업 타겟 및 추진방식 구체화',
      },
      {
        field: 'countermeasure',
        label: '1차 탈락사유 보완대책',
        before: '1차 심의 미선정(보완 요구)',
        after: reproposalData.countermeasurePlan,
        comment: '수원국 협력체계 및 실효성 보완 확약',
      },
    ];

    // 1-3. 신규 재제안 사업 생성
    const newReproposalProj: Project = {
      projectSeq: nextSeq,
      projectId: generatedId,
      projectNm: reproposalData.projectNm,
      countryCd: baseProj.countryCd,
      countryNm: baseProj.countryNm,
      regionCd: baseProj.regionCd,
      regionNm: baseProj.regionNm,
      sectorCd: baseProj.sectorCd,
      sectorNm: baseProj.sectorNm,
      workTypeCd: baseProj.workTypeCd,
      workTypeNm: baseProj.workTypeNm,
      projectTypeCd: baseProj.projectTypeCd,
      projectTypeNm: reproposalData.projectTypeNm || baseProj.projectTypeNm,
      orderingAgencyNm: baseProj.orderingAgencyNm,
      proposingAgencyNm: baseProj.proposingAgencyNm,
      executingAgencyNm: '선정 예정',
      budgetAmt: reproposalData.budgetAmt,
      budgetCurrency: 'KRW',
      startYmd: `${currentYear}-04-01`,
      endYmd: `${currentYear + 1}-10-31`,
      stageCd: 'PRELIM',
      stageNm: '예비검토 (N-1년)',
      statusCd: 'NORMAL',
      statusNm: '2차 재제안 심의 준비',
      mainManagerId: currentUser.userId,
      mainManagerNm: currentUser.userNm,
      subManagerId: 'lee.hj',
      subManagerNm: '이혜진',
      isPublic: 'N',
      apprStatusCd: 'PENDING',
      overview: reproposalData.overview || `[원사업 ${baseProj.projectId} 보완 재제안] ${reproposalData.countermeasurePlan}`,
      expectedEffect: baseProj.expectedEffect,
      relations: [
        {
          relationSeq: Date.now(),
          baseProjectId: baseProj.projectId,
          targetProjectId: generatedId,
          relationType: 'REPROPOSAL',
          proposalRound: 2,
          changeSummary: `원사업(${baseProj.projectId}) 탈락 사유 보완 후 2차 재제안 생성`,
          diffDetails,
        },
      ],
      // 1-4. 재심의 결과 누적 (1차 탈락 사유 계승 + 2차 재심의 상정 준비 기록)
      deliberations: [
        ...baseDeliberations,
        {
          delibSeq: Date.now() + 1,
          projectId: generatedId,
          roundNo: 2,
          committeeNm: `제45차 국제개발협력위원회 (2차 재심의 예정)`,
          delibYmd: `${currentYear}-11-20`,
          resultCd: 'CONDITION_SELECTED',
          resultNm: '조건부선정(재심의 통과 유력)',
          mainReasons: '1차 심의 지적사항에 대한 보완계획 수립 확인',
          countermeasurePlan: reproposalData.countermeasurePlan,
          docNo: `CIDC-${currentYear}-PRE-01`,
        },
      ],
      budgets: [
        {
          budgetSeq: Date.now() + 2,
          projectId: generatedId,
          fiscalYear: currentYear,
          budgetAmt: reproposalData.budgetAmt,
          contractAmt: Math.round(reproposalData.budgetAmt * 0.94),
          savingAmt: Math.round(reproposalData.budgetAmt * 0.06),
          executedAmt: 0,
          currency: 'KRW',
        },
      ],
      schedules: [
        {
          scheduleSeq: Date.now() + 3,
          projectId: generatedId,
          scheduleNm: '재제안 심의 상정 및 수원국 실무협의',
          stageCd: 'PRELIM',
          planYmd: `${currentYear}-09-30`,
          delayYn: 'N',
          notifyBeforeDays: 14,
        },
      ],
      documents: [],
      indicators: [],
      trackingSurveys: [],
    };

    // Update base project to enforce preservation
    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.projectId === baseProj.projectId) {
          return {
            ...p,
            isPreserved: true,
            preservedAt: p.preservedAt || new Date().toLocaleString(),
            preservationReason: '미선정 원사업 영구 보존 체계',
            deliberations: baseDeliberations,
            relations: [
              ...(p.relations || []).filter((r) => r.targetProjectId !== generatedId),
              {
                relationSeq: Date.now() + 4,
                baseProjectId: baseProj.projectId,
                targetProjectId: generatedId,
                relationType: 'REPROPOSAL' as const,
                proposalRound: 2,
                changeSummary: `신규 재제안 과제 [${generatedId}] 생성 연계됨`,
                diffDetails,
              },
            ],
          };
        }
        return p;
      });
      return [newReproposalProj, ...updated];
    });

    // Automatically open the Side-by-Side comparison modal
    setCompareReproposalData({ base: baseProj, target: newReproposalProj });

    const hist: ChangeHistory = {
      histSeq: Date.now(),
      targetType: 'PROJECT',
      targetId: generatedId,
      targetNm: newReproposalProj.projectNm,
      fieldNm: 'reproposal',
      fieldLabel: '미선정 사업 재제안 생성',
      beforeVal: `원사업 ${baseProj.projectId} (보존)`,
      afterVal: `재제안 ${generatedId} 생성 (2차)`,
      changeType: 'INSERT',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
    };
    setChangeHistories((prev) => [hist, ...prev]);

    showToast(`원사업 [${baseProj.projectId}] 보존 및 2차 재제안 [${generatedId}] 생성이 완료되었습니다.`, 'success');
    return newReproposalProj;
  };

  // 1-5. 재심의 결과 누적 등록
  const addDeliberationRecord = (
    projectId: string,
    record: Omit<import('../types').DeliberationRecord, 'delibSeq'>
  ) => {
    const delibSeq = Date.now();
    const newRecord = { ...record, delibSeq };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        const list = p.deliberations || [];
        return {
          ...p,
          deliberations: [...list, newRecord],
        };
      })
    );

    showToast(`[${projectId}] ${record.roundNo}차 심의 결과(${record.resultNm})가 누적 등록되었습니다.`, 'success');
  };

  // 2. 등록·수정·결재·확정 (담당자 작성 -> 상신 -> 팀장·센터장 승인 -> 반려·재상신 -> 승인본 확정)
  const submitApprovalStep = (
    apprId: number,
    action: 'APPROVE' | 'REJECT' | 'SUPPLEMENT',
    comment: string = ''
  ) => {
    const appr = approvals.find((a) => a.apprId === apprId);
    if (!appr) return;

    const currentStep = appr.currentStepNo || 2; // 2: 팀장, 3: 센터장

    if (action === 'APPROVE') {
      if (currentStep === 2) {
        // 1차 팀장 검토 승인 완료 -> 2차 센터장 최종 승인 단계로 진행
        setApprovals((prev) =>
          prev.map((a) => {
            if (a.apprId !== apprId) return a;
            const updatedSteps = (a.steps || []).map((s) => {
              if (s.stepNo === 2) {
                return {
                  ...s,
                  status: 'APPROVED' as const,
                  processedAt: new Date().toLocaleString(),
                  actorId: currentUser.userId,
                  actorNm: currentUser.userNm,
                  comment: comment || '팀장 1차 검토 승인 완료 (센터장 최종승인 상신)',
                };
              }
              return s;
            });
            return {
              ...a,
              currentStepNo: 3,
              statusCd: 'PENDING',
              statusNm: '센터장 최종승인 대기',
              steps: updatedSteps,
              comment: comment || a.comment,
            };
          })
        );
        showToast('1차 팀장 검토가 승인되었습니다. 최종결재권자(센터장) 결재로 이관되었습니다.', 'info');
      } else {
        // 2차 센터장 최종 승인 -> 확정본 마스터 반영
        if (appr.targetType === 'PROJECT') {
          setProjects((prev) =>
            prev.map((p) => {
              if (p.projectId !== appr.targetId) return p;
              const nextVersions = p.confirmedVersions || [];
              const versionNo = `v${nextVersions.length + 1}.0`;
              const confirmedSnapshot: import('../types').ConfirmedVersion = {
                versionSeq: Date.now(),
                versionNo,
                confirmedAt: new Date().toLocaleString(),
                confirmedByNm: `${currentUser.userNm} (${currentUser.positionNm})`,
                docNo: `CONF-${p.projectId}-${String(nextVersions.length + 1).padStart(2, '0')}`,
                summary: appr.title,
                snapshotJson: { ...p, ...appr.payloadJson },
              };

              return {
                ...p,
                ...appr.payloadJson,
                apprStatusCd: 'APPROVED',
                confirmedVersions: [confirmedSnapshot, ...nextVersions],
              };
            })
          );
        }

        setApprovals((prev) =>
          prev.map((a) => {
            if (a.apprId !== apprId) return a;
            const updatedSteps = (a.steps || []).map((s) => {
              if (s.stepNo === 3 || s.stepNo === currentStep) {
                return {
                  ...s,
                  status: 'APPROVED' as const,
                  processedAt: new Date().toLocaleString(),
                  actorId: currentUser.userId,
                  actorNm: currentUser.userNm,
                  comment: comment || '센터장 최종 결재 승인 확정',
                };
              }
              return s;
            });
            return {
              ...a,
              statusCd: 'APPROVED',
              statusNm: '최종 승인확정',
              approverId: currentUser.userId,
              approverNm: `${currentUser.userNm} (${currentUser.positionNm})`,
              approvedAt: new Date().toLocaleString(),
              approverComment: comment || '최종 결재 승인 확정',
              steps: updatedSteps,
            };
          })
        );

        // Audit log
        const hist: ChangeHistory = {
          histSeq: Date.now(),
          targetType: appr.targetType,
          targetId: appr.targetId,
          targetNm: appr.targetTitle,
          fieldNm: 'approval_confirmed',
          fieldLabel: '결재 최종 승인본 확정',
          beforeVal: JSON.stringify(appr.beforePayloadJson || {}),
          afterVal: JSON.stringify(appr.payloadJson),
          changeType: 'UPDATE',
          changedBy: currentUser.userId,
          changedByName: currentUser.userNm,
          changedAt: new Date().toLocaleString(),
          apprId,
        };
        setChangeHistories((prev) => [hist, ...prev]);

        showToast(`[${appr.title}] 건이 최종 승인 확정되어 승인본이 공식 보존되었습니다.`, 'success');
      }
    } else if (action === 'REJECT') {
      // 반려 처리 (기안자에게 피드백 제공)
      setApprovals((prev) =>
        prev.map((a) => {
          if (a.apprId !== apprId) return a;
          const updatedSteps = (a.steps || []).map((s) => {
            if (s.stepNo === currentStep) {
              return {
                ...s,
                status: 'RETURNED' as const,
                processedAt: new Date().toLocaleString(),
                actorId: currentUser.userId,
                actorNm: currentUser.userNm,
                comment: comment || '보완 반려',
              };
            }
            return s;
          });
          return {
            ...a,
            statusCd: 'RETURNED',
            statusNm: '반려 (보완 후 재상신 필요)',
            approverId: currentUser.userId,
            approverNm: `${currentUser.userNm} (${currentUser.positionNm})`,
            processedAt: new Date().toLocaleString(),
            returnReason: comment || '결재 의견을 반영하여 보완 후 재상신 바랍니다.',
            approverComment: comment,
            steps: updatedSteps,
          };
        })
      );
      showToast('결재 건이 반려되었습니다. 기안자에게 보완 사유가 전달되었습니다.', 'warning');
    } else {
      // 보완 요청
      supplementRequest(apprId, comment);
    }
  };

  // 2-1. 반려 건 수정 후 재상신 (담당자 수정 -> 재상신)
  const resubmitApproval = (
    apprId: number,
    updatedPayload: Record<string, any>,
    comment: string
  ) => {
    const appr = approvals.find((a) => a.apprId === apprId);
    if (!appr) return;

    const nextRound = (appr.resubmitRound || 1) + 1;

    setApprovals((prev) =>
      prev.map((a) => {
        if (a.apprId !== apprId) return a;
        const resetSteps = [
          {
            stepNo: 1,
            stepNm: `${nextRound}차 보완 재상신`,
            actorId: currentUser.userId,
            actorNm: currentUser.userNm,
            actorRoleNm: `${currentUser.positionNm}`,
            status: 'APPROVED' as const,
            processedAt: new Date().toLocaleString(),
            comment,
          },
          {
            stepNo: 2,
            stepNm: '1차 팀장 검토',
            actorId: 'park.jw',
            actorNm: '박진우',
            actorRoleNm: '부서장/팀장 (실장)',
            status: 'PENDING' as const,
          },
          {
            stepNo: 3,
            stepNm: '2차 센터장 최종 승인',
            actorId: 'admin.sys',
            actorNm: '이사장/센터장',
            actorRoleNm: '최종결재권자 (센터장)',
            status: 'PENDING' as const,
          },
        ];

        return {
          ...a,
          payloadJson: updatedPayload,
          resubmitRound: nextRound,
          currentStepNo: 2,
          statusCd: 'PENDING',
          statusNm: `${nextRound}차 재상신 (팀장 검토 대기)`,
          requestedAt: new Date().toLocaleString(),
          comment: `[${nextRound}차 보완재상신] ${comment}`,
          returnReason: undefined,
          steps: resetSteps,
        };
      })
    );

    const hist: ChangeHistory = {
      histSeq: Date.now(),
      targetType: appr.targetType,
      targetId: appr.targetId,
      targetNm: appr.targetTitle,
      fieldNm: 'resubmission',
      fieldLabel: `${nextRound}차 보완 재상신`,
      beforeVal: '반려(RETURNED)',
      afterVal: `${nextRound}차 재상신 완료`,
      changeType: 'UPDATE',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
      apprId,
    };
    setChangeHistories((prev) => [hist, ...prev]);

    showToast(`결재 건 [${appr.title}]이(가) ${nextRound}차로 보완 재상신되었습니다.`, 'success');
  };

  // 2-2. 승인본 확정 이력 강제 보존 (수동 확정 아카이빙)
  const finalizeConfirmedVersion = (projectId: string, summary: string) => {
    const proj = projects.find((p) => p.projectId === projectId);
    if (!proj) return;

    const list = proj.confirmedVersions || [];
    const versionNo = `v${list.length + 1}.0`;
    const newVersion: import('../types').ConfirmedVersion = {
      versionSeq: Date.now(),
      versionNo,
      confirmedAt: new Date().toLocaleString(),
      confirmedByNm: `${currentUser.userNm} (${currentUser.positionNm})`,
      docNo: `CONF-${proj.projectId}-${String(list.length + 1).padStart(2, '0')}`,
      summary,
      snapshotJson: { ...proj },
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        return {
          ...p,
          stageCd: 'CONFIRMED',
          stageNm: '확정사업 (N년)',
          confirmedVersions: [newVersion, ...list],
        };
      })
    );

    showToast(`사업 [${projectId}]의 승인본 [${versionNo}] 확정본이 영구 아카이빙되었습니다.`, 'success');
  };

  // 3. 계약·집행·낙찰차액 (배정액 -> 계약액 -> 낙찰차액 -> 활용계획 승인 -> 집행 -> 잔액)
  const saveSavingsPlan = (
    projectId: string,
    budgetSeq: number,
    plan: {
      title: string;
      plannedAmt: number;
      category: string;
      rationale: string;
      approveImmediately?: boolean;
    }
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        const updatedBudgets = (p.budgets || []).map((b) => {
          if (b.budgetSeq !== budgetSeq) return b;
          const savingAmt = b.savingAmt || (b.budgetAmt - b.contractAmt);
          const planObj: import('../types').SavingsUsePlan = {
            planSeq: Date.now(),
            title: plan.title,
            plannedAmt: plan.plannedAmt,
            category: plan.category,
            rationale: plan.rationale,
            status: plan.approveImmediately ? 'APPROVED' : 'PENDING',
            statusNm: plan.approveImmediately ? '활용계획 승인 완료' : '활용계획 승인 대기중',
            submittedAt: new Date().toLocaleString(),
            approvedAt: plan.approveImmediately ? new Date().toLocaleString() : undefined,
            approverNm: plan.approveImmediately ? `${currentUser.userNm} (${currentUser.positionNm})` : undefined,
          };
          return {
            ...b,
            savingAmt,
            savingUsePlan: plan.title,
            savingUsePlanObj: planObj,
          };
        });
        return { ...p, budgets: updatedBudgets };
      })
    );

    showToast(
      plan.approveImmediately
        ? '낙찰차액 활용계획이 승인 확정되었습니다.'
        : '낙찰차액 활용계획서가 결재 상신되었습니다.',
      'success'
    );
  };

  const approveSavingsPlan = (
    projectId: string,
    budgetSeq: number,
    approved: boolean,
    comment?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        const updatedBudgets = (p.budgets || []).map((b) => {
          if (b.budgetSeq !== budgetSeq || !b.savingUsePlanObj) return b;
          const updatedPlan: import('../types').SavingsUsePlan = {
            ...b.savingUsePlanObj,
            status: approved ? 'APPROVED' : 'REJECTED',
            statusNm: approved ? '활용계획 승인 완료' : '반려',
            approvedAt: new Date().toLocaleString(),
            approverNm: `${currentUser.userNm} (${currentUser.positionNm})`,
            reviewComment: comment,
          };
          return {
            ...b,
            savingUsePlanObj: updatedPlan,
          };
        });
        return { ...p, budgets: updatedBudgets };
      })
    );
    showToast(
      approved ? '낙찰차액 활용계획이 최종 승인되었습니다.' : '낙찰차액 활용계획이 반려되었습니다.',
      approved ? 'success' : 'warning'
    );
  };

  const addBudgetDisbursement = (
    projectId: string,
    budgetSeq: number,
    disbursement: {
      title: string;
      paidYmd: string;
      paidAmt: number;
      category: 'ADVANCE' | 'INTERIM' | 'FINAL';
      categoryNm: string;
      invoiceDocNo?: string;
    }
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        const updatedBudgets = (p.budgets || []).map((b) => {
          if (b.budgetSeq !== budgetSeq) return b;
          const existingList = b.disbursements || [];
          const newPayment: import('../types').PaymentDisbursement = {
            paymentSeq: Date.now(),
            roundNo: existingList.length + 1,
            title: disbursement.title,
            paidYmd: disbursement.paidYmd,
            paidAmt: disbursement.paidAmt,
            category: disbursement.category,
            categoryNm: disbursement.categoryNm,
            invoiceDocNo: disbursement.invoiceDocNo || `INV-${new Date().toISOString().slice(0, 10)}`,
            status: 'COMPLETED',
          };
          const newExecuted = b.executedAmt + disbursement.paidAmt;
          return {
            ...b,
            executedAmt: newExecuted,
            disbursements: [...existingList, newPayment],
          };
        });
        return { ...p, budgets: updatedBudgets };
      })
    );
    showToast(`기성 집행액 ${(disbursement.paidAmt / 100000000).toFixed(2)}억원이 정상 집행 처리되었습니다.`, 'success');
  };

  // 4. PDM과 종료 후 성과 (기준선 -> 목표 -> 실적·증빙 -> 종료선 -> 차수별 추적조사)
  const updatePdmActual = (
    projectId: string,
    indicatorId: number,
    actualVal: number,
    evidenceDocNm: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        const updatedIndicators = (p.indicators || []).map((ind) => {
          if (ind.indicatorId !== indicatorId) return ind;
          const achieved = actualVal >= ind.targetVal ? 'Y' : 'N';
          return {
            ...ind,
            actualVal,
            achievedYn: achieved as 'Y' | 'N',
            evidenceDocNm: evidenceDocNm || '실적증빙_확인서.pdf',
            actualUpdatedYmd: new Date().toISOString().slice(0, 10),
          };
        });
        return { ...p, indicators: updatedIndicators };
      })
    );
    showToast('PDM 실적 수치 및 증빙자료가 성공적으로 반영되었습니다.', 'success');
  };

  const setEndlineEvaluation = (
    projectId: string,
    evalData: import('../types').EndlineEvaluation
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        return {
          ...p,
          stageCd: 'CLOSED',
          stageNm: '사업종료',
          endlineEval: evalData,
        };
      })
    );
    showToast(`사업 [${projectId}]의 종료선 종합평가(${evalData.gradeNm})가 등록 확정되었습니다.`, 'success');
  };

  // 5. 홈페이지 공개 (내부 확정정보 -> 공개 검토 -> 공개 승인 -> 게시 -> 정정 이력)
  const reviewPublicDisclosure = (
    projectId: string,
    review: import('../types').DisclosureReview
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        return {
          ...p,
          disclosureReview: review,
        };
      })
    );
    showToast('대국민 공개 검토 체크리스트 및 검토의견이 등록되었습니다.', 'info');
  };

  const approvePublicDisclosure = (
    projectId: string,
    scope: 'FULL' | 'SUMMARY' | 'NONE',
    approvalComment: string = ''
  ) => {
    const isPublic = scope !== 'NONE' ? 'Y' : 'N';
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        return {
          ...p,
          isPublic,
          disclosureApproval: {
            isApproved: scope !== 'NONE',
            approvedAt: new Date().toLocaleString(),
            approverNm: `${currentUser.userNm} (${currentUser.positionNm})`,
            disclosureScope: scope,
            approvalDocNo: `PUB-${p.projectId}-${new Date().getFullYear()}`,
            approvalComment,
          },
        };
      })
    );

    const hist: ChangeHistory = {
      histSeq: Date.now(),
      targetType: 'DISCLOSURE',
      targetId: projectId,
      targetNm: projects.find((p) => p.projectId === projectId)?.projectNm,
      fieldNm: 'public_disclosure',
      fieldLabel: '대국민 홈페이지 공개 승인',
      beforeVal: '비공개(N)',
      afterVal: `공개(${scope})`,
      changeType: 'UPDATE',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
    };
    setChangeHistories((prev) => [hist, ...prev]);

    showToast(
      scope !== 'NONE'
        ? `대국민 포털에 사업정보가 공식 게시되었습니다. (공개범위: ${scope})`
        : '사업정보의 대국민 게시가 중단(비공개)되었습니다.',
      'success'
    );
  };

  const addPublicErrata = (
    projectId: string,
    errata: {
      targetField: string;
      fieldLabel: string;
      beforeVal: string;
      afterVal: string;
      reason: string;
    }
  ) => {
    const proj = projects.find((p) => p.projectId === projectId);
    if (!proj) return;

    const list = proj.errataList || [];
    const noticeNo = `${new Date().getFullYear()}-ERR-${String(list.length + 1).padStart(3, '0')}`;
    const newNotice: import('../types').ErrataNotice = {
      errataSeq: Date.now(),
      projectId,
      projectNm: proj.projectNm,
      noticeNo,
      errataYmd: new Date().toISOString().slice(0, 10),
      targetField: errata.targetField,
      fieldLabel: errata.fieldLabel,
      beforeVal: errata.beforeVal,
      afterVal: errata.afterVal,
      reason: errata.reason,
      authorNm: `${currentUser.userNm} (${currentUser.positionNm})`,
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        return {
          ...p,
          errataList: [newNotice, ...list],
        };
      })
    );

    const hist: ChangeHistory = {
      histSeq: Date.now(),
      targetType: 'DISCLOSURE',
      targetId: projectId,
      targetNm: proj.projectNm,
      fieldNm: 'errata_published',
      fieldLabel: `공개 정정 공시 (${noticeNo})`,
      beforeVal: errata.beforeVal,
      afterVal: errata.afterVal,
      changeType: 'UPDATE',
      changedBy: currentUser.userId,
      changedByName: currentUser.userNm,
      changedAt: new Date().toLocaleString(),
    };
    setChangeHistories((prev) => [hist, ...prev]);

    showToast(`공개 정정공시 [${noticeNo}]가 대국민 포털에 즉시 공시되었습니다.`, 'success');
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
        // Scenario Methods
        createReproposal,
        addDeliberationRecord,
        submitApprovalStep,
        resubmitApproval,
        finalizeConfirmedVersion,
        saveSavingsPlan,
        approveSavingsPlan,
        addBudgetDisbursement,
        updatePdmActual,
        setEndlineEvaluation,
        reviewPublicDisclosure,
        approvePublicDisclosure,
        addPublicErrata,
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
