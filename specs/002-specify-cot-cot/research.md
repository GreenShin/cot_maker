# Research: 결정 사항 및 근거 (002-specify-cot-cot)

## 1) 필터/정렬/페이징 정책
- Decision: 필터는 상품분류(증권/보험), 질문유형(enum), 성별(남/여), 연령대(10,20,...,80이상) 멀티 조합 지원. 기본 정렬은 최신 수정일 내림차순. 페이징은 페이지네이션(기본 페이지 크기 20) 채택.
- Rationale: 사용자가 빠르게 최신 작업을 찾는 요구. 서버가 없을 때도 클라이언트 페이지네이션 용이.
- Alternatives: 무한 스크롤(대량 데이터에 유리) → 초기 구현 복잡도 증가로 보류.

## 2) 반응형 브레이크포인트/레이아웃
- Decision: Tailwind 기준 sm=640, md=768, lg=1024, xl=1280.
  - CoT 상세 3열: xl 3열, lg 2열(좌+중 스택, 우 아래), md 이하 1열 스택.
- Rationale: 데이터 밀도와 가독성 균형.
- Alternatives: 완전 유동 grid → 복잡도 증가, 초기 범위 벗어남.

## 3) 접근성(A11y)
- Decision: 키보드 내비게이션(탭 순서 보장), 포커스 스타일, ARIA 라벨링(아코디언/모달/테이블 헤더), 명도 대비 WCAG AA.
- Rationale: 최소 접근성 기준 확보.
- Alternatives: 추가 단축키/스크린리더 최적화는 후속.

## 4) 테마/글꼴 크기
- Decision: theme(light/dark), fontScale(0.875~1.25, step 0.125). 즉시 적용.
- Rationale: 가독성/선호도 반영.
- Alternatives: 시스템 테마 연동은 후속 옵션.

## 5) 상태 관리/라우팅 동기화
- Decision: 필터/테이블 상태는 URL query와 동기화, 상세 편집은 내부 상태 + 미저장 가드.
- Rationale: 링크 공유/북마크 용이, 데이터 손실 방지.
- Alternatives: 전역 상태만 사용 → 링크 공유성 저하.

## 6) CoT 상태 enum
- Decision: Draft | InReview | Approved | Rejected.
- Rationale: 편집 워크플로우 최소 단계.
- Alternatives: 더 세분화된 단계는 후속.

## 7) 질문유형/상품유형 enum(초안)
- Decision: 질문유형: 주식형, 보험형, 펀드형, 기타. 상품유형: 주식형, 보험형, 펀드형, 기타.
- Rationale: 초기 커버리지 확보.
- Alternatives: 운영 중 확장.

## 8) 데이터 보존/자동 저장
- Decision: 자동 저장 미도입. 저장 버튼 기반, 이탈 시 확인 모달.
- Rationale: 단순/예측 가능.
- Alternatives: 초안 자동 저장 → 후속 고려.

## 9) 성능 목표
- Decision: 테이블 상호작용 p95 < 200ms(1k 행), 초기 로드 < 2s(목 데이터 기준).
- Rationale: 쾌적한 UX 기준.

---

Checklist
- [x] 필터/정렬/페이징 정책 정의
- [x] 반응형 브레이크포인트/재배치 정의
- [x] 접근성 최소 기준 정의
- [x] 테마/글꼴 전략 정의
- [x] 상태/라우팅 동기화 전략
- [x] CoT 상태/질문유형/상품유형 enum 초안
- [x] 자동 저장 정책
- [x] 성능 목표
