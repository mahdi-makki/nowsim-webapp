# Android install screenshots

Two folders, one per tab:

```
install-android/
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

| Step | Shots | Screen                                                         |
| ---- | ----- | -------------------------------------------------------------- |
| 1    | 4     | Settings > Network & internet > SIMs > Add eSIM, then the code |
| 2    | 1     | Plan downloading / downloaded                                  |
| 3    | 1     | SIM detail, Use SIM toggle on                                  |
| 4    | 1     | Mobile data SIM picker, nowsim                                 |
| 5    | 1     | SIM detail, Roaming toggle on                                  |

Portrait PNG, 390 x 844 or any multiple of that ratio. Keep one ratio across all
files.
