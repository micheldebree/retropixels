| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node cli.js --overwrite -f png -o ./tmp.png paintface.jpg` | 542.6 ± 2.2 | 540.1 | 546.3 | 2.88 ± 0.04 |
| `node cli.js --overwrite -f png -h -o ./tmp.png paintface.jpg` | 667.2 ± 4.2 | 661.1 | 673.2 | 3.54 ± 0.05 |
| `node cli.js --overwrite -f png -h --nomaps -o ./tmp.png paintface.jpg` | 684.0 ± 10.3 | 676.3 | 703.9 | 3.63 ± 0.07 |
| `node cli.js --overwrite -f png -o ./tmp.png -m fli  paintface.jpg` | 553.6 ± 4.3 | 547.5 | 562.3 | 2.93 ± 0.05 |
| `node cli.js --overwrite -f png -o ./tmp.png -m afli -h paintface.jpg` | 188.7 ± 2.5 | 186.5 | 196.8 | 1.00 |
