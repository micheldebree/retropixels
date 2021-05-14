| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node cli.js --overwrite -f png -o ./tmp.png paintface.jpg` | 533.6 ± 7.9 | 525.9 | 548.4 | 2.95 ± 0.05 |
| `node cli.js --overwrite -f png -h -o ./tmp.png paintface.jpg` | 653.8 ± 11.1 | 646.6 | 684.6 | 3.62 ± 0.07 |
| `node cli.js --overwrite -f png -h --nomaps -o ./tmp.png paintface.jpg` | 671.9 ± 12.3 | 658.5 | 702.3 | 3.72 ± 0.08 |
| `node cli.js --overwrite -f png -o ./tmp.png -m fli  paintface.jpg` | 547.9 ± 13.0 | 534.7 | 571.7 | 3.03 ± 0.08 |
| `node cli.js --overwrite -f png -o ./tmp.png -m afli -h paintface.jpg` | 180.7 ± 1.8 | 177.9 | 184.9 | 1.00 |
