!include "macros.asm"

!let bitmap = $2000
!let screenRam = bitmap + 8000
!let colorRam = screenRam + 1000
!let background = colorRam + 1000

+basic_upstart(start)

start:

    lda #$18
    sta $d018
    lda #$d8
    sta $d016
    lda #$3b
    sta $d011
    lda #0
    sta $d020
    lda background
    sta $d021
    ldx #0
loop:
    !for i in range(4) {
        lda i * $100 + screenRam,x
        sta i * $100 + $0400,x
        lda i * $100 + colorRam,x
        sta i * $100 + $d800,x
    }
    inx
    bne loop
    jmp *

!fill bitmap - * - 2, 0
