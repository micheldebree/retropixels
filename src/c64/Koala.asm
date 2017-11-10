!source "basic_upstart.asm"

bitmap = $2000
screenRam = bitmap + 8000
colorRam = screenRam + 1000
background = colorRam + 1000

+start_at $0810

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
-
    !for i, 0, 3 {
        lda i * $100 + screenRam,x
        sta i * $100 + $0400,x
        lda i * $100 + colorRam,x
        sta i * $100 + $d800,x
    }
    inx
    bne -
    jmp *

!fill bitmap - * - 2
