; vim:set ft=c64jasm:

!include "macros.asm"

!let bitmap = $2000
!let screenRam = bitmap + 8000

+basic_upstart(begin)

begin:

+d018_vic_mem(1,1,0)
+d016_screen_control(0,1,0)

    lda #$3b
    sta $d011
    lda #0
    sta $d020
    ldx #0
loop:
    !for i in range(4) {
        lda i * $100 + screenRam,x
        sta i * $100 + $0400,x
    }
    inx
    bne loop
    jmp *

!fill bitmap - * - 2, 0
