// based off of: https://github.com/infused-kim/kb_ergogen_fp/blob/bdfc2b5798c74c01e57f01cb20778a68a4c0193c/nice_nano_pretty.js#L18
const adjust_point = require('./utils').adjust_point;

module.exports =  {
  params: {
    designator: 'MCU',
    traces: true,
    RAW: {type: 'net', value: 'RAW'},
    GND: {type: 'net', value: 'GND'},
    RST: {type: 'net', value: 'RST'},
    VCC: {type: 'net', value: 'VCC'},
    P21: {type: 'net', value: 'P21'},
    P20: {type: 'net', value: 'P20'},
    P19: {type: 'net', value: 'P19'},
    P18: {type: 'net', value: 'P18'},
    P15: {type: 'net', value: 'P15'},
    P14: {type: 'net', value: 'P14'},
    P16: {type: 'net', value: 'P16'},
    P10: {type: 'net', value: 'P10'},

    P1: {type: 'net', value: 'P1'},
    P0: {type: 'net', value: 'P0'},
    P2: {type: 'net', value: 'P2'},
    P3: {type: 'net', value: 'P3'},
    P4: {type: 'net', value: 'P4'},
    P5: {type: 'net', value: 'P5'},
    P6: {type: 'net', value: 'P6'},
    P7: {type: 'net', value: 'P7'},
    P8: {type: 'net', value: 'P8'},
    P9: {type: 'net', value: 'P9'},

    show_instructions: true,
    show_silk_labels: true,
    show_via_labels: true,

    RAW_label: '',
    GND_label: '',
    RST_label: '',
    VCC_label: '',
    P21_label: '',
    P20_label: '',
    P19_label: '',
    P18_label: '',
    P15_label: '',
    P14_label: '',
    P16_label: '',
    P10_label: '',

    P1_label: '',
    P0_label: '',
    P2_label: '',
    P3_label: '',
    P4_label: '',
    P5_label: '',
    P6_label: '',
    P7_label: '',
    P8_label: '',
    P9_label: '',

    rotate: 0,
  },
  body: p => {
    const pin_names = [
      ['P1', 'RAW'],
      ['P0', 'GND'],
      ['GND', 'RST'],
      ['GND', 'VCC'],
      ['P2', 'P21'],
      ['P3', 'P20'],
      ['P4', 'P19'],
      ['P5', 'P18'],
      ['P6', 'P15'],
      ['P7', 'P14'],
      ['P8', 'P16'],
      ['P9', 'P10'],
    ]
    
    // dimensions of main portion of the mcu
    // does not include usb
    const mcu_y = 16.5
    const mcu_x = 9

    // distance between pins
    const pin_space = 2.54

    const get_pin_net_str = (p, pin_name) => {
      return p[pin_name].str;
    };

    const gen_courtyard = (side) => {
      return `
        (fp_line (start ${mcu_x} ${mcu_y}) (end ${-mcu_x} ${mcu_y}) (width 0.15) (layer ${side}.CrtYd))
        (fp_line (start ${-mcu_x} ${mcu_y}) (end ${-mcu_x} ${-mcu_y}) (width 0.15) (layer ${side}.CrtYd))
        (fp_line (start ${-mcu_x} ${-mcu_y}) (end ${mcu_x} ${-mcu_y}) (width 0.15) (layer ${side}.CrtYd))
        (fp_line (start ${mcu_x} ${-mcu_y}) (end ${mcu_x} ${mcu_y}) (width 0.15) (layer ${side}.CrtYd))
      `
    }

    const gen_outline = (side) => {
      const sign = -1
      const usb_x = 4
      const usb_clearnce = 2
      return `
        ${''/* bottom line */}
        (fp_line (start -${6.7} ${mcu_y}) (end ${6.7} ${mcu_y}) (width 0.12) (layer "${side}.SilkS"))
        
        ${''/* usb */}
        (fp_line (start -${usb_x} -${mcu_y+usb_clearnce}) (end ${usb_x} -${mcu_y+usb_clearnce}) (width 0.12) (layer "${side}.SilkS"))
        (fp_line (start -${usb_x} -${mcu_y}) (end -${mcu_x} -${mcu_y}) (width 0.12) (layer "${side}.SilkS"))
        (fp_line (start -${usb_x} -${mcu_y}) (end -${usb_x} -${mcu_y + usb_clearnce}) (width 0.12) (layer "${side}.SilkS"))
        (fp_line (start ${usb_x} -${mcu_y + usb_clearnce}) (end ${usb_x} -${mcu_y}) (width 0.12) (layer "${side}.SilkS"))
        (fp_line (start ${mcu_x} -${mcu_y}) (end ${usb_x} -${mcu_y}) (width 0.12) (layer "${side}.SilkS"))

        (fp_line (start ${-mcu_x} ${mcu_y}) (end ${-mcu_x} ${-mcu_y}) (width 0.1) (layer "${side}.Fab"))
        (fp_line (start ${-mcu_x} ${-mcu_y}) (end -4 ${-mcu_y}) (width 0.1) (layer "${side}.Fab"))
        (fp_line (start -${usb_x} -${mcu_y + usb_clearnce}) (end ${usb_x} -${mcu_y + usb_clearnce}) (width 0.1) (layer "${side}.Fab"))
        (fp_line (start -${usb_x} ${-mcu_y}) (end -${usb_x} -${mcu_y + usb_clearnce}) (width 0.1) (layer "${side}.Fab"))
        (fp_line (start ${usb_x} -${mcu_y + usb_clearnce}) (end ${usb_x} ${-mcu_y}) (width 0.1) (layer "${side}.Fab"))
        (fp_line (start ${usb_x} ${-mcu_y}) (end ${mcu_x} ${-mcu_y}) (width 0.1) (layer "${side}.Fab"))
        (fp_line (start ${mcu_x} ${mcu_y}) (end ${-mcu_x} ${mcu_y}) (width 0.1) (layer "${side}.Fab"))
        (fp_line (start 8.9 ${-mcu_y}) (end 8.9 ${mcu_y}) (width 0.1) (layer "${side}.Fab"))
      `
    }

    const gen_config_by_row = () => {
      let core = [];
      let traces = [];
      

      for (let i = 0; i < pin_names.length; i++) {
        pin_name_left = pin_names[i][0]
        pin_name_right = pin_names[i][1]

        const row_elements = gen_row_elements(
          i, pin_name_left, pin_name_right
        )

        core.push(row_elements.sockets)
        core.push(row_elements.vias)
        core.push(row_elements.jumpers)
        
        traces.push(row_elements.traces)
      }
      
      return {
        core: core.join("\n"),
        traces: traces.join("\n")
      }
    }

    const gen_row_elements = (row_num, pin_name_left, pin_name_right) => {
      const row_offset_y = (row_num+1.5) * pin_space
      const y = - mcu_y + row_offset_y

      const socket_hole_num_left = pin_names.length*2 - row_num
      const socket_hole_num_right = row_num
      
      const net_left = get_pin_net_str(p, pin_name_left)
      const net_right = get_pin_net_str(p, pin_name_right)

      return {
        vias: `
          ${gen_via(y, row_num, net_left, -1)}
          ${gen_via(y, 124-row_num, net_right, 1)}
        `,
        jumpers: `
          ${gen_jumper_pad(socket_hole_num_left, row_num, y, p.rotate, net_left, p.local_net(socket_hole_num_left).str, -1, "F")}
          ${gen_jumper_pad(socket_hole_num_right, 124-row_num, y, p.rotate, net_right, p.local_net(socket_hole_num_right).str, 1, "F")}

          ${gen_jumper_pad(socket_hole_num_left, 124-row_num, y, p.rotate, net_right, p.local_net(socket_hole_num_left).str, -1, "B")}
          ${gen_jumper_pad(socket_hole_num_right, row_num, y, p.rotate, net_left, p.local_net(socket_hole_num_right).str, 1, "B")}
        `,
        sockets: `
          ${gen_socket(socket_hole_num_left, y, p.local_net(socket_hole_num_left).str, -1)}
          ${gen_socket(socket_hole_num_right, y, p.local_net(socket_hole_num_right).str, 1)}
        `,
        traces: `
          ${gen_trace("F", y, 1)}
          ${gen_trace("F", y, -1)}
          ${gen_trace("B", y, 1)}
          ${gen_trace("B", y, -1)}
        `
      }
    }

    const gen_trace = (side, y, right) => {
      if (side === "F") {
        return `
          (segment (start ${adjust_point(p, right * 4.775, y) }) (end ${adjust_point(p, right * 3.262, y) }) (width 0.25) (layer ${side}.Cu) (net 1))
          (segment (start ${adjust_point(p, right * 5.5, y) }) (end ${adjust_point(p, right * 7.62, y) }) (width 0.25) (layer ${side}.Cu) (net 24))
        `
      }
      return `
        (segment (start ${adjust_point(p, right * -4.335002, y) }) (end ${adjust_point(p, right * -3.610001, right * 0.72501 + y) }) (width 0.25) (layer B.Cu) (net 1))
        (segment (start ${adjust_point(p, right * -4.775, y) }) (end ${adjust_point(p, right * -4.335002, y) }) (width 0.25) (layer B.Cu) (net 1))

        (segment (start ${adjust_point(p, right * -3.610001, right * 0.72501 + y) }) (end ${adjust_point(p, right * -2.913999, right * 0.72501 + y) }) (width 0.25) (layer B.Cu) (net 1))
        
        (segment (start ${adjust_point(p, right * -2.913999, right * 0.72501 + y) }) (end ${adjust_point(p, right * -2.45, right * 0.45 + y) }) (width 0.25) (layer B.Cu) (net 1))

        (segment (start ${adjust_point(p, right * -2.45, right * 0.45 + y) }) (end ${adjust_point(p, right * 3.012, right * 0.45 + y) }) (width 0.25) (layer B.Cu) (net 1))
        (segment (start ${adjust_point(p, right * 3.012, right * 0.45 + y) }) (end ${adjust_point(p, right * 3.262, y) }) (width 0.25) (layer B.Cu) (net 1))

        (segment (start ${adjust_point(p, right * -7.62, y) }) (end ${adjust_point(p, right * -5.5, y) }) (width 0.25) (layer B.Cu) (net 23))
      `
    }

    const gen_socket = (socket_num, y, socket_net, right) => {
      return `
        (pad ${socket_num} thru_hole circle (at ${right * 7.62} ${y}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${socket_net})
      `
    }

    // Distance of vias from center line
    const via_x = 3.262
    const gen_via = (y, num, net, right) => {
      return `
        (pad ${num} thru_hole circle (at ${right * via_x} ${y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${net})
      `
    }

    // Distance of jumper pads from center line
    const jumper_from_x = 5.5
    const jumper_to_x = 4.775
    const gen_jumper_pad = (socket_num, via_num, y, rotation, via_net, socket_net, right, side) => {
      return `
        (pad ${socket_num} smd custom (at ${right * jumper_from_x} ${y} ${rotation}) (size 0.2 0.2) (layers ${side}.Cu ${side}.Mask) ${socket_net}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy ${right * 0.5} ${right * 0.625}) (xy ${right * 0.25} ${right * 0.625}) (xy ${right * -0.25} 0) (xy ${right * 0.25} ${right * -0.625}) (xy ${right * 0.5} ${right * -0.625})
          ) (width 0))
        ))
        (pad ${via_num} smd custom (at ${right * jumper_to_x} ${y} ${rotation}) (size 0.2 0.2) (layers ${side}.Cu ${side}.Mask) ${via_net}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy ${right * 0.65} ${right * 0.625}) (xy ${right * -0.5} ${right * 0.625}) (xy ${right * -0.5} ${right * -0.625}) (xy ${right * 0.65} ${right * -0.625}) (xy ${right * 0.15} 0)
          ) (width 0))
        ))
      `
    }

    const config = gen_config_by_row(
      p.show_via_labels, p.show_silk_labels
    )

    return `
      ${''/* Controller*/}
      (module nice_nano (layer F.Cu) (tedit 6451A4F1)
        (attr virtual)
        ${p.at /* parametric position */}
        (fp_text reference "${p.ref}" (at 0 -15) (layer F.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )

        ${'' /* MCU outline */ }
        ${gen_outline("F")}
        ${gen_outline("B")}

        ${''/* Courtyard Outline */}     
        ${gen_courtyard("F")}   
        ${gen_courtyard("B")}  
        ${ config.core }
      )

      ${''/* Traces */}
      ${p.traces ? config.traces : ''}
  `;
  }
}