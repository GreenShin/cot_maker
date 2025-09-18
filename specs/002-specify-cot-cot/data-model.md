# Data Model: CoT/질문자/상품 (002-specify-cot-cot)

## Enums
Note: Stored values use Code (EN), UI displays Label (KO).

- ProductCategory (상품분류):
  - SECURITIES = "증권"
  - INSURANCE = "보험"

- ProductType (상품유형):
  - EQUITY = "주식형"
  - BOND = "채권형"
  - FUND_OF_FUNDS = "재간접"
  - MONEY_MARKET = "단기금융"
  - DERIVATIVE = "파생형"
  - TRUST_RETIREMENT = "신탁/퇴직연금"
  - PENSION = "연금"
  - WHOLE_LIFE = "종신"
  - TERM = "정기"
  - DISEASE = "질병"
  - HEALTH = "건강"
  - CANCER = "암"
  - VARIABLE = "변액"
  - NOT_APPLICABLE = "미해당"

- QuestionType (질문유형):
  - EMPHASIZE_CUSTOMER_CHARACTERISTICS = "고객특성 강조형"
  - RISK_PROFILE_CONDITION_BASED = "투자성향 및 조건기반형"
  - PRODUCT_COMPARISON_RECOMMENDATION = "상품 비교 추천형"
  - AGE_LIFECYCLE_SAVINGS_RECOMMENDATION = "연령별 및 생애주기 저축성 상품 추천형"
  - INVESTMENT_PRODUCT_RECOMMENDATION = "투자성 상품 추천형"
  - HEALTH_DISEASE_COVERAGE = "건강 및 질병보장 대비형"
  - NOT_APPLICABLE = "미해당"

- Gender (성별):
  - MALE = "남성"
  - FEMALE = "여성"
  - NOT_APPLICABLE = "미해당"

- AgeBand (연령대):
  - A20 = "20"
  - A30 = "30"
  - A40 = "40"
  - A50 = "50"
  - A60 = "60"
  - A70 = "70"
  - A80_PLUS = "80이상"
  - NOT_APPLICABLE = "미해당"

- CotStatus (CoT상태):
  - DRAFT = "작성중"
  - IN_REVIEW = "리뷰요청"
  - APPROVED = "승인"
  - REJECTED = "반려"

- CustomerRiskProfile (고객투자성향):
  - AGGRESSIVE = "공격투자형"
  - STABILITY_SEEKING = "안정추구형"
  - STABLE = "안정형"
  - RISK_NEUTRAL = "위험중립형"
  - ACTIVE = "적극투자형"
  - NOT_APPLICABLE = "미해당"

- CrossSubscription (교차가입):
  - COVERAGE_ONLY = "보장only"
  - VARIABLE_ONLY = "변액only"
  - OTHER_ONLY = "기타only"
  - COVERAGE_VARIABLE = "보장+변액"
  - COVERAGE_OTHER = "보장+기타"
  - VARIABLE_OTHER = "변액+기타"
  - COVERAGE_VARIABLE_OTHER = "보장+변액+기타"
  - NOT_APPLICABLE = "미해당"

- RiskGrade (위험등급):
  - GRADE_1 = "1등급"
  - GRADE_2 = "2등급"
  - GRADE_3 = "3등급"
  - GRADE_4 = "4등급"
  - GRADE_5 = "5등급"
  - GRADE_6 = "6등급"
  - NOT_APPLICABLE = "미해당"

- TaxBenefit (세제혜택):
  - YES = "유"
  - NO = "무"
  - NOT_APPLICABLE = "미해당"

- PaymentType (납입형태):
  - LUMP_SUM = "일시납"
  - ADDITIONAL = "추가납입"
  - MIXED = "혼합"
  - NOT_APPLICABLE = "미해당"

- Liquidity (유동성):
  - REDEEMABLE = "중도환매 가능"
  - NON_REDEEMABLE = "중도환매 불가능"
  - NOT_APPLICABLE = "미해당"

## Entities

### Questioner (질문자)
- id: string (uuid-like)
- gender: Gender
- age_band: AgeBand
- product_category: ProductCategory
- customer_risk_profile: CustomerRiskProfile
- cross_subscription: CrossSubscription
- product_list: string[] (Product.id[])
- product_count: number (≥ 0)
- created_at: ISO8601
- updated_at: ISO8601

Validation:
- product_count must equal length(product_list)

### Product (상품)
- id: string (uuid-like)
- name: string (1..120)
- product_category: ProductCategory
- product_type: ProductType
- maturity_corpus: text (만기)
- yield_corpus: text (수익률)
- risk_grade: RiskGrade
- tax_benefit: TaxBenefit
- payment_type: PaymentType
- loss_rate_corpus: text (손실율)
- liquidity: Liquidity
- search_keywords_corpus: text (검색키워드)
- note_corpus: text (비고)
- created_at: ISO8601
- updated_at: ISO8601

Validation:
- name required, length ≤ 120
- corpus fields are free text (no hard limit suggested)

### Cot (CoT)
- id: string (uuid-like)
- questioner_id: Questioner.id
- product_ids: string[] (Product.id[])
- product_category: ProductCategory
- question_type: QuestionType
- question_text: string (1..4000)
- cot_steps: string[] (length 3..10, each ≤ 4000, order preserved)
- answer_text: string (0..4000)
- cot_status: CotStatus
- created_at: ISO8601
- updated_at: ISO8601

Validation:
- questioner_id required
- product_ids length ≥ 1
- question_text required (≤ 4000)
- cot_steps length 3..10, each ≤ 4000
- answer_text ≤ 4000
 - All Product.product_category for product_ids must equal Cot.product_category (no mixed categories)

## Relationships
- Cot.product_ids[] → Product.id (many-to-many)
- Questioner.product_list[] → Product.id (many-to-many)
- Cot.questioner_id → Questioner.id (many-to-one)

## Indexing (when backend added)
- Product(name), Product(product_category, product_type, risk_grade, tax_benefit)
- Questioner(gender, age_band, product_category, customer_risk_profile, cross_subscription, product_count)
- Cot(updated_at desc), Cot(cot_status, product_category, question_type)

---

Checklist
- [x] Enums 정의(카테고리/유형/성별/연령/상태)
- [x] 엔터티 필드/유효성 규칙 정의
- [x] 관계와 인덱스 제안(백엔드 도입 시)
