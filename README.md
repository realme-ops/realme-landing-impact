# 리얼미 랜딩페이지 (impact-me.real-me.co.kr)

남성 이미지 컨설팅 '리얼미' 랜딩페이지. 8개 섹션 이미지를 세로로 쌓은 정적 페이지이며,
스크롤 고정 CTA 배너 · 스크롤 애니메이션 · 메타픽셀/GA4/GTM 트래킹이 포함되어 있습니다.

## 1. 이미지 넣기
`images/` 폴더에 8개 섹션 이미지를 아래 이름으로 저장하세요 (PNG):

```
images/section-1.png   # 단 한 번의 디렉팅으로 바뀐 분위기
images/section-2.png   # 만족도 99%의 기록
images/section-3.png   # 왜 소개팅에서 자꾸 까일까요
images/section-4.png   # 독보적인 분위기 설계
images/section-5.png   # 2000+명의 리얼 후기
images/section-6.png   # 리얼미 3단계 솔루션
images/section-7.png   # 서비스 진행 단계
images/section-8.png   # 서비스 운영 및 예약 안내
```

## 2. 트래킹 ID 교체
`index.html` 상단 `REALME_CONFIG` 의 세 값을 실제 ID로 바꾸고,
GTM noscript `<iframe>`의 `GTM-XXXXXXX` 도 같은 값으로 교체하세요.

```js
GTM_ID:        "GTM-XXXXXXX",
GA4_ID:        "G-XXXXXXXXXX",
META_PIXEL_ID: "0000000000000000"
```

ID를 비워두거나 기본 placeholder로 두면 해당 트래킹은 자동으로 로드되지 않습니다.

## 3. 내부 폼 연결
`index.html` 의 `#form-container` 안 placeholder를 내부 폼 임베드 코드(또는 폼 필드)로 교체하세요.
폼이 `<form>` 태그면 제출 시 `form_submit` / 메타픽셀 `CompleteRegistration` 이벤트가 자동 발사됩니다.

## 4. 배포 (GitHub Pages)
1. GitHub에서 새 레포 생성 후 이 폴더 내용을 push
2. 레포 **Settings → Pages → Source: `main` 브랜치 / 루트(`/`)** 선택
3. `CNAME` 파일이 포함돼 있어 커스텀 도메인은 자동 설정됨
4. **DNS 설정**: `real-me.co.kr` DNS 관리에서 CNAME 레코드 추가
   - 호스트/이름: `impact-me`
   - 값/대상: `<GitHub사용자명>.github.io`
5. Pages 설정에서 **Enforce HTTPS** 체크

## 로컬 미리보기
```
npx serve .
# 또는
python -m http.server 8000
```
