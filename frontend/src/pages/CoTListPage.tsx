import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProductCategory, QuestionType, Gender, AgeBand, CotStatus } from '../types/enums';
import { mockCotData, mockQuestionerData } from '../data/mockData';

interface CoT {
  id: string;
  questioner_id: string;
  product_ids: string[];
  product_category: ProductCategory;
  question_type: QuestionType;
  question_text: string;
  cot_steps: string[];
  answer_text: string;
  cot_status: CotStatus;
  createdAt: string;
  updatedAt: string;
}

const CoTListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cots, setCots] = useState<CoT[]>([]);
  const [filteredCots, setFilteredCots] = useState<CoT[]>([]);
  const [filters, setFilters] = useState({
    product_category: searchParams.get('product_category') || '',
    question_type: searchParams.get('question_type') || '',
    gender: searchParams.get('gender') || '',
    age_band: searchParams.get('age_band') || '',
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CoT;
    direction: 'asc' | 'desc';
  }>({ key: 'updatedAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const navigate = useNavigate();

  // Load mock data
  useEffect(() => {
    setCots(mockCotData as CoT[]);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...cots];

    // Apply filters
    if (filters.product_category) {
      filtered = filtered.filter(cot => cot.product_category === filters.product_category);
    }
    if (filters.question_type) {
      filtered = filtered.filter(cot => cot.question_type === filters.question_type);
    }
    
    // Apply questioner-based filters
    if (filters.gender || filters.age_band) {
      filtered = filtered.filter(cot => {
        const questioner = mockQuestionerData.find(q => q.id === cot.questioner_id);
        if (!questioner) return false;
        
        if (filters.gender && questioner.gender !== filters.gender) return false;
        if (filters.age_band && questioner.age_band !== filters.age_band) return false;
        
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

        setFilteredCots(filtered);
        setCurrentPage(1);
  }, [cots, filters, sortConfig]);

  const handleSort = (key: keyof CoT) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowClick = (cot: CoT) => {
    navigate(`/cot/${cot.id}`);
  };

  const totalPages = Math.ceil(filteredCots.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCots = filteredCots.slice(startIndex, endIndex);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">CoT 리스트</h1>
        <p className="text-slate-600">Chain of Thought 데이터를 관리하고 편집하세요</p>
      </div>
      
      {/* Filters */}
      <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-modern border border-slate-200/50">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">필터</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="product_category" className="block text-sm font-medium mb-1">
            상품분류
          </label>
          <select
            id="product_category"
            value={filters.product_category}
            onChange={(e) => {
              const newFilters = { ...filters, product_category: e.target.value };
              setFilters(newFilters);
              setCurrentPage(1);
              
              // Update URL parameters
              const newSearchParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newSearchParams.set('product_category', e.target.value);
              } else {
                newSearchParams.delete('product_category');
              }
              setSearchParams(newSearchParams);
            }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
          >
            <option value="">전체</option>
            <option value={ProductCategory.SECURITIES}>증권</option>
            <option value={ProductCategory.INSURANCE}>보험</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="question_type" className="block text-sm font-medium mb-1">
            질문유형
          </label>
          <select
            id="question_type"
            value={filters.question_type}
            onChange={(e) => {
              const newFilters = { ...filters, question_type: e.target.value };
              setFilters(newFilters);
              setCurrentPage(1);
              
              // Update URL parameters
              const newSearchParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newSearchParams.set('question_type', e.target.value);
              } else {
                newSearchParams.delete('question_type');
              }
              setSearchParams(newSearchParams);
            }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
          >
            <option value="">전체</option>
            <option value={QuestionType.CUSTOMER_CHARACTERISTICS}>고객특성 강조형</option>
            <option value={QuestionType.INVESTMENT_PREFERENCE}>투자성향 및 조건기반형</option>
            <option value={QuestionType.PRODUCT_COMPARISON}>상품 비교 추천형</option>
            <option value={QuestionType.AGE_LIFECYCLE}>연령별 및 생애주기 저축성 상품 추천형</option>
            <option value={QuestionType.INVESTMENT_PRODUCT}>투자성 상품 추천형</option>
            <option value={QuestionType.HEALTH_PROTECTION}>건강 및 질병보장 대비형</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-1">
            성별
          </label>
          <select
            id="gender"
            value={filters.gender}
            onChange={(e) => {
              const newFilters = { ...filters, gender: e.target.value };
              setFilters(newFilters);
              setCurrentPage(1);
              
              // Update URL parameters
              const newSearchParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newSearchParams.set('gender', e.target.value);
              } else {
                newSearchParams.delete('gender');
              }
              setSearchParams(newSearchParams);
            }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
          >
            <option value="">전체</option>
            <option value={Gender.MALE}>남성</option>
            <option value={Gender.FEMALE}>여성</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="age_band" className="block text-sm font-medium mb-1">
            연령대
          </label>
          <select
            id="age_band"
            value={filters.age_band}
            onChange={(e) => {
              const newFilters = { ...filters, age_band: e.target.value };
              setFilters(newFilters);
              setCurrentPage(1);
              
              // Update URL parameters
              const newSearchParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newSearchParams.set('age_band', e.target.value);
              } else {
                newSearchParams.delete('age_band');
              }
              setSearchParams(newSearchParams);
            }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
          >
            <option value="">전체</option>
            <option value={AgeBand.AGE_10}>10대</option>
            <option value={AgeBand.AGE_20}>20대</option>
            <option value={AgeBand.AGE_30}>30대</option>
            <option value={AgeBand.AGE_40}>40대</option>
            <option value={AgeBand.AGE_50}>50대</option>
            <option value={AgeBand.AGE_60}>60대</option>
            <option value={AgeBand.AGE_70}>70대</option>
            <option value={AgeBand.AGE_80_PLUS}>80대 이상</option>
          </select>
        </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-modern-lg border border-slate-200/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('product_category')}
                  className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  상품분류
                  {sortConfig.key === 'product_category' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('question_type')}
                  className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  질문유형
                  {sortConfig.key === 'question_type' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('cot_status')}
                  className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  상태
                  {sortConfig.key === 'cot_status' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('updatedAt')}
                  className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  수정일
                  {sortConfig.key === 'updatedAt' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCots.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              currentCots.map((cot) => (
                  <tr
                    key={cot.id}
                    onClick={() => handleRowClick(cot)}
                    className="border-t border-slate-200/50 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-slate-100/50 cursor-pointer transition-all duration-200 hover-lift"
                  >
                <td className="px-4 py-3">
                  {cot.product_category === ProductCategory.SECURITIES ? '증권' : '보험'}
                </td>
                <td className="px-4 py-3">
                  {cot.question_type === QuestionType.CUSTOMER_CHARACTERISTICS && '고객특성 강조형'}
                  {cot.question_type === QuestionType.INVESTMENT_PREFERENCE && '투자성향 및 조건기반형'}
                  {cot.question_type === QuestionType.PRODUCT_COMPARISON && '상품 비교 추천형'}
                  {cot.question_type === QuestionType.AGE_LIFECYCLE && '연령별 및 생애주기 저축성 상품 추천형'}
                  {cot.question_type === QuestionType.INVESTMENT_PRODUCT && '투자성 상품 추천형'}
                  {cot.question_type === QuestionType.HEALTH_PROTECTION && '건강 및 질병보장 대비형'}
                </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        cot.cot_status === CotStatus.APPROVED ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        cot.cot_status === CotStatus.REVIEW_REQUESTED ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        cot.cot_status === CotStatus.DRAFT ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                    {cot.cot_status === CotStatus.APPROVED && '승인'}
                    {cot.cot_status === CotStatus.REVIEW_REQUESTED && '리뷰요청'}
                    {cot.cot_status === CotStatus.DRAFT && '작성중'}
                    {cot.cot_status === CotStatus.REJECTED && '반려'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(cot.updatedAt).toLocaleDateString('ko-KR')}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
        <div className="flex items-center gap-2">
          <label htmlFor="page_size" className="text-sm">
            페이지 크기:
          </label>
          <select
            id="page_size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            이전
          </button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoTListPage;