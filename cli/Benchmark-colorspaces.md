| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node cli.js --overwrite -c rgb -o ./tmp.png paintface.jpg` | 404.4 ± 8.9 | 395.7 | 424.2 | 1.00 |
| `node cli.js --overwrite -c yuv -o ./tmp.png paintface.jpg` | 416.7 ± 25.8 | 401.7 | 489.0 | 1.03 ± 0.07 |
| `node cli.js --overwrite -c xyz -o ./tmp.png paintface.jpg` | 515.5 ± 11.9 | 496.0 | 528.8 | 1.27 ± 0.04 |
