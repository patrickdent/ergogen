// based off of: https://github.com/infused-kim/kb_ergogen_fp/blob/bdfc2b5798c74c01e57f01cb20778a68a4c0193c/nice_nano_pretty.js#L18

module.exports =  {
    params: {
      designator: 'MCU',
      traces: true,
      RAW: {type: 'net', value: 'RAW'},
      GND: {type: 'net', value: 'GND'},
      VCC: {type: 'net', value: 'VCC'},
      P15: {type: 'net', value: 'P15'},
      P14: {type: 'net', value: 'P14'},
      P13: {type: 'net', value: 'P13'},
      P12: {type: 'net', value: 'P12'},

      P2: {type: 'net', value: 'P2'},
      P3: {type: 'net', value: 'P3'},
      P28: {type: 'net', value: 'P28'},
      P29: {type: 'net', value: 'P29'},
      P4: {type: 'net', value: 'P4'},
      P5: {type: 'net', value: 'P5'},
      P11: {type: 'net', value: 'P11'},

      show_instructions: true,
      show_silk_labels: true,
      show_via_labels: true,

      RAW_label: '',
      GND_label: '',
      VCC_label: '',
      P10_label: '',
      P9_label: '',
      P8_label: '',
      P20_label: '',

      P2_label: '',
      P3_label: '',
      P4_label: '',
      P5_label: '',
      P6_label: '',
      P7_label: '',
      P21_label: '',
      
      rotate: 0,
    },
    body: p => {
      const pin_names = [
        ['P2', 'RAW'],
        ['P3', 'GND'],
        ['P28', 'VCC'],
        ['P29', 'P15'],
        ['P4', 'P14'],
        ['P5', 'P13'],
        ['P11', 'P12'],
      ]
      
      // dimensions of main portion of the mcu
      // does not include usb
      const mcu_y = 10.5
      const mcu_x = 8.9

      // distance between pins
      const pin_space = 2.54

      const get_pin_net_name = (p, pin_name) => {
        return p[pin_name].name;
      };

      const get_pin_net_str = (p, pin_name) => {
        return p[pin_name].str;
      };

      const get_pin_label_override = (p, pin_name) => {
        prop_name = `${pin_name}_label`;
        return p[prop_name];
      };

      const get_pin_label = (p, pin_name) => {
        label = get_pin_label_override(p, pin_name);
        if(label == '') {
          label = get_pin_net_name(p, pin_name);
        }

        if(label === undefined) {
          label = '""';
        }

        return label;
      };

      const get_at_coordinates = () => {
        const pattern = /\(at (-?[\d\.]*) (-?[\d\.]*) (-?[\d\.]*)\)/;
        const matches = p.at.match(pattern);
        if (matches && matches.length == 4) {
          return [parseFloat(matches[1]), parseFloat(matches[2]), parseFloat(matches[3])];
        } else {
          return null;
        }
      }

      const adjust_point = (x, y) => {
        const at_l = get_at_coordinates();
        if(at_l == null) {
          throw new Error(
            `Could not get x and y coordinates from p.at: ${p.at}`
          );
        }
        const at_x = at_l[0];
        const at_y = at_l[1];
        const at_angle = at_l[2];
        const adj_x = at_x + x;
        const adj_y = at_y + y;

        const radians = (Math.PI / 180) * at_angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (adj_x - at_x)) + (sin * (adj_y - at_y)) + at_x,
          ny = (cos * (adj_y - at_y)) - (sin * (adj_x - at_x)) + at_y;

        const point_str = `${nx.toFixed(2)} ${ny.toFixed(2)}`;
        return point_str;
      }

      const common_top = `
        (module seeed_xiao (layer F.Cu) (tedit 6451A4F1)
          (attr virtual)
          ${p.at /* parametric position */}
          (fp_text reference "${p.ref}" (at 0 -15) (layer F.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )

          ${'' /* MCU outline */ }
          (fp_line (start -6.7 ${mcu_y}) (end 6.7 ${mcu_y}) (width 0.12) (layer "F.SilkS"))
          (fp_line (start -4 -11.7) (end 4 -11.7) (width 0.12) (layer "F.SilkS"))
          (fp_line (start -4 ${-mcu_y}) (end ${-mcu_x} ${-mcu_y}) (width 0.12) (layer "F.SilkS"))
          (fp_line (start -4 ${-mcu_y}) (end -4 -11.7) (width 0.12) (layer "F.SilkS"))
          (fp_line (start 4 -11.7) (end 4 ${-mcu_y}) (width 0.12) (layer "F.SilkS"))
          (fp_line (start ${mcu_x} ${-mcu_y}) (end 4 ${-mcu_y}) (width 0.12) (layer "F.SilkS"))

          (fp_line (start ${-mcu_x} ${mcu_y}) (end ${-mcu_x} ${-mcu_y}) (width 0.1) (layer "F.Fab"))
          (fp_line (start ${-mcu_x} ${-mcu_y}) (end -4 ${-mcu_y}) (width 0.1) (layer "F.Fab"))
          (fp_line (start -4 -11.7) (end 4 -11.7) (width 0.1) (layer "F.Fab"))
          (fp_line (start -4 ${-mcu_y}) (end -4 -11.7) (width 0.1) (layer "F.Fab"))
          (fp_line (start 4 -11.7) (end 4 ${-mcu_y}) (width 0.1) (layer "F.Fab"))
          (fp_line (start 4 ${-mcu_y}) (end ${mcu_x} ${-mcu_y}) (width 0.1) (layer "F.Fab"))
          (fp_line (start ${mcu_x} ${mcu_y}) (end ${-mcu_x} ${mcu_y}) (width 0.1) (layer "F.Fab"))
          (fp_line (start 8.9 ${-mcu_y}) (end 8.9 ${mcu_y}) (width 0.1) (layer "F.Fab"))

          ${''/* Courtyard Outline */}     
          (fp_line (start ${-mcu_x} ${mcu_y}) (end ${-mcu_x} ${-mcu_y}) (width 0.15) (layer F.CrtYd))
          (fp_line (start ${-mcu_x} ${-mcu_y}) (end ${-mcu_x} ${-mcu_y}) (width 0.15) (layer F.CrtYd))
          (fp_line (start ${mcu_x} ${mcu_y}) (end ${-mcu_x} ${mcu_y}) (width 0.15) (layer F.CrtYd))
          (fp_line (start ${mcu_x} ${-mcu_y}) (end ${mcu_x} ${mcu_y}) (width 0.15) (layer F.CrtYd))
          (fp_line (start ${-mcu_x} ${mcu_y}) (end ${-mcu_x} ${-mcu_y}) (width 0.15) (layer B.CrtYd))
          (fp_line (start ${-mcu_x} ${-mcu_y}) (end ${-mcu_x} ${-mcu_y}) (width 0.15) (layer B.CrtYd))
          (fp_line (start ${mcu_x} ${mcu_y}) (end ${-mcu_x} ${mcu_y}) (width 0.15) (layer B.CrtYd))
          (fp_line (start ${mcu_x} ${-mcu_y}) (end ${mcu_x} ${mcu_y}) (width 0.15) (layer B.CrtYd))   
      `;

      const instructions = `
          (fp_text user "R. Side - Jumper Here" (at 0 -15.245) (layer F.SilkS)
            (effects (font (size 1 1) (thickness 0.15)))
          )
          (fp_text user "L. Side - Jumper Here" (at 0 -15.245) (layer B.SilkS)
            (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
          )
    `
      
      const gen_traces_row = (row_num) => {
        const row_offset_y = (row_num+2) * pin_space
        const traces = `
          (segment (start ${ adjust_point(4.775, (mcu_y - row_offset_y)) }) (end ${ adjust_point(3.262, (mcu_y - row_offset_y)) }) (width 0.25) (layer F.Cu) (net 1))
          (segment (start ${ adjust_point(-4.775, (mcu_y - row_offset_y)) }) (end ${ adjust_point(-3.262, (mcu_y - row_offset_y)) }) (width 0.25) (layer F.Cu) (net 13))
          (segment (start ${ adjust_point(-7.62, (mcu_y - row_offset_y)) }) (end ${ adjust_point(-5.5, (mcu_y - row_offset_y)) }) (width 0.25) (layer F.Cu) (net 23))
          (segment (start ${ adjust_point(5.5, (mcu_y - row_offset_y)) }) (end ${ adjust_point(7.62, (mcu_y - row_offset_y)) }) (width 0.25) (layer F.Cu) (net 24))
        `
         const back_traces = `
          (segment (start ${ adjust_point(-4.335002, (mcu_y - row_offset_y)) }) (end ${ adjust_point(-3.610001, 0.72501 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-4.775, (mcu_y - row_offset_y)) }) (end ${ adjust_point(-4.335002, (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-3.610001, 0.72501 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(-2.913999, 0.72501 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-2.536999, 0.348001 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(-2.536999, 0.336999 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-2.913999, 0.72501 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(-2.536999, 0.348001 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-2.536999, 0.336999 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(-2.45, 0.45 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(3.012, 0.45 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(3.262, (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(-2.45, 0.45 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(3.012, 0.45 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 1))
          (segment (start ${ adjust_point(3.610001, -0.725001 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(2.913999, -0.725001 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(4.335002, (mcu_y - row_offset_y)) }) (end ${ adjust_point(3.610001, -0.725001 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(4.775, (mcu_y - row_offset_y)) }) (end ${ adjust_point(4.335002, (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(2.913999, -0.725001 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(2.438998, -0.15 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(-3.012, -0.15 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(-3.262, (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(2.438998, -0.15 + (mcu_y - row_offset_y)) }) (end ${ adjust_point(-3.012, -0.15 + (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 13))
          (segment (start ${ adjust_point(-7.62, (mcu_y - row_offset_y)) }) (end ${ adjust_point(-5.5, (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 23))
          (segment (start ${ adjust_point(7.62, (mcu_y - row_offset_y)) }) (end ${ adjust_point(5.5, (mcu_y - row_offset_y)) }) (width 0.25) (layer B.Cu) (net 24))
          `

        return traces
      }

      const gen_traces = () => {
        let traces = '';
        for (let i = 0; i < pin_names.length; i++) {
          // this has more to do about our specific pin count and will probably not work with more
          row_traces = gen_traces_row(i - 1)
          traces += row_traces
        }

        return traces
      }

      const gen_socket_row = (row_num, pin_name_left, pin_name_right, show_via_labels, show_silk_labels) => {
        const row_offset_y = (row_num+1) * pin_space

        const socket_hole_num_left = pin_names.length*2 - row_num
        const socket_hole_num_right = 1 + row_num
        
        // not sure how these numbers relate to row count
        const via_num_left = 124 - row_num
        const via_num_right = 1 + row_num

        const net_left = get_pin_net_str(p, pin_name_left)
        const net_right = get_pin_net_str(p, pin_name_right)
        const via_label_left = get_pin_label(p, pin_name_left)
        const via_label_right = get_pin_label(p, pin_name_right)

        // These are the silkscreen labels that will be printed on the PCB.
        // They tell us the orientation if the controller is placed with
        // the components down, on top of the PCB and the jumpers are
        // soldered on the opposite side than the controller.
        const net_silk_front_left = via_label_right
        const net_silk_front_right = via_label_left
        const net_silk_back_left = via_label_left
        const net_silk_back_right = via_label_right

        let socket_row = `
          ${''/* Socket Holes */}
          (pad ${socket_hole_num_left} thru_hole circle (at -7.62 ${mcu_y - row_offset_y}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net(socket_hole_num_left).str})
          (pad ${socket_hole_num_right} thru_hole circle (at 7.62 ${mcu_y - row_offset_y}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net(socket_hole_num_right).str})

          ${''/* Inside VIAS */}
          (pad ${via_num_left} thru_hole circle (at -3.262 ${mcu_y - row_offset_y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${net_left})
          (pad ${via_num_right} thru_hole circle (at 3.262 ${mcu_y - row_offset_y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${net_right})

          ${'' /* FRONT */ }
          ${''/* Jumper Pads - Front Left */}
          (pad ${socket_hole_num_left} smd custom (at -5.5 ${mcu_y - row_offset_y} ${p.rotate}) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net(socket_hole_num_left).str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
            ) (width 0))
          ))
          (pad ${via_num_left} smd custom (at -4.775 ${mcu_y - row_offset_y} ${p.rotate}) (size 0.2 0.2) (layers F.Cu F.Mask) ${net_left}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
            ) (width 0))
          ))

          ${''/* Jumper Pads - Front Right */}
          (pad ${via_num_right} smd custom (at 4.775 ${mcu_y - row_offset_y} ${p.rotate + 180}) (size 0.2 0.2) (layers F.Cu F.Mask) ${net_right}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
            ) (width 0))
          ))

          (pad ${socket_hole_num_right} smd custom (at 5.5 ${mcu_y - row_offset_y} ${p.rotate + 180}) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net(socket_hole_num_right).str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
            ) (width 0))
          ))

          ${''/* Jumper Pads - Back Left */}
          (pad ${socket_hole_num_left} smd custom (at -5.5 ${mcu_y - row_offset_y} ${p.rotate}) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net(socket_hole_num_left).str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
            ) (width 0))
          ))

          (pad ${via_num_right} smd custom (at -4.775 ${mcu_y - row_offset_y} ${p.rotate}) (size 0.2 0.2) (layers B.Cu B.Mask) ${net_right}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
            ) (width 0))
          ))

          ${''/* Jumper Pads - Back Right */}
          (pad ${via_num_left} smd custom (at 4.775 ${mcu_y - row_offset_y} ${p.rotate + 180}) (size 0.2 0.2) (layers B.Cu B.Mask) ${net_left}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
            ) (width 0))
          ))
          
          (pad ${socket_hole_num_right} smd custom (at 5.5 ${mcu_y - row_offset_y} ${p.rotate + 180}) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net(socket_hole_num_right).str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly (pts
                (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
            ) (width 0))
          ))
        `

        if(show_silk_labels == true) {
          socket_row += `
            ${''/* Silkscreen Labels - Front */}
            (fp_text user ${net_silk_front_left} (at -3 ${-12.7 + row_offset_y} ${p.rotate}) (layer F.SilkS)
              (effects (font (size 0.5 0.5) (thickness 0.15)) (justify left))
            )
            (fp_text user ${net_silk_front_right} (at 3 ${-12.7 + row_offset_y} ${p.rotate}) (layer F.SilkS)
              (effects (font (size 0.5 0.5) (thickness 0.15)) (justify right))
            )

            ${''/* Silkscreen Labels - Back */}
            (fp_text user ${net_silk_back_left} (at -3 ${-12.7 + row_offset_y} ${p.rotate + 180}) (layer B.SilkS)
              (effects (font (size 0.5 0.5) (thickness 0.15)) (justify right mirror))
            )
            (fp_text user ${net_silk_back_right} (at 3 ${-12.7 + row_offset_y} ${p.rotate + 180}) (layer B.SilkS)
              (effects (font (size 0.5 0.5) (thickness 0.15)) (justify left mirror))
            )
          `
        }

        if(show_via_labels == true) {
          socket_row += `
            ${''/* Via Labels - Front */}
            (fp_text user ${via_label_left} (at -3.262 ${-13.5 + row_offset_y} ${p.rotate}) (layer F.Fab)
              (effects (font (size 0.5 0.5) (thickness 0.08)))
            )
            (fp_text user ${via_label_right} (at 3.262 ${-13.5 + row_offset_y} ${p.rotate}) (layer F.Fab)
              (effects (font (size 0.5 0.5) (thickness 0.08)))
            )

            ${''/* Via Labels - Back */}
            (fp_text user ${via_label_left} (at -3.262 ${-13.5 + row_offset_y} ${p.rotate + 180}) (layer B.Fab)
              (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
            )
            (fp_text user ${via_label_right} (at 3.262 ${-13.5 + row_offset_y} ${p.rotate + 180}) (layer B.Fab)
              (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
            )
          `
        }

        return socket_row
      }

      const gen_socket_rows = (show_via_labels, show_silk_labels) => {
        let socket_rows = '';
        for (let i = 0; i < pin_names.length; i++) {
          pin_name_left = pin_names[i][0]
          pin_name_right = pin_names[i][1]

          const socket_row = gen_socket_row(
            i, pin_name_left, pin_name_right,
            show_via_labels, show_silk_labels
          )

          socket_rows += socket_row
        }

        return socket_rows
      }

      const gen_config_by_row = () => {
        let s = [];
        let t = [];
        let v = [];
        let j = [];
        

        for (let i = 0; i < pin_names.length; i++) {
          pin_name_left = pin_names[i][0]
          pin_name_right = pin_names[i][1]

          const row_elements = gen_row_elements(
            i, pin_name_left, pin_name_right
          )

          s.push(row_elements.sockets)
          t.push(row_elements.traces)
          v.push(row_elements.vias)
          j.push(row_elements.jumpers)
        }
        
        return {
          sockets: s.join("\n"),
          traces: t.join("\n"),
          vias: v.join("\n"),
          jumpers: j.join("\n")
        }
      }

      const gen_row_elements = (row_num, pin_name_left, pin_name_right) => {
        const row_offset_y = (row_num+1) * pin_space
        const y = mcu_y - row_offset_y

        const socket_hole_num_left = pin_names.length*2 - row_num
        const socket_hole_num_right = 1 + row_num
        
        const net_left = get_pin_net_str(p, pin_name_left)
        const net_right = get_pin_net_str(p, pin_name_right)
        const via_label_left = get_pin_label(p, pin_name_left)
        const via_label_right = get_pin_label(p, pin_name_right)

        // These are the silkscreen labels that will be printed on the PCB.
        // They tell us the orientation if the controller is placed with
        // the components down, on top of the PCB and the jumpers are
        // soldered on the opposite side than the controller.
        const net_silk_front_left = via_label_right
        const net_silk_front_right = via_label_left
        const net_silk_back_left = via_label_left
        const net_silk_back_right = via_label_right
       
        let row_traces = ``

        return {
          vias: `
            ${gen_via(y, row_num, net_left, -1)}
            ${gen_via(y, 124-row_num, net_right, 1)}
          `,
          jumpers: `
            ${gen_jumper_pad(socket_hole_num_left, row_num, y, p.rotate, net_left, p.local_net(socket_hole_num_left).str, -1, "F")}
            ${gen_jumper_pad(socket_hole_num_right, 124-row_num, y, p.rotate, net_right, p.local_net(socket_hole_num_right).str, 1, "F")}
            ${gen_jumper_pad(socket_hole_num_left, row_num, y, p.rotate, net_left, p.local_net(socket_hole_num_left).str, -1, "B")}
            ${gen_jumper_pad(socket_hole_num_right, 124-row_num, y, p.rotate, net_right, p.local_net(socket_hole_num_right).str, 1, "B")}
          `,
          sockets: `
            ${gen_socket(socket_hole_num_left, y, p.local_net(socket_hole_num_left).str, -1)}
            ${gen_socket(socket_hole_num_right, y, p.local_net(socket_hole_num_right).str, 1)}
          `,
          traces: row_traces
        }
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

      const traces = config.traces

      return `
          ${''/* Controller*/}
          ${ common_top }
          ${ config.sockets }
          ${ config.vias }
          ${ config.jumpers }
          ${ p.show_instructions ? instructions : '' }
        )

        ${''/* Traces */}
        ${p.traces ? traces : ''}
    `;
    }
  }