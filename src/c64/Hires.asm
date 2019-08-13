!include "macros.asm"

!let bitmap = $2000
!let screenRam = bitmap + 8000

+start_at(begin)
+d018_vic_mem(1,1,0)
+d016_screen_control(0,1,0)

begin:
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
forever:
    jmp forever

fillfromhere:
!fill bitmap - fillfromhere - 2, 0
