; vim:set ft=acme:
!source <basic_upstart.asm>

bitmap = $2000
screenRam = bitmap + 8000

+start_at $0810
+d018_vic_mem 1,1,0
+d016_screen_control 0,1,0

    lda #$3b
    sta $d011
    lda #0
    sta $d020
    ldx #0
-
    !for i, 0, 3 {
        lda i * $100 + screenRam,x
        sta i * $100 + $0400,x
    }
    inx
    bne -
    jmp *

!fill bitmap - * - 2
