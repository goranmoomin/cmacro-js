# cmacro-js
## 파일 설명
* `index.js`: 문자열 코드 받아서 expand
* `expand.js`: 메인 코드, `expand`(`module.exports`) 함수가 문자열을 받아서 팽창된 문자열을 뱉음
* `match.js`: 매크로 matching 코드, `match` 함수가 토큰의 배열에서 매크로 패턴을 찾음
* `textify.js`: 토큰 배열에서 문자열로 다시 바뀌주는 함수
* `y.js`: [why combinator](https://raganwald.com/2018/09/10/why-y.html)
* `globals.js`: `gensym` 같은 함수 정의
* `grammar.ne`: 파싱 문법
