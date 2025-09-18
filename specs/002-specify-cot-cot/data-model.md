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

- RiskGrade (위험등급):
  - GRADE_1 = "1등급"
  - GRADE_2 = "2등급"
  - GRADE_3 = "3등급"
  - GRADE_4 = "4등급"
  - GRADE_5 = "5등급"
  - GRADE_6 = "6등급"

- TaxBenefit (세제혜택):
  - YES = "유"
  - NO = "무"

- PaymentType (납입형태):
  - LUMP_SUM = "일시납"
  - ADDITIONAL = "추가납입"
  - MIXED = "혼합"

- Liquidity (유동성):
  - REDEEMABLE = "중도환매 가능"
  - NON_REDEEMABLE = "중도환매 불가능"
  - NOT_APPLICABLE = "미해당"

## Entities

### Questioner
- id: string (uuid-like)
- name: string (1..80)
- gender: Gender
- ageBand: AgeBand
- categoryHint?: ProductCategory
- createdAt: ISO8601
- updatedAt: ISO8601

Validation:
- name required, length ≤ 80

### Product
- id: string (uuid-like)
- name: string (1..120)
- category: ProductCategory
- type: ProductType
- createdAt: ISO8601
- updatedAt: ISO8601

Validation:
- name required, length ≤ 120

### Cot
- id: string (uuid-like)
- productId: Product.id
- questionerId: Questioner.id
- productCategory: ProductCategory
- questionType: QuestionType
- questionText: string (1..2000)
- cotSteps: string[] (each 0..2000, order preserved)
- answerText: string (0..4000)
- status: CotStatus
- createdAt: ISO8601
- updatedAt: ISO8601

Validation:
- productId, questionerId required
- questionText required (≤ 2000)
- cotSteps length 0..20, each ≤ 2000
- answerText ≤ 4000

## Relationships
- Cot.productId → Product.id (many-to-one)
- Cot.questionerId → Questioner.id (many-to-one)

## Indexing (when backend added)
- Product(name), Product(category,type)
- Questioner(name, gender, ageBand)
- Cot(updatedAt desc), Cot(status, productCategory, questionType)

---

Checklist
- [x] Enums 정의(카테고리/유형/성별/연령/상태)
- [x] 엔터티 필드/유효성 규칙 정의
- [x] 관계와 인덱스 제안(백엔드 도입 시)
