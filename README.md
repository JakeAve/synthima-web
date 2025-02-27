# Synthima Password Generator

Generate random passwords using `crypto.getRandomValues` in Javascript. [See Web App.](https://synthima-password.deno.dev)

Built on top of JSR [Synthima](https://jsr.io/@jakeave/synthima).

## Search Params

Search params can be created by adding `symbols=<string>`, `min=<number>` and `max=<number>`. Sets of symbols will be parsed with their perspective max and mins in the order they are passed in. By default any symbol will be set to min 1 and no max.

Naturally it would be wise to url encode symbols that aren't always url
friendly.

```
?symbols=ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ&symbols=0123456789
```

```
?symbols=شسزرذدخحجثتباءيوهنملكقفغعظطضص&symbols=٠١٢٣٤٥٦٧٨٩
```

```
?symbols=ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ&symbols=αβγδεζηθικλμνξοπρσςτυφχψω&symbols=0123456789
```
