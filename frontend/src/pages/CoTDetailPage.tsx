import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductCategory, QuestionType, CotStatus } from '../types/enums';
import { mockCotData, mockQuestionerData, mockProductData } from '../data/mockData';

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

interface Questioner {
  id: string;
  gender: string;
  age_band: string;
  product_category: ProductCategory;
  customer_risk_profile: string;
  cross_subscription: string;
  product_list: string[];
  product_count: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  product_category: ProductCategory;
  product_type: string;
  maturity_corpus: string;
  yield_corpus: string;
  risk_grade: string;
  tax_benefit: string;
  payment_type: string;
  loss_rate_corpus: string;
  liquidity: string;
  search_keywords_corpus: string;
  note_corpus: string;
  createdAt: string;
  updatedAt: string;
}

const CoTDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cot, setCot] = useState<CoT | null>(null);
  const [questioners, setQuestioners] = useState<Questioner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Partial<CoT>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [productCategoryWarning, setProductCategoryWarning] = useState<string>('');

  // Load data
  useEffect(() => {
    const cotData = mockCotData.find(c => c.id === id);
    if (cotData) {
      setCot(cotData as CoT);
      setFormData(cotData as CoT);
    }
    setQuestioners(mockQuestionerData as Questioner[]);
    setProducts(mockProductData as Product[]);
  }, [id]);

  // Track form changes
  useEffect(() => {
    if (cot && formData) {
      const hasChanges = JSON.stringify(cot) !== JSON.stringify(formData);
      setHasUnsavedChanges(hasChanges);
      if (hasChanges) {
        setShowUnsavedWarning(true);
      }
    }
  }, [formData, cot]);

  const handleInputChange = (field: keyof CoT, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCotStepChange = (index: number, value: string) => {
    const newSteps = [...(formData.cot_steps || [])];
    newSteps[index] = value;
    handleInputChange('cot_steps', newSteps);
  };

  const addCotStep = () => {
    const newSteps = [...(formData.cot_steps || []), ''];
    handleInputChange('cot_steps', newSteps);
  };

  const removeCotStep = (index: number) => {
    const newSteps = (formData.cot_steps || []).filter((_, i) => i !== index);
    handleInputChange('cot_steps', newSteps);
  };

  const handleSave = () => {
    setValidationError(null);
    setSaveSuccess(false);
    
    // Validate required fields
    if (!formData.question_text || formData.question_text.trim() === '') {
      setValidationError('질문은 필수 입력 항목입니다');
      return;
    }
    
    // Validate product category consistency
    if (formData.product_ids && formData.product_ids.length > 0) {
      const selectedProducts = products.filter(p => formData.product_ids?.includes(p.id));
      const hasInconsistentCategory = selectedProducts.some(p => p.product_category !== formData.product_category);
      
      if (hasInconsistentCategory) {
        setValidationError('선택된 상품의 상품분류가 CoT의 상품분류와 일치하지 않습니다.');
        return;
      }
    }
    
    // Simulate save
    console.log('Saving CoT:', formData);
    setHasUnsavedChanges(false);
    setShowUnsavedWarning(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (confirm('변경사항을 저장하지 않고 나가시겠습니까?')) {
        navigate('/cot-list');
      }
    } else {
      navigate('/cot-list');
    }
  };

  const handleQuestionerSelect = (questionerId: string) => {
    handleInputChange('questioner_id', questionerId);
  };

  const handleProductSelect = (productId: string) => {
    const currentProducts = formData.product_ids || [];
    if (currentProducts.includes(productId)) {
      handleInputChange('product_ids', currentProducts.filter(id => id !== productId));
    } else {
      handleInputChange('product_ids', [...currentProducts, productId]);
    }
  };

  if (!cot) {
    return <div className="p-6">CoT를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">CoT 상세</h1>
          <p className="text-slate-600">Chain of Thought 데이터를 편집하고 관리하세요</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm"
          >
            뒤로가기
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 gradient-primary text-white rounded-xl hover:shadow-modern-lg transition-all duration-200 font-medium shadow-modern"
          >
            저장
          </button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 shadow-modern">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            저장되었습니다!
          </div>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 shadow-modern">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {validationError}
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {showUnsavedWarning && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 shadow-modern">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            저장되지 않은 변경사항이 있습니다
          </div>
        </div>
      )}


      <div className="grid grid-cols-3 gap-8">
        {/* Left: Questioner Selection */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-modern border border-slate-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-6">질문자 선택</h2>
          {formData.questioner_id && (
            <div className="mb-6 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl text-sm border border-primary/20">
              <span className="font-medium text-primary">선택된 질문자:</span> {formData.questioner_id}
            </div>
          )}
          <div data-testid="questioner-list" className="space-y-3">
            {questioners.map((questioner) => (
              <div
                key={questioner.id}
                data-testid="questioner-item"
                onClick={() => handleQuestionerSelect(questioner.id)}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover-lift ${
                  formData.questioner_id === questioner.id 
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-modern' 
                    : 'border-slate-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100'
                }`}
              >
                <div className="text-sm">
                  <div>ID: {questioner.id}</div>
                  <div>성별: {questioner.gender === 'MALE' ? '남성' : '여성'}</div>
                  <div>연령대: {questioner.age_band}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: CoT Editor */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-modern border border-slate-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-6">CoT 편집</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="product_category" className="block text-sm font-medium mb-1">
                상품분류
              </label>
              <select
                id="product_category"
                value={formData.product_category || ''}
                onChange={(e) => handleInputChange('product_category', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded bg-background"
              >
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
                value={formData.question_type || ''}
                onChange={(e) => handleInputChange('question_type', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded bg-background"
              >
                <option value={QuestionType.CUSTOMER_CHARACTERISTICS}>고객특성 강조형</option>
                <option value={QuestionType.INVESTMENT_PREFERENCE}>투자성향 및 조건기반형</option>
                <option value={QuestionType.PRODUCT_COMPARISON}>상품 비교 추천형</option>
                <option value={QuestionType.AGE_LIFECYCLE}>연령별 및 생애주기 저축성 상품 추천형</option>
                <option value={QuestionType.INVESTMENT_PRODUCT}>투자성 상품 추천형</option>
                <option value={QuestionType.HEALTH_PROTECTION}>건강 및 질병보장 대비형</option>
              </select>
            </div>

            <div>
              <label htmlFor="question_text" className="block text-sm font-medium mb-1">
                질문
              </label>
              <textarea
                id="question_text"
                value={formData.question_text || ''}
                onChange={(e) => handleInputChange('question_text', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded bg-background"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">CoT 단계</label>
                <div className="flex gap-2">
                  <button
                    onClick={addCotStep}
                      className="px-3 py-2 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium"
                  >
                    단계 추가
                  </button>
                  <button
                    onClick={() => removeCotStep((formData.cot_steps || []).length - 1)}
                      className="px-3 py-2 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium"
                  >
                    단계 삭제
                  </button>
                </div>
              </div>
              {(formData.cot_steps || []).map((step, index) => (
                <div key={index} className="mb-2">
                  <label htmlFor={`cot_step_${index}`} className="block text-xs text-muted-foreground mb-1">
                    CoT 단계 {index + 1}
                  </label>
                  <textarea
                    id={`cot_step_${index}`}
                    value={step}
                    onChange={(e) => handleCotStepChange(index, e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="answer_text" className="block text-sm font-medium mb-1">
                답변
              </label>
              <textarea
                id="answer_text"
                value={formData.answer_text || ''}
                onChange={(e) => handleInputChange('answer_text', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded bg-background"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="cot_status" className="block text-sm font-medium mb-1">
                CoT 상태
              </label>
              <select
                id="cot_status"
                value={formData.cot_status || ''}
                onChange={(e) => handleInputChange('cot_status', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded bg-background"
              >
                <option value={CotStatus.DRAFT}>작성중</option>
                <option value={CotStatus.REVIEW_REQUESTED}>리뷰요청</option>
                <option value={CotStatus.APPROVED}>승인</option>
                <option value={CotStatus.REJECTED}>반려</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Product Selection */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-modern border border-slate-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-6">상품 선택</h2>
          {formData.product_ids && formData.product_ids.length > 0 && (
            <div className="mb-6 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl text-sm border border-primary/20">
              <span className="font-medium text-primary">선택된 상품:</span> {formData.product_ids.join(', ')}
            </div>
          )}
          <div data-testid="product-list" className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                data-testid={`product-item${product.product_category === ProductCategory.INSURANCE ? '-insurance' : ''}`}
                onClick={() => handleProductSelect(product.id)}
                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover-lift ${
                  (formData.product_ids || []).includes(product.id) 
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-modern' 
                    : 'border-slate-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100'
                }`}
              >
                <div className="text-sm">
                  <div className="font-medium">{product.name}</div>
                  <div>분류: {product.product_category === ProductCategory.SECURITIES ? '증권' : '보험'}</div>
                  <div>유형: {product.product_type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoTDetailPage;