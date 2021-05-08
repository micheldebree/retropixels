| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node cli.js --overwrite -c rgb -o ./tmp.png paintface.jpg` | 528.8 ± 7.1 | 517.2 | 539.4 | 1.00 ± 0.02 |
| `node cli.js --overwrite -c yuv -o ./tmp.png paintface.jpg` | 528.2 ± 10.0 | 515.6 | 549.3 | 1.00 |
| `node cli.js --overwrite -c xyz -o ./tmp.png paintface.jpg` | 750.7 ± 8.9 | 738.8 | 760.7 | 1.42 ± 0.03 |
