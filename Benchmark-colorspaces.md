| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node cli.js --overwrite -c rgb -o ./tmp.png paintface.jpg` | 548.1 ± 45.4 | 486.3 | 640.2 | 1.00 |
| `node cli.js --overwrite -c yuv -o ./tmp.png paintface.jpg` | 564.9 ± 48.2 | 519.3 | 665.1 | 1.03 ± 0.12 |
| `node cli.js --overwrite -c xyz -o ./tmp.png paintface.jpg` | 774.9 ± 27.2 | 742.0 | 829.8 | 1.41 ± 0.13 |
