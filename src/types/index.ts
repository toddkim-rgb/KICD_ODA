// Types for 국토교통 ODA 사업DB 관리시스템 및 국제개발협력센터 포털

export type RoleType = 'R-01' | 'R-02' | 'R-03' | 'R-04' | 'R-05';

export interface User {
  userId: string;
  userNm: string;
  deptCd: string;
  deptNm: string;
  positionNm: string;
  email: string;
  mobileNo: string;
  role: RoleType;
  roleNm: string;
}

export type SectorCode = 'URBAN' | 'TRANS' | 'SPATIAL' | 'ROAD' | 'RAIL' | 'LAND';
export type ProjectTypeCode = 'CONSULTING' | 'SYSTEM' | 'CAPACITY' | 'COMPLEX';
export type StageCode = 
  | 'DISCOVERED'   // N-2년 사업발굴
  | 'PRELIM'       // N-1년 예비검토
  | 'REVIEW'       // 국개위 심의상정
  | 'SELECTED'     // 심의선정
  | 'HELD'         // 보류
  | 'REJECTED'     // 탈락 (미선정)
  | 'CONFIRMED'    // N년 확정사업
  | 'CONTRACTED'   // 수행기관 계약완료
  | 'ONGOING'      // 착수 및 수행관리
  | 'CLOSED'       // 사업종료
  | 'FOLLOWUP';    // 사후관리·추적조사

export type RelationType = 'REPROPOSAL' | 'FOLLOWUP' | 'LINKED';

export interface ProjectRelation {
  relationSeq: number;
  baseProjectId: string; // 원사업 코드
  targetProjectId: string; // 연결된 사업 코드
  relationType: RelationType;
  proposalRound?: number; // 1차, 2차 등
  changeSummary?: string; // 변경 요약
  diffDetails?: {
    field: string;
    label: string;
    before: string | number;
    after: string | number;
    comment?: string;
  }[];
}

export interface ProjectStageRecord {
  stageSeq: number;
  projectId: string;
  stageCd: StageCode;
  stageNm: string;
  targetYear?: number;
  statusCd: string;
  statusNm: string;
  decisionYmd: string;
  decisionReason: string;
  processedBy: string;
  processedAt: string;
}

export interface ProjectSchedule {
  scheduleSeq: number;
  projectId: string;
  scheduleNm: string;
  stageCd: StageCode;
  planYmd: string;
  completeYmd?: string;
  actualYmd?: string;
  statusCd?: string;
  delayYn: 'Y' | 'N';
  delayReason?: string;
  actionPlan?: string;
  notifyBeforeDays: number;
}

export type Schedule = ProjectSchedule;

export interface BudgetDetailItem {
  detailSeq: number;
  itemNm: string;
  itemAmt: number;
  remark?: string;
}

export interface ProjectBudget {
  budgetSeq: number;
  projectId: string;
  fiscalYear: number;
  budgetAmt: number;     // 예산액
  contractAmt: number;   // 계약액
  executedAmt: number;   // 집행액
  currency: 'KRW' | 'USD';
  savingUsePlan?: string;// 낙찰차액 활용계획
  details?: BudgetDetailItem[];
}

export type DocumentTypeCode = 
  | 'PLAN'       // 사업계획서
  | 'OFFICIAL'   // 공문
  | 'MEETING'    // 회의자료
  | 'RFP'        // 제안요청서
  | 'TOR'        // 과업지시서
  | 'CONTRACT'   // 계약서
  | 'INITIATION' // 착수계
  | 'REPORT'     // 중간/최종보고서
  | 'EVAL';      // 평가서/사후관리보고서

export interface ProjectDocument {
  docId: number;
  projectId: string;
  projectNm: string;
  docTypeCd: DocumentTypeCode;
  docTypeNm: string;
  stageCd: StageCode;
  fileNm: string;
  fileSize: string;
  downloadUrl?: string;
  isPublic: 'Y' | 'N';
  createdAt: string;
  createdBy: string;
}

export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'RETURNED' | 'SUPPLEMENT';

