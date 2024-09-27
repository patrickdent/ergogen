get_at_coordinates = (p) => {
    const pattern = /\(at (-?[\d\.]*) (-?[\d\.]*) (-?[\d\.]*)\)/;
    const matches = p.at.match(pattern);
    if (matches && matches.length == 4) {
        return [parseFloat(matches[1]), parseFloat(matches[2]), parseFloat(matches[3])];
    } else {
        return null;
    }
}

exports.adjust_point = (p, x, y) => {
    const at_l = get_at_coordinates(p);
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