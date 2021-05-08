| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node cli.js --overwrite -f png -o ./tmp.png paintface.jpg` | 800.5 ± 9.6 | 787.8 | 816.1 | 3.79 ± 0.08 |
| `node cli.js --overwrite -f png -h -o ./tmp.png paintface.jpg` | 1092.0 ± 8.6 | 1078.0 | 1112.1 | 5.17 ± 0.11 |
| `node cli.js --overwrite -f png -h --nomaps -o ./tmp.png paintface.jpg` | 1105.4 ± 10.8 | 1086.6 | 1123.1 | 5.24 ± 0.11 |
| `node cli.js --overwrite -f png -o ./tmp.png -m fli  paintface.jpg` | 799.3 ± 15.6 | 776.4 | 837.2 | 3.79 ± 0.10 |
| `node cli.js --overwrite -f png -o ./tmp.png -m afli -h paintface.jpg` | 211.1 ± 4.0 | 201.7 | 216.0 | 1.00 |
