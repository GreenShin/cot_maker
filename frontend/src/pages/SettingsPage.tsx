import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCategory, ProductType, Gender, AgeBand } from '../types/enums';
import { mockQuestionerData, mockProductData } from '../data/mockData';

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

type SettingsMenu = 'basic' | 'questioners' | 'products';

const SettingsPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<SettingsMenu>('basic');
  const [settings, setSettings] = useState({
    authorName: '',
    questionerEditable: false,
    productEditable: false,
    fontSize: 14,
    darkMode: false,
  });
  const [questioners, setQuestioners] = useState<Questioner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    product_category: '',
    gender: '',
    age_band: '',
    product_type: '',
  });
  const navigate = useNavigate();

  // Load data
  useEffect(() => {
    setQuestioners(mockQuestionerData as Questioner[]);
    setProducts(mockProductData as Product[]);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Apply font size changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
  }, [settings.fontSize]);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleQuestionerClick = (questionerId: string) => {
    navigate(`/questioner/${questionerId}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const filteredQuestioners = questioners.filter(q => {
    if (filters.product_category && q.product_category !== filters.product_category) return false;
    if (filters.gender && q.gender !== filters.gender) return false;
    if (filters.age_band && q.age_band !== filters.age_band) return false;
    return true;
  });

  const filteredProducts = products.filter(p => {
    if (filters.product_category && p.product_category !== filters.product_category) return false;
    if (filters.product_type && p.product_type !== filters.product_type) return false;
    return true;
  });

  const renderBasicSettings = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">기본 설정</h2>
      
      <div>
        <label htmlFor="author_name" className="block text-sm font-medium mb-1">
          작성자 이름
        </label>
        <input
          id="author_name"
          type="text"
          value={settings.authorName}
          onChange={(e) => handleSettingChange('authorName', e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="questioner_editable"
          type="checkbox"
          checked={settings.questionerEditable}
          onChange={(e) => handleSettingChange('questionerEditable', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="questioner_editable" className="text-sm">
          질문자 수정가능여부
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="product_editable"
          type="checkbox"
          checked={settings.productEditable}
          onChange={(e) => handleSettingChange('productEditable', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="product_editable" className="text-sm">
          상품 수정가능여부
        </label>
      </div>

      <div>
        <label htmlFor="font_size" className="block text-sm font-medium mb-1">
          글꼴 크기: {settings.fontSize}px
        </label>
        <input
          id="font_size"
          type="range"
          min="12"
          max="24"
          value={settings.fontSize}
          onChange={(e) => handleSettingChange('fontSize', Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="dark_mode"
          type="checkbox"
          checked={settings.darkMode}
          onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="dark_mode" className="text-sm">
          다크 모드
        </label>
      </div>
    </div>
  );

  const renderQuestionerList = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">질문자 목록</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="q_product_category" className="block text-sm font-medium mb-1">
            상품분류
          </label>
          <select
            id="q_product_category"
            value={filters.product_category}
            onChange={(e) => setFilters(prev => ({ ...prev, product_category: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
          >
            <option value="">전체</option>
            <option value={ProductCategory.SECURITIES}>증권</option>
            <option value={ProductCategory.INSURANCE}>보험</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="q_gender" className="block text-sm font-medium mb-1">
            성별
          </label>
          <select
            id="q_gender"
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
          >
            <option value="">전체</option>
            <option value={Gender.MALE}>남성</option>
            <option value={Gender.FEMALE}>여성</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="q_age_band" className="block text-sm font-medium mb-1">
            연령대
          </label>
          <select
            id="q_age_band"
            value={filters.age_band}
            onChange={(e) => setFilters(prev => ({ ...prev, age_band: e.target.value }))}
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

      <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-modern border border-slate-200/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">성별</th>
              <th className="px-4 py-3 text-left">연령대</th>
              <th className="px-4 py-3 text-left">상품분류</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestioners.map((questioner) => (
              <tr
                key={questioner.id}
                onClick={() => handleQuestionerClick(questioner.id)}
                className="border-t border-slate-200/50 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-slate-100/50 cursor-pointer transition-all duration-200 hover-lift"
              >
                <td className="px-4 py-3">{questioner.id}</td>
                <td className="px-4 py-3">{questioner.gender === 'MALE' ? '남성' : '여성'}</td>
                <td className="px-4 py-3">{questioner.age_band}</td>
                <td className="px-4 py-3">
                  {questioner.product_category === ProductCategory.SECURITIES ? '증권' : '보험'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProductList = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">상품 목록</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="p_product_category" className="block text-sm font-medium mb-1">
            상품분류
          </label>
          <select
            id="p_product_category"
            value={filters.product_category}
            onChange={(e) => setFilters(prev => ({ ...prev, product_category: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
          >
            <option value="">전체</option>
            <option value={ProductCategory.SECURITIES}>증권</option>
            <option value={ProductCategory.INSURANCE}>보험</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="p_product_type" className="block text-sm font-medium mb-1">
            상품유형
          </label>
          <select
            id="p_product_type"
            value={filters.product_type}
            onChange={(e) => setFilters(prev => ({ ...prev, product_type: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
          >
            <option value="">전체</option>
            <option value="EQUITY">주식형</option>
            <option value="BOND">채권형</option>
            <option value="REIT">재간접</option>
            <option value="SHORT_TERM">단기금융</option>
            <option value="DERIVATIVE">파생형</option>
            <option value="TRUST_PENSION">신탁/퇴직연금</option>
            <option value="ANNUITY">연금</option>
            <option value="WHOLE_LIFE">종신</option>
            <option value="TERM">정기</option>
            <option value="DISEASE">질병</option>
            <option value="HEALTH">건강</option>
            <option value="CANCER">암</option>
            <option value="VARIABLE">변액</option>
          </select>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-modern border border-slate-200/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">상품명</th>
              <th className="px-4 py-3 text-left">분류</th>
              <th className="px-4 py-3 text-left">유형</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="border-t border-slate-200/50 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-slate-100/50 cursor-pointer transition-all duration-200 hover-lift"
              >
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">
                  {product.product_category === ProductCategory.SECURITIES ? '증권' : '보험'}
                </td>
                <td className="px-4 py-3">{product.product_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">설정</h1>
        <p className="text-slate-600">애플리케이션 설정을 관리하고 데이터를 확인하세요</p>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Left: Submenu */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-modern border border-slate-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-6">서브메뉴</h2>
          <div className="space-y-3">
            <button
              onClick={() => setActiveMenu('basic')}
              className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 hover-lift ${
                activeMenu === 'basic' 
                  ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-modern' 
                  : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-medium">기본 설정</span>
            </button>
            <button
              onClick={() => setActiveMenu('questioners')}
              className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 hover-lift ${
                activeMenu === 'questioners' 
                  ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-modern' 
                  : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-medium">질문자 리스트</span>
            </button>
            <button
              onClick={() => setActiveMenu('products')}
              className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 hover-lift ${
                activeMenu === 'products' 
                  ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-modern' 
                  : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-medium">상품 리스트</span>
            </button>
          </div>
        </div>

        {/* Right: Settings Screen */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-modern border border-slate-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-6">설정 화면</h2>
          {activeMenu === 'basic' && renderBasicSettings()}
          {activeMenu === 'questioners' && renderQuestionerList()}
          {activeMenu === 'products' && renderProductList()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;