export interface ApprovalRequest {
  apprId: number;
  targetType: 'PROJECT' | 'BUDGET' | 'PERFORMANCE';
  targetId: string;
  targetTitle: string;
  apprLineId: number;
  title: string;
  payloadJson: Record<string, any>;
  beforePayloadJson?: Record<string, any>;
  statusCd: ApprovalStatus;
  statusNm: string;
  requestedBy: string;
  requestedByNm: string;
  requestedAt: string;
  approverId?: string;
  approverNm?: string;
  comment?: string;
  processedAt?: string;
  approvedAt?: string;
  approvedByNm?: string;
  approverComment?: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface ChangeHistory {
  histSeq: number;
  targetType: 'PROJECT' | 'BUDGET' | 'SCHEDULE' | 'DOCUMENT' | 'PERFORMANCE';
  targetTable?: string;
  targetId: string;
  targetNm?: string;
  fieldNm: string;
  fieldLabel: string;
  beforeVal: string;
  afterVal: string;
  changeType: 'INSERT' | 'UPDATE' | 'DELETE';
  changedBy: string;
  changedByName: string;
  changedAt: string;
  clientIp?: string;
  apprId?: number;
}

// 성과 관리: PDM 지표
export interface PdmIndicator {
  indicatorId: number;
  planSeq: number;
  indicatorLevel: 'GOAL' | 'PURPOSE' | 'OUTPUT' | 'ACTIVITY';
  indicatorNm: string;
  baselineVal: number;
  targetVal: number;
  actualVal: number;
  unit: string;
  measureMethod: string;
  measureCycle: string;
  achievedYn: 'Y' | 'N';
}

// 성과 관리: 추적조사 및 사후관리 (차수별 누적)
export interface TrackingSurvey {
  surveyId: number;
  projectId: string;
  surveyTypeCd: 'BASELINE' | 'MIDTERM' | 'ENDLINE' | 'TRACKING';
  surveyTypeNm: string;
  roundNo: number; // 1차, 2차, 3차 추적조사
  baseYmd: string; // 조사기준일
  surveyOrgNm: string;
  reportDocId?: number;
  sustainYn: 'Y' | 'N'; // 성과 유지 여부
  outputUsageDesc: string; // 핵심 산출물 활용 현황
  followupNeedYn: 'Y' | 'N'; // 후속사업 필요 여부
  krCompanyOrderYn: 'Y' | 'N'; // 국내기업 연계 수주 여부
  krCompanyOrderAmt?: number; // 국내기업 수주 금액 (KRW)
  krCompanyOrderDesc?: string;
  indicatorResults: {
    indicatorId: number;
    indicatorNm: string;
    targetVal: number;
    actualVal: number;
    unit: string;
    achieved: 'Y' | 'N';
    remark?: string;
  }[];
}

// 메인 사업 모델
export interface Project {
  projectSeq: number;
  projectId: string; // ODA-YYYY-NNNN
  projectNm: string;
  countryCd: string;
  countryNm: string;
  regionCd: string;
  regionNm: string;
  sectorCd: SectorCode;
  sectorNm: string;
  workTypeCd: string;
  workTypeNm: string;
  projectTypeCd: ProjectTypeCode;
  projectTypeNm: string;
  orderingAgencyNm: string;   // 발주처 (예: 국토교통부, 한국수자원공사 등)
  proposingAgencyNm: string;  // 제안기관 (수원국 부처)
  executingAgencyNm: string;  // 수행기관 (시행기관: 연구원, 컨소시엄)
  budgetAmt: number;          // 총 사업비 (원)
  budgetCurrency: 'KRW' | 'USD';
  startYmd: string;
  endYmd: string;
  stageCd: StageCode;
  stageNm: string;
  statusCd: string;
  statusNm: string;
  mainManagerId: string;
  mainManagerNm: string;
  subManagerId: string;
  subManagerNm: string;
  isPublic: 'Y' | 'N';
  apprStatusCd: ApprovalStatus;
  remark?: string;
  overview?: string; // 사업개요 / 추진배경
  expectedEffect?: string; // 기대효과
  
  // Relations: 원사업 / 재제안 / 후속연계
  relations?: ProjectRelation[];
  
  // Related lists
  budgets?: ProjectBudget[];
  schedules?: ProjectSchedule[];
  stages?: ProjectStageRecord[];
  documents?: ProjectDocument[];
  indicators?: PdmIndicator[];
  trackingSurveys?: TrackingSurvey[];
}
