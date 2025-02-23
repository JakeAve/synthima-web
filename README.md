# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

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
