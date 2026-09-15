import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Lock,
  Unlock,
  Search,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { CODES } from '../../data/mockData';

export const DocumentManagementView: React.FC = () => {
  const { projects, addDocument, toggleDocumentPublic, setActiveProjectDetailId, showToast } = useApp();

  const [keyword, setKeyword] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('ALL');
  const [publicFilter, setPublicFilter] = useState('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.projectId || '');
  const [uploadDocType, setUploadDocType] = useState('REPORT');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadPublic, setUploadPublic] = useState<'Y' | 'N'>('Y');

  // Collect all documents
  const allDocs = projects.flatMap((p) =>
    (p.documents || []).map((d) => ({
      ...d,
      projectNm: p.projectNm,
      countryNm: p.countryNm,
      sectorNm: p.sectorNm,
    }))
  );

  const filteredDocs = allDocs.filter((d) => {
    if (docTypeFilter !== 'ALL' && d.docTypeCd !== docTypeFilter) return false;
    if (publicFilter !== 'ALL' && d.isPublic !== publicFilter) return false;
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      const matchFile = d.fileNm.toLowerCase().includes(q);
      const matchProj = d.projectNm.toLowerCase().includes(q);
      const matchId = d.projectId.toLowerCase().includes(q);
      if (!matchFile && !matchProj && !matchId) return false;
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    const proj = projects.find((p) => p.projectId === selectedProjectId);
    const typeObj = CODES.docTypes.find((t) => t.code === uploadDocType);

    addDocument(selectedProjectId, {
      projectId: selectedProjectId,
      projectNm: proj?.projectNm || '',
      docTypeCd: uploadDocType as any,
      docTypeNm: typeObj?.name || '보고서',
      fileNm: uploadFileName,
      fileExt: 'pdf',
      fileSize: '3.4 MB',
      isPublic: uploadPublic,
      uploaderNm: '관리자 (시스템)',
    });

    setUploadFileName('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>PROJECT DELIVERABLES & CLOUD REPOSITORY</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">문서 및 산출물 관리 (F-136 ~ F-139)</h1>
            <p className="text-xs text-slate-500 mt-1">
              사업계획서, 중간·최종보고서, 사후평가서 등 산출물의 버전 관리와 <strong>대국민 포털 공개(Y/N) 설정</strong>을 관리합니다.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>신규 산출물 등록 (F-137)</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <label className="block text-slate-600 font-semibold mb-1">문서명 / 사업명 검색</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="파일명, 사업명, 사업코드 검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">문서 분류 체계</label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 분류</option>
              {CODES.docTypes.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">대국민 공개 상태</label>
            <select
              value={publicFilter}
              onChange={(e) => setPublicFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체</option>
              <option value="Y">포털 공개 (Y)</option>
              <option value="N">내부 전용 비공개 (N)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-28">문서유형</th>
                <th className="p-3.5">파일명</th>
                <th className="p-3.5">연계 사업명</th>
                <th className="p-3.5 w-24">용량</th>
                <th className="p-3.5 w-28">등록일</th>
                <th className="p-3.5 w-28 text-center">대국민 공개 (F-138)</th>
                <th className="p-3.5 w-28 text-center">다운로드</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.docId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-bold rounded text-[10px]">
                      {doc.docTypeNm}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{doc.fileNm}</div>
                    <span className="text-[10px] text-slate-400">등록자: {doc.uploaderNm}</span>
                  </td>
                  <td className="p-3.5">
                    <div
                      onClick={() => setActiveProjectDetailId(doc.projectId)}
                      className="text-slate-700 hover:text-blue-600 font-medium cursor-pointer line-clamp-1"
                    >
                      {doc.projectNm}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{doc.projectId}</span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono">{doc.fileSize}</td>
                  <td className="p-3.5 text-slate-500 font-mono">{doc.createdAt}</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => toggleDocumentPublic(doc.projectId, doc.docId)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 cursor-pointer transition-colors ${
                        doc.isPublic === 'Y'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title="클릭하여 대국민 포털 노출 여부 즉시 전환"
                    >
                      {doc.isPublic === 'Y' ? (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>포털 공개</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>비공개</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => showToast(`[${doc.fileNm}] 다운로드를 시작합니다.`, 'success')}
                      className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded transition-colors"
                      title="다운로드"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">신규 산출물 문서 등록 (F-137)</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                닫기
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">연계 사업 선택</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      [{p.projectId}] {p.projectNm}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">문서 분류</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {CODES.docTypes.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">산출물 파일명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 2025_사업수행_최종성과보고서_v1.0.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">대국민 포털 공개 여부 (F-138)</label>
                <select
                  value={uploadPublic}
                  onChange={(e) => setUploadPublic(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  <option value="Y">포털에 즉시 공개 (Y)</option>
                  <option value="N">내부 검토용 비공개 (N)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  산출물 업로드 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
