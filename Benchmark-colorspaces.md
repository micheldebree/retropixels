| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node cli.js --overwrite -c rgb -o ./tmp.png paintface.jpg` | 402.9 ± 2.0 | 398.8 | 405.5 | 1.00 ± 0.01 |
| `node cli.js --overwrite -c yuv -o ./tmp.png paintface.jpg` | 402.7 ± 1.8 | 400.5 | 406.4 | 1.00 |
| `node cli.js --overwrite -c xyz -o ./tmp.png paintface.jpg` | 504.6 ± 3.3 | 501.0 | 509.8 | 1.25 ± 0.01 |
