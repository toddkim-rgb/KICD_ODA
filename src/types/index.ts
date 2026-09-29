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

// ==========================================
// 시나리오 1: 미선정 사업 재제안 관련 모델
// ==========================================
export interface DeliberationRecord {
  delibSeq: number;
  projectId: string;
  roundNo: number; // 1차 심의, 2차 재심의, 3차 심의 등
  committeeNm: string; // 예: 국토교통 ODA 실무기획위원회, 제44차 국제개발협력위원회(국개위)
  delibYmd: string; // 심의의결일
  resultCd: 'SELECTED' | 'CONDITION_SELECTED' | 'HELD' | 'REJECTED';
  resultNm: string; // 선정 / 조건부선정 / 보류 / 미선정(탈락)
  mainReasons: string; // 심의 의견 및 탈락/보완 사유
  countermeasurePlan?: string; // 보완 재제안 조치계획
  docNo?: string; // 심의의결서 문서번호
}

export interface ProjectRelation {
  relationSeq: number;
  baseProjectId: string; // 원사업 코드 (보존된 미선정 사업)
  targetProjectId: string; // 연결된 재제안 사업 코드
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

// ==========================================
// 시나리오 3: 계약·집행·낙찰차액 관련 모델
// ==========================================
export interface SavingsUsePlan {
  planSeq: number;
  title: string;
  plannedAmt: number; // 활용 예정액
  category: string; // 현지 추가조사 / 과업 고도화 / 성과확산 워크숍 / 잔액 국고반납
  rationale: string; // 활용 사유 및 기대효과
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  statusNm: string;
  submittedAt?: string;
  approvedAt?: string;
  approverNm?: string;
  reviewComment?: string;
}

export interface PaymentDisbursement {
  paymentSeq: number;
  roundNo: number; // 1차 기성(선금), 2차 기성, 준공금
  title: string;
  paidYmd: string;
  paidAmt: number;
  category: 'ADVANCE' | 'INTERIM' | 'FINAL';
  categoryNm: string;
  invoiceDocNo?: string;
  status: 'COMPLETED';
}

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
  budgetAmt: number;     // 배정액
  contractAmt: number;   // 계약액
  executedAmt: number;   // 집행액
  currency: 'KRW' | 'USD';
  savingAmt?: number;    // 낙찰차액 (배정액 - 계약액)
  savingUsePlan?: string;// 낙찰차액 활용계획 요약
  savingUsePlanObj?: SavingsUsePlan; // 상세 활용계획 객체
  disbursements?: PaymentDisbursement[]; // 기성 집행 내역
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

// ==========================================
// 시나리오 2: 등록·수정·결재·확정 관련 모델
// ==========================================
export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'RETURNED' | 'SUPPLEMENT';

export interface ApprovalStepRecord {
  stepNo: number;
  stepNm: string; // 기안상신 -> 1차 팀장검토 -> 2차 센터장최종승인
  actorId: string;
  actorNm: string;
  actorRoleNm: string;
  status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'SUPPLEMENT';
  processedAt?: string;
  comment?: string;
}

export interface ApprovalRequest {
  apprId: number;
  targetType: 'PROJECT' | 'BUDGET' | 'PERFORMANCE' | 'DISCLOSURE';
  targetId: string;
  targetTitle: string;
  apprLineId: number;
  title: string;
  payloadJson: Record<string, any>;
  beforePayloadJson?: Record<string, any>;
  statusCd: ApprovalStatus;
  statusNm: string;
  currentStepNo?: number; // 1: 담당자상신, 2: 팀장검토, 3: 센터장최종승인
  steps?: ApprovalStepRecord[]; // 다단계 결재선
  resubmitRound?: number; // 1차 상신, 2차 재상신
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
  returnReason?: string; // 반려 사유
}

// 승인본 확정 이력
export interface ConfirmedVersion {
  versionSeq: number;
  versionNo: string; // v1.0, v1.1, v2.0
  confirmedAt: string;
  confirmedByNm: string;
  docNo: string; // 승인의결 번호
  summary: string;
  snapshotJson: Record<string, any>; // 확정 시점의 데이터 불변 스냅샷
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface ChangeHistory {
  histSeq: number;
  targetType: 'PROJECT' | 'BUDGET' | 'SCHEDULE' | 'DOCUMENT' | 'PERFORMANCE' | 'DISCLOSURE';
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

// ==========================================
// 시나리오 4: PDM과 종료 후 성과 관련 모델
// ==========================================
export interface PdmIndicator {
  indicatorId: number;
  planSeq: number;
  indicatorLevel: 'GOAL' | 'PURPOSE' | 'OUTPUT' | 'ACTIVITY';
  indicatorNm: string;
  baselineVal: number; // 기준선 (사업 착수 시점)
  targetVal: number;   // 목표 (사업 종료 시점)
  actualVal: number;   // 실적 (측정 실적)
  unit: string;
  measureMethod: string;
  measureCycle: string;
  achievedYn: 'Y' | 'N';
  evidenceDocNm?: string; // 실적 증빙 문서명
  evidenceDocUrl?: string;
  actualUpdatedYmd?: string;
}

// 종료선 평가
export interface EndlineEvaluation {
  evalYmd: string;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeNm: string;
  score: number; // 100점 만점
  evaluatorNm: string; // 평가단 (예: 국토교통 ODA 사후평가위원회)
  summaryReportDocNm: string;
  strategicFeedback: string;
  sustainForecast: 'HIGH' | 'MEDIUM' | 'LOW';
}

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
  indicatorResults?: {
    indicatorId: number;
    indicatorNm: string;
    targetVal: number;
    actualVal: number;
    unit: string;
    achieved: 'Y' | 'N';
    remark?: string;
  }[];
}

// ==========================================
// 시나리오 5: 홈페이지 공개 및 정정 이력 모델
// ==========================================
export interface DisclosureReview {
  isReviewed: boolean;
  reviewedAt?: string;
  reviewerNm?: string;
  privacyCheck: boolean;      // 1. 개인정보 비식별 조치 여부
  costSecurityCheck: boolean; // 2. 세부 원가/단가 보안 여부
  diplomaticCheck: boolean;   // 3. 수원국 외교 보안 점검 여부
  licenseCheck: boolean;      // 4. 배포 라이선스/저작권 점검 여부
  reviewOpinion?: string;
}

export interface DisclosureApproval {
  isApproved: boolean;
  approvedAt?: string;
  approverNm?: string;
  disclosureScope: 'FULL' | 'SUMMARY' | 'NONE'; // 전체공개 / 요약공개 / 비공개
  approvalDocNo?: string;
  approvalComment?: string;
}

export interface ErrataNotice {
  errataSeq: number;
  projectId: string;
  projectNm: string;
  noticeNo: string; // 예: 2026-ERR-001
  errataYmd: string;
  targetField: string;
  fieldLabel: string;
  beforeVal: string;
  afterVal: string;
  reason: string; // 정정 사유
  authorNm: string;
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

  // 1. 미선정 사업 재제안 관련
  isPreserved?: boolean; // 미선정 원사업 영구 보존 플래그
  preservedAt?: string;
  preservationReason?: string;
  deliberations?: DeliberationRecord[]; // 회차별 심의 결과 누적

  // 2. 등록·수정·결재·확정 관련
  confirmedVersions?: ConfirmedVersion[]; // 승인본 확정 이력

  // 4. PDM 및 종료선 평가
  endlineEval?: EndlineEvaluation; // 종료선 성과평가

  // 5. 홈페이지 공개 및 정정 이력
  disclosureReview?: DisclosureReview; // 공개 검토
  disclosureApproval?: DisclosureApproval; // 공개 승인
  errataList?: ErrataNotice[]; // 정정 공시 이력

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

