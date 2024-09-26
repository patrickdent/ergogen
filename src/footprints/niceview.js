const VCC = "VCC"
const GND = "GND"
const SDA = "SDA"
const SCL = "SCL"
const CS = "CS"

module.exports = {
    params: {
        designator: 'Nice!View',
        side: 'F',
        outline: false,
        VCC_from: undefined,
        VCC_to: undefined,
        GND_from: undefined,
        GND_to: undefined,
        SDA_from: undefined,
        SDA_to: undefined,
        SCL_from: undefined,
        SCL_to: undefined,
        CS_from: undefined,
        CS_to: undefined,
    },
    body: p => {
        const nets = {
            VCC: {
                nn_pin: 121,
                nn_net: p.VCC_to,
                pin: 2,
                net: p.VCC_from,
            },
            GND: {
                nn_pin: 3,
                nn_net: p.GND_to,
                pin: 1,
                net: p.GND_from,
            },
            SDA: {
                nn_pin: 4,
                nn_net: p.SDA_to,
                pin: 4,
                net: p.SDA_from,
            },
            SCL: {
                nn_pin: 5,
                nn_net: p.SCL_to,
                pin: 3,
                net: p.SCL_from,
            },
            CS: {
                nn_pin: 6,
                nn_net: p.CS_to,
                pin: 6,
                net: p.CS_from,
            },
        }

        const via_sep = 2
        const gen_via = (from_x, from_y, num, net) => {
            return `
              (pad ${num} thru_hole circle (at ${from_x + via_sep} ${from_y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${net})
            `
          }
      
        const jumper_sep = 0.725
        const jumper_from_x = 2
        const jumper_to_x = jumper_from_x + jumper_sep
        const gen_jumper_pad = (y, rotation, from_net, to_net, side) => {
            return `
              ${ /* pad from nice!view */ ''}
              (pad ${nets[from_net].pin} smd custom (at ${jumper_from_x} ${y} ${rotation}) (size 0.2 0.2) (layers ${side}.Cu ${side}.Mask) ${nets[from_net].net.str}
                (zone_connect 2)
                (options (clearance outline) (anchor rect))
                (primitives
                  (gr_poly (pts
                    (xy ${-0.5} ${-0.625}) (xy ${-0.25} ${-0.625}) (xy ${0.25} 0) (xy ${-0.25} ${0.625}) (xy ${-0.5} ${0.625})
                ) (width 0))
              ))
              ${ /* pad to mcu */ ''}
              (pad ${nets[to_net].nn_pin} smd custom (at ${jumper_to_x} ${y} ${rotation}) (size 0.2 0.2) (layers ${side}.Cu ${side}.Mask) ${nets[to_net].nn_net.str}
                (zone_connect 2)
                (options (clearance outline) (anchor rect))
                (primitives
                  (gr_poly (pts
                    (xy ${-0.65} ${-0.625}) (xy ${0.5} ${-0.625}) (xy ${0.5} ${0.625}) (xy ${-0.65} ${0.625}) (xy ${-0.15} 0)
                ) (width 0))
              ))
            `
        }

        const gen_pin = (front_net, back_net, position, omit_jumpers=false) => {
            let base = `
                (pad ${nets[front_net].pin} thru_hole oval (at 0.0 ${position} ${p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask)
                ${nets[front_net].net.str})
            `
            if (omit_jumpers) {
                return base
            }
            return `
                ${base} 
                ${gen_jumper_pad(position, p.rot, front_net, front_net, "F")}
                ${gen_jumper_pad(position, p.rot, front_net, back_net, "B")}
                ${gen_via(jumper_from_x, position, nets[front_net].pin, nets[front_net].nn_net.str)}
            `
        }
        const standard = `
            (module lib:niceview_headers (layer F.Cu) (tedit 648E0265)
            ${p.at /* parametric position */} 

            ${'' /* footprint reference */}        
            (fp_text reference "${p.ref}" (at -1.6 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1 1) (thickness 0.15))))
            
            ${'' /* pins */}
            ${gen_pin(SDA, CS, -5.08)}
            ${gen_pin(SCL, GND, -2.54)}
            ${gen_pin(VCC, VCC, 0, true)}
            ${gen_pin(GND, SCL, 2.54)}
            ${gen_pin(CS, SDA, 5.08)}

            ${'' /* corner marks */}
            (fp_line (start -1.25 -7) (end -1.25 7) (layer Dwgs.User) (width 0.15))
            (fp_line (start -1.25 7) (end 34.75 7) (layer Dwgs.User) (width 0.15))
            (fp_line (start 34.75 7) (end 34.75 -7) (layer Dwgs.User) (width 0.15))
            (fp_line (start 34.75 -7) (end -1.25 -7) (layer Dwgs.User) (width 0.15))

        `

        function outline() {
            return `
              ${'' /* Nice!View outline */}
              ${'' /* front */}
              (fp_line (start -1.25 -6.5) (end -1.25 6.5) (layer F.SilkS) (width 0.15))
              (fp_line (start -1.25 6.5) (end 1.25 6.5) (layer F.SilkS) (width 0.15))
              (fp_line (start 1.25 6.5) (end 1.25 -6.5) (layer F.SilkS) (width 0.15))
              (fp_line (start 1.25 -6.5) (end -1.25 -6.5) (layer F.SilkS) (width 0.15))

              ${'' /* back */}
              (fp_line (start -1.25 -6.5) (end -1.25 6.5) (layer B.SilkS) (width 0.15))
              (fp_line (start -1.25 6.5) (end 1.25 6.5) (layer B.SilkS) (width 0.15))
              (fp_line (start 1.25 6.5) (end 1.25 -6.5) (layer B.SilkS) (width 0.15))
              (fp_line (start 1.25 -6.5) (end -1.25 -6.5) (layer B.SilkS) (width 0.15))

              ${'' /* labels */}
              (fp_text user Nice!View (at -2.5 0.00 ${p.rot+90}) (layer F.SilkS knockout) (effects (font (size 1.0 1.0) (thickness 0.15))))
              (fp_text user Nice!View (at -2.5 0.00 ${p.rot+90}) (layer B.SilkS knockout) (effects (font (size 1.0 1.0) (thickness 0.15)) (justify mirror)))

              `
        }
        if (p.outline) {
            return `
              ${standard}
              ${outline()})
              `
        } else {
            return `${standard})`
        }
    }

}