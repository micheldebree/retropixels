| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node cli.js --overwrite -f png -o ./tmp.png paintface.jpg` | 768.2 ± 13.8 | 757.1 | 798.0 | 3.74 ± 0.18 |
| `node cli.js --overwrite -f png -h -o ./tmp.png paintface.jpg` | 1074.3 ± 15.5 | 1050.9 | 1101.3 | 5.23 ± 0.25 |
| `node cli.js --overwrite -f png -h --nomaps -o ./tmp.png paintface.jpg` | 1107.2 ± 15.6 | 1088.9 | 1131.1 | 5.39 ± 0.25 |
| `node cli.js --overwrite -f png -o ./tmp.png -m fli  paintface.jpg` | 780.2 ± 17.8 | 748.6 | 810.1 | 3.80 ± 0.19 |
| `node cli.js --overwrite -f png -o ./tmp.png -m afli -h paintface.jpg` | 205.5 ± 9.2 | 197.8 | 225.3 | 1.00 |
