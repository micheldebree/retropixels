!to "AFLIShower.prg", cbm
!source "basic_upstart.asm"

tab18   = $0e00
tab11   = $0f00
fli = $4000
bgcolor = $7f40

+start_at $1000

         jmp start
irq0:    pha
         lda $d019
         sta $d019
         inc $d012
         lda #<irq1
         sta $fffe      ; set up 2nd IRQ to get a stable IRQ
         cli

        ; Following here: A bunch of NOPs which allow the 2nd IRQ
        ; to be triggered with either 0 or 1 clock cycle delay
        ; resulting in an "almost" stable IRQ.

         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
         nop
irq1:
ntsc1:   lda #$ea       ; modified to NOP NOP on NTSC
         lda #$08
         sta $d018      ; setup first color RAM address early
         lda #$38
         sta $d011      ; setup first DMA access early
         pla
         pla
         pla
         lda $d019
         sta $d019
         lda #$2d
         sta $d012
         lda #<irq0
         sta $fffe      ; switch IRQ back to first stabilizer IRQ
         lda $d012
         cmp $d012      ; stabilize last jittering cycle
         beq delay      ; if equal, 2 cycles delay. else 3 cycles delay
delay:
         stx savex+1

         ldx #$0d
wait:    dex
         bne wait

ntsc2:   lda #$ea       ; modified to NOP NOP on NTSC
ntsc3:   lda #$ea       ; modified to NOP NOP on NTSC

        ; Following here is the main FLI loop which forces the VIC-II to read
        ; new color data each rasterline. The loop is exactly 23 clock cycles
        ; long so together with 40 cycles of color DMA this will result in
        ; 63 clock cycles which is exactly the length of a PAL C64 rasterline. 

        nop
        nop
l0:
        lda tab18+1,x
        sta $d018      ; set new color RAM address
        lda tab11+1,x
        sta $d011      ; force new color DMA
        inx            ; FLI bug $D800 color = 8 (orange)
        cpx #199       ; last rasterline?
ntsc4:  bne l0         ; branches to l0-1 on NTSC for 2 extra cycles per rasterline

        lda #$70
        sta $d011      ; open upper/lower border

;       lda $d016
;       eor #$01       ; IFLI: 1 hires pixel shift every 2nd frame
;       sta $d016
;       lda $dd00
;       eor #$02       ; IFLI: flip between banks $4000 and $C000 every frame
;       sta $dd00

savex:  ldx #$00
        pla
nmi:    rti

start:
         sei
         lda #$35
         sta $01        ; disable all ROMs
         lda #$7f
         sta $dc0d      ; no timer IRQs
         lda $dc0d      ; clear timer IRQ flags

         lda #$2b
         sta $d011
         lda #$2d
         sta $d012

         lda #<nmi
         sta $fffa
         lda #>nmi
         sta $fffb      ; dummy NMI to avoid crashing due to RESTORE
         lda #<irq0
         sta $fffe
         lda #>irq0
         sta $ffff
         lda #$01
         sta $d01a      ; enable raster IRQs

        jsr initgfx
        jsr inittables
        jsr ntscfix

        lda $d019
        dec $d019      ; clear raster IRQ flag
        cli
        jmp *          ; that's it, no more action needed

initgfx:
         lda #$00
         sta $d015      ; disable sprites
         sta $d020      ; border color black

         lda bgcolor      ; background color
         sta $d021

         lda #$ff
         sta $7fff      ; upper/lower border black

         lda #$08
         sta $d016
         lda #$08
         sta $d018
         lda #$96       ; VIC bank $4000-$7FFF
         sta $dd00

         rts

inittables:
         ldx #$00
-        txa
         asl
         asl
         asl
         asl
         and #$70       ; color RAMs at $4000
         ora #$08       ; bitmap data at $6000
         sta tab18,x    ; calculate $D018 table
         txa
         and #$07
         ora #$38       ; bitmap
         sta tab11,x    ; calculate $D011 table
         inx
         bne -
         rts

ntscfix:
         bit $d011
         bmi *-3
         bit $d011      ; wait for rasterline 256
         bpl *-3
         lda #$00
-        cmp $d012
         bcs +
         lda $d012      ; get rasterline low byte
+        bit $d011
         bmi -
         cmp #$20       ; PAL: $37, NTSC: $05 or $06
         bcs +

         lda #$ea
         sta ntsc1
         sta ntsc2
         sta ntsc3
         dec ntsc4+1
+        rts

!fill fli - * - 2

