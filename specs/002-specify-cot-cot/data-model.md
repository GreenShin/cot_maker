# Data Model: CoT/질문자/상품 (002-specify-cot-cot)

## Enums
- ProductCategory: Securities | Insurance
- QuestionType: Equity | Insurance | Fund | Other
- ProductType: Equity | Insurance | Fund | Other
- Gender: Male | Female
- AgeBand: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80plus
- CotStatus: Draft | InReview | Approved | Rejected

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
