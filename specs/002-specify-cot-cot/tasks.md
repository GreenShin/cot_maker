# Tasks: 현대적 반응형 CoT 게시판 웹앱 (002-specify-cot-cot)

**Input**: Design documents from `/specs/002-specify-cot-cot/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
2. Load optional design documents if exist (data-model.md, contracts/, research.md, quickstart.md)
3. Generate tasks by category with TDD ordering and parallelization rules
4. Number tasks (T001..), include file paths, add dependency notes
5. Validate completeness
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup
- [ ] T001 Create `frontend/` Vite+React TS app scaffold
  - Path: `frontend/`
  - Notes: Initialize with React+TS template, Tailwind enabled
- [ ] T002 Install core deps in `frontend/`: shadcn/ui, @tanstack/react-table, react-router, zod, tailwindcss, testing libs
  - Path: `frontend/package.json`
- [ ] T003 [P] Configure Tailwind/PostCSS and base styles
  - Paths: `frontend/tailwind.config.ts`, `frontend/postcss.config.js`, `frontend/src/styles/globals.css`
- [ ] T004 [P] Setup ESLint/Prettier/Vitest configs
  - Paths: `frontend/.eslintrc.*`, `frontend/.prettierrc`, `frontend/vite.config.ts`, `frontend/tsconfig.json`

## Phase 3.2: Tests First (TDD)
- [ ] T005 [P] Render smoke test for root app
  - Path: `frontend/tests/unit/app.smoke.test.tsx`
- [ ] T006 [P] Integration test: CoT 리스트 필터링/정렬/페이징 동작
  - Path: `frontend/tests/integration/cot-list.filtering.test.ts`
- [ ] T007 [P] Integration test: CoT 상세 편집(미저장 경고, 저장 피드백)
  - Path: `frontend/tests/integration/cot-detail.editing.test.ts`
- [ ] T008 [P] Integration test: 설정(토글/테마/글꼴) 즉시 반영
  - Path: `frontend/tests/integration/settings.apply.test.ts`

## Phase 3.3: Core Implementation
- [ ] T009 Scaffold app layout with Left Accordion (CoT 리스트/설정)
  - Paths: `frontend/src/app/routes.tsx`, `frontend/src/app/layout.tsx`, `frontend/src/components/ui/accordion.tsx`
- [ ] T010 Implement CoT 리스트 page with shadcn Data Table
  - Paths: `frontend/src/features/cot-list/page.tsx`, `frontend/src/features/cot-list/table.tsx`
  - Notes: @tanstack/react-table 기반 컬럼 정의, 정렬/페이징/필터 바
- [ ] T011 Implement 필터 컴포넌트(상품분류/질문유형/성별/연령대)
  - Path: `frontend/src/features/cot-list/filters.tsx`
- [ ] T012 Wire URL query sync for filters and table state
  - Path: `frontend/src/features/cot-list/state.ts`
- [ ] T013 Implement CoT 상세 3영역 레이아웃(좌/중/우)
  - Path: `frontend/src/features/cot-detail/page.tsx`
- [ ] T014 Implement Left panel: 질문자 검색/선택
  - Path: `frontend/src/features/cot-detail/left-questioner.tsx`
- [ ] T015 Implement Center panel: CoT 편집 폼(드롭다운/textarea/가변 CoTn)
  - Path: `frontend/src/features/cot-detail/center-editor.tsx`
- [ ] T016 Implement Right panel: 상품 검색/선택
  - Path: `frontend/src/features/cot-detail/right-product.tsx`
- [ ] T017 Implement Settings two-pane (left submenu, right content)
  - Path: `frontend/src/features/settings/page.tsx`
- [ ] T018 Implement Settings: 기본 설정(작성자, 수정가능 토글, 글꼴 슬라이더, 라이트/다크)
  - Path: `frontend/src/features/settings/general.tsx`
- [ ] T019 Implement Settings: 질문자 리스트(필터/Push 상세)
  - Path: `frontend/src/features/settings/questioners.tsx`
- [ ] T020 Implement Settings: 상품 리스트(필터/Push 상세)
  - Path: `frontend/src/features/settings/products.tsx`

## Phase 3.4: Integration
- [ ] T021 [P] App-wide theme/font size context & provider
  - Path: `frontend/src/app/theme-context.tsx`
- [ ] T022 [P] Form state management and unsaved-changes guard
  - Path: `frontend/src/lib/form-guard.tsx`
- [ ] T023 [P] Mock data services for CoT/질문자/상품 + adapters
  - Paths: `frontend/src/services/cot.ts`, `frontend/src/services/questioner.ts`, `frontend/src/services/product.ts`
- [ ] T024 [P] Accessibility pass: ARIA roles, keyboard navigation, focus traps
  - Paths: `frontend/src/components/ui/*`, feature pages

## Phase 3.5: Polish
- [ ] T025 [P] Unit tests for filters/table utils
  - Path: `frontend/tests/unit/table.utils.test.ts`
- [ ] T026 [P] Performance checks for Data Table interactions (<200ms p95)
  - Path: `frontend/tests/perf/table.perf.test.ts`
- [ ] T027 [P] Update docs: quickstart with dev/build/test commands
  - Path: `specs/002-specify-cot-cot/quickstart.md`
- [ ] T028 [P] Update agent file (active tech list)
  - Path: repository root agent file
 - [ ] T029 [P] Author research.md (decisions for filters, breakpoints, A11y, state)
   - Path: `specs/002-specify-cot-cot/research.md`
 - [ ] T030 [P] Author data-model.md (entities, enums, validation rules)
   - Path: `specs/002-specify-cot-cot/data-model.md`

## Phase 3.3 (continued): Filters & Validation Enhancements
- [ ] T031 Extend filters with new enums (고객투자성향/교차가입/위험등급/세제혜택/납입형태/유동성)
  - Path: `frontend/src/features/cot-list/filters.tsx`
- [ ] T032 Sync URL query for new filters (e.g., `risk_profile=AGGRESSIVE&cross=COVERAGE_VARIABLE`)
  - Path: `frontend/src/features/cot-list/state.ts`
- [ ] T033 [P] Unit tests for filter <-> URL mapping and label rendering
  - Path: `frontend/tests/unit/filters.url.test.ts`
- [ ] T034 [P] Integration test: advanced filters combined behavior
  - Path: `frontend/tests/integration/cot-list.advanced-filters.test.ts`
- [ ] T035 Implement CoT category consistency validation and UI error
  - Paths: `frontend/src/features/cot-detail/center-editor.tsx`, `frontend/src/services/validation.ts`
- [ ] T036 [P] Warning when product_ids not in questioner.product_list + "추가" 액션
  - Paths: `frontend/src/features/cot-detail/left-questioner.tsx`, `frontend/src/features/cot-detail/right-product.tsx`
- [ ] T037 [P] i18n labels: add mappings for new enums
  - Paths: `frontend/src/i18n/labels.ts`, `frontend/tests/unit/i18n.labels.test.ts`
- [ ] T038 Update docs: quickstart params for advanced filters
  - Path: `specs/002-specify-cot-cot/quickstart.md`

## Dependencies
- Setup (T001-T004) → Tests (T005-T008) → Core (T009-T020) → Integration (T021-T024) → Polish (T025-T028)
- 테이블 util 테스트(T025)는 테이블 구현(T010-T012) 이후
- 미저장 가드(T022)는 상세 편집(T013-T016) 이후
 - T033/T034는 T031-T032 이후
 - T035는 T015/T016 및 validation helper 준비 후
 - T036는 좌/우 패널 기본 구현(T014/T016) 이후

## Parallel Example
```
# Example parallel batch [P]:
Task: "T003 Configure Tailwind and base styles"
Task: "T004 Setup ESLint/Prettier/Vitest"
Task: "T005 Render smoke test for root app"
Task: "T006 Integration test: CoT 리스트 필터링"
```

## Validation Checklist
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] Data Table covers sort/filter/pagination
- [ ] Settings immediately apply theme/font changes
- [ ] Unsaved-changes guard active on navigation
