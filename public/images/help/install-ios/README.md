# iOS install screenshots

Two folders, one per tab:

```
install-ios/
  manual/   step1-1.png  step1-2.png  step1-3.png  step1-4.png
            step2-1.png
            step3-1.png
            step4-1.png
            step5-1.png
  qr/       same shape
```

`stepN-M.png` — N is the step, M is the screenshot's position inside it, both
one-based. Missing files render as a dashed placeholder printing the filename,
so the page works before the art lands.

How many screenshots a step shows comes from `shots:` in `lib/install.ts`.
Change the number there if a step needs more or fewer than the layout below.

| Step | Shots | Screen                                                            |
| ---- | ----- | ----------------------------------------------------------------- |
| 1    | 4     | Settings > Mobile Data > Add eSIM > Set Up eSIM, then the details |
| 2    | 1     | Where will you use this eSIM, Abroad                              |
| 3    | 1     | Which type of plan, Data Only                                     |
| 4    | 1     | Plan detail, Turn On This Line                                    |
| 5    | 1     | Plan detail, Data Roaming on                                      |

Portrait PNG, 390 x 844 or any multiple of that ratio (a raw iPhone screenshot
at 1179 x 2556 fits). Keep one ratio across all files.
