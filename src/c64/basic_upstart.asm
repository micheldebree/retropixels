; vim:set ft=acme:
!macro start_at .address {
  * = $0801
  !byte $0c,$08,$00,$00,$9e
  !if .address >= 10000 { !byte 48 + ((.address / 10000) % 10) }
  !if .address >=  1000 { !byte 48 + ((.address /  1000) % 10) }
  !if .address >=   100 { !byte 48 + ((.address /   100) % 10) }
  !if .address >=    10 { !byte 48 + ((.address /    10) % 10) }
  !byte $30 + (.address % 10), $00, $00, $00
  * = .address
}

; Set the memory bank the VIC 'sees'
; bank=0: $0000-$3fff
; bank=1: $4000-$7fff
; bank=2: $8000-$bfff
; bank=3: $c000-$ffff
!macro vic_bank .bank {
         lda $dd00
         and #%11111100
         ora #(.bank AND %11) XOR %11
         sta $dd00
}

;$D018/53272/VIC+24:   Memory Control Register
;
;   +----------+---------------------------------------------------+
;   | Bits 7-4 |   Video Matrix Base Address (inside VIC)          |
;   | Bit  3   |   Bitmap-Mode: Select Base Address (inside VIC)   |
;   | Bits 3-1 |   Character Dot-Data Base Address (inside VIC)    |
;   | Bit  0   |   Unused                                          |
;   +----------+---------------------------------------------------+
;for starters: this register controls the adress of the bitmap or screen (this depends on the screenmode used) and character memory _relative_ to the VIC bank, so all adresses given from now on should be looked at like: VIC bank adress+adress
;
;Bitmap
;
;$D018 = %xxxx0xxx -> bitmap is at $0000
;$D018 = %xxxx1xxx -> bitmap is at $2000
;Character memory
;
;$D018 = %xxxx000x -> charmem is at $0000
;$D018 = %xxxx001x -> charmem is at $0800
;$D018 = %xxxx010x -> charmem is at $1000
;$D018 = %xxxx011x -> charmem is at $1800
;$D018 = %xxxx100x -> charmem is at $2000
;$D018 = %xxxx101x -> charmem is at $2800
;$D018 = %xxxx110x -> charmem is at $3000
;$D018 = %xxxx111x -> charmem is at $3800
;Screen memory
;
;$D018 = %0000xxxx -> screenmem is at $0000
;$D018 = %0001xxxx -> screenmem is at $0400
;$D018 = %0010xxxx -> screenmem is at $0800
;$D018 = %0011xxxx -> screenmem is at $0c00
;$D018 = %0100xxxx -> screenmem is at $1000
;$D018 = %0101xxxx -> screenmem is at $1400
;$D018 = %0110xxxx -> screenmem is at $1800
;$D018 = %0111xxxx -> screenmem is at $1c00
;$D018 = %1000xxxx -> screenmem is at $2000
;$D018 = %1001xxxx -> screenmem is at $2400
;$D018 = %1010xxxx -> screenmem is at $2800
;$D018 = %1011xxxx -> screenmem is at $2c00
;$D018 = %1100xxxx -> screenmem is at $3000
;$D018 = %1101xxxx -> screenmem is at $3400
;$D018 = %1110xxxx -> screenmem is at $3800
;$D018 = %1111xxxx -> screenmem is at $3c00

; .matrix_base: screenmem is at value * $0400
; .bitmap_base: 0: bitmap is at $0000
;               1: bitmap is at $2000
; .charset_base: charmem is at value * $0800
; All values are relative to VIC bank
!macro d018_vic_mem .matrix_base, .bitmap_base, .charset_base {
         .matrix_base_mask = (.matrix_base & %1111) << 4
         .bitmap_base_mask = (.bitmap_base & 1) << 3
         .charset_base_mask = (.charset_base & %111) << 1

         lda #.matrix_base_mask | .bitmap_base_mask | .charset_base_mask
         sta $d018
}

; .multicolor: 0 = off, 1 = on
; .screen_width: 0 = 38 columns, 1 = 40 columns
; .scroll: 0-7 horizontal scroll
!macro d016_screen_control .multicolor, .screen_width, .scroll {
         .multicolor_mask = (.multicolor & 1) << 4
         .screen_width_mask = (.screen_width & 1) << 3
         .scroll_mask = (.scroll & %111)

         lda #.multicolor_mask | .screen_width_mask | .scroll_mask
         sta $d016
}

