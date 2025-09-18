
# Implementation Plan: 현대적 반응형 CoT 게시판 웹앱

**Branch**: `002-specify-cot-cot` | **Date**: 2025-09-17 | **Spec**: `/Volumes/Workspace/Projects/Outer/NIA/2025/cot_maker/007/cursor/specs/002-specify-cot-cot/spec.md`
**Input**: Feature specification from `/specs/002-specify-cot-cot/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
현대적인 반응형 CoT 게시판을 구현한다. 좌측 아코디언 메뉴(CoT 리스트/설정), CoT 상세 3영역(좌: 질문자, 중: CoT 편집, 우: 상품), 설정 2영역(좌: 서브메뉴, 우: 화면)을 제공한다. 목록 화면은 shadcn/ui의 Data Table(@tanstack/react-table 기반)을 사용하며 다중 필터(상품분류/질문유형/성별/연령대), 정렬, 페이징을 제공한다. 초기에는 React + Vite 단일 프론트엔드로 시작하고, 지속 저장이 필요해지는 시점에 Node.js + SQLite 백엔드를 도입한다.

## Technical Context
**Language/Version**: TypeScript 5.x, React 18.x, Node.js 18 LTS, Vite 5.x  
**Primary Dependencies**: shadcn/ui, @radix-ui/react-*, @tanstack/react-table, react-router, zod, tailwindcss  
**Storage**: SQLite 3.x (초기 목/로컬 상태 → 필요 시 backend 추가)  
**Testing**: Vitest, @testing-library/react (선택: Playwright e2e)  
**Target Platform**: Web (Desktop/Tablet/Mobile)  
**Project Type**: web (초기: frontend only; 필요 시 backend 추가)  
**Performance Goals**: 테이블 상호작용 p95 < 200ms(1k 행), 60fps 스크롤  
**Constraints**: 로컬 개발 우선, 외부 네트워크 의존 금지(도입 시 근거 필요), 접근성 기본 준수  
**Scale/Scope**: 화면 그룹 3개(CoT 리스트/상세, 설정), 테이블 수천 행 가정

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Simplicity-First: React + Vite + shadcn/ui로 최소 구성 유지 → PASS
- 단일 웹 프로젝트: `frontend/`만으로 시작, 필요 시 `backend/` 추가 → PASS
- 테스트 기준선: 렌더 스모크(프론트), 마이그레이션/엔드포인트 테스트(백엔드 시) → PASS
- 데이터/마이그레이션: `data/app.db`(VCS 제외), `backend/migrations/*.sql`, `npm run migrate` 계획 → PASS
- 관측/버전: 에러 바운더리/콘솔 로그 최소, SemVer 적용 → PASS

Verdict: PASS (Initial)

## Project Structure

### Documentation (this feature)
```
specs/002-specify-cot-cot/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/tasks)
```

### Source Code (repository root)
```
frontend/
├── src/
│   ├── app/              # 라우팅/레이아웃
│   ├── components/ui/    # shadcn/ui 래퍼/공통 컴포넌트
│   ├── features/
│   │   ├── cot-list/
│   │   ├── cot-detail/
│   │   └── settings/
│   ├── lib/              # 유틸(zod 스키마 등)
│   └── styles/
└── tests/

# (필요 시)
backend/
├── src/
│   ├── api/
│   ├── models/
│   └── services/
├── migrations/
└── tests/
```

**Structure Decision**: Web application. 초기에는 `frontend/`만 생성(React + Vite). 지속 저장 요구가 명확해지면 `backend/`(Node + SQLite, 마이그레이션 포함)를 추가한다.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Data Table: 컬럼/필터 정의, 멀티 필터 조합, 페이징 vs 무한 스크롤
   - 반응형 레이아웃: 좌/중/우 3열 재배치 기준, 모바일 UX
   - 상태 관리: 필터 상태와 URL 쿼리 동기화, 상세 편집 미저장 경고
   - 접근성: 테이블 키보드 내비, 아코디언/모달 ARIA, 명도 대비
   - 테마/글꼴 크기: 전역 상태/컨텍스트와 즉시 반영 전략
   - 엔터티 스키마: CoT/질문자/상품 필드 및 유효성 기준
   - 백엔드 임계점: 목 데이터 한계, 저장/검색 성능 요구
   - 정렬/기본 정렬/검색어 하이라이트 정책

2. **Generate and dispatch research agents**:
```
For each unknown in Technical Context:
  Task: "Research {unknown} for CoT board"
For each technology choice:
  Task: "Best practices for {tech} in React/Vite + shadcn/ui"
```

3. **Consolidate findings** in `research.md` using format:
- Decision: [what was chosen]
- Rationale: [why chosen]
- Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh cursor`
   - Add only NEW tech; keep under 150 lines

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/.specify/memory/constitution.md`*
