# Data Model: CoT/질문자/상품 (002-specify-cot-cot)

## Enums
Note: Stored values use Code (EN), UI displays Label (KO).

- ProductCategory:
  - SECURITIES = "증권"
  - INSURANCE = "보험"
- ProductType:
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
- QuestionType:
  - EMPHASIZE_CUSTOMER_CHARACTERISTICS = "고객특성 강조형"
  - RISK_PROFILE_CONDITION_BASED = "투자성향 및 조건기반형"
  - PRODUCT_COMPARISON_RECOMMENDATION = "상품 비교 추천형"
  - AGE_LIFECYCLE_SAVINGS_RECOMMENDATION = "연령별 및 생애주기 저축성 상품 추천형"
  - INVESTMENT_PRODUCT_RECOMMENDATION = "투자성 상품 추천형"
  - HEALTH_DISEASE_COVERAGE = "건강 및 질병보장 대비형"
- Gender:
  - MALE = "남성"
  - FEMALE = "여성"
- AgeBand:
  - A10 = "10"
  - A20 = "20"
  - A30 = "30"
  - A40 = "40"
  - A50 = "50"
  - A60 = "60"
  - A70 = "70"
  - A80_PLUS = "80이상"
- CotStatus:
  - DRAFT = "작성중"
  - IN_REVIEW = "리뷰요청"
  - APPROVED = "승인"
  - REJECTED = "반려"

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
