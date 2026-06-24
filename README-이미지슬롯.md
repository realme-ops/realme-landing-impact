# 이미지 넣는 법 (impact-me-v2)

아래 파일명 그대로 `images/` 폴더에 저장하면 자리에 자동으로 들어갑니다.
(페이지에 회색 박스로 파일명이 적혀 있는 자리 = 그 파일명으로 넣으면 됨)

## 파일 형식
- 기본은 **.jpg** 로 맞춰져 있습니다. (png로 주시려면 알려주세요 — 경로 바꿔드림)
- 같은 파일명으로 덮어쓰면 새로고침 시 바로 반영됩니다.

## 슬롯 목록 (총 45개)

### 0) 상단 로고 — 이미 적용됨
```
images/logo-white.png   (히어로 상단 가운데, 화이트 REAL ME 로고 — 교체 불필요)
```

### 1) 히어로 비포/애프터 슬라이더 — 8쌍 (16장)
권장 비율: 세로 3:4
```
images/ba-before-1.jpg  ↔  images/ba-after-1.jpg
images/ba-before-2.jpg  ↔  images/ba-after-2.jpg
... (3,4,5,6,7) ...
images/ba-before-8.jpg  ↔  images/ba-after-8.jpg
```

### 2) 카톡 후기 캡처 — 3장
세로로 긴 캡처 OK
```
images/kakao-1.jpg
images/kakao-2.jpg
images/kakao-3.jpg
```

### 3) 인물 마퀴(자동 슬라이딩) — 16장
권장 비율: 세로 3:4
```
images/look-1.jpg ~ images/look-16.jpg
```
> 각 사진 아래에 익명 처리된 한 줄 후기(이름·별점·짧은 코멘트)가 자동으로 붙습니다.
> 후기 문구를 바꾸고 싶으면 main.js의 `REVIEWS` 배열을 수정하거나 말씀해 주세요.

### 4) "2000명+의 실제 후기" 카드 사진 — 3장
정사각 1:1
```
images/review-1.jpg   (연*혁 후기)
images/review-2.jpg   (문*진 후기)
images/review-3.jpg   (박*원 후기)
```

### 5) 리얼미 진행 단계 사진 — 4장 (솔루션+프로세스 합침)
가로 4:3
```
images/step-1.jpg  (상담 신청 & 사전질문 작성)
images/step-2.jpg  (1:1 대면 상담)
images/step-3.jpg  (프라이빗 피팅 / 현장 디렉팅)
images/step-4.jpg  (최종 큐레이션)
```

## 참고
- 마퀴는 16장 기준. 더 많은 장수를 원하면 알려주세요(코드에서 개수 조정).
- 텍스트(후기/솔루션/프로세스 문구)는 기존 내용 기반입니다. 바꾸고 싶으면 말씀해 주세요.
