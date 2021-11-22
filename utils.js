const vlq = require("vlq");
const sm = require("./source-map");
const concat = require("concat-stream");

const formatMappings = (mappings, sources, names) => {
  const vlqState = [0, 0, 0, 0, 0];
  return mappings.split(";").reduce((accum, line, i) => {
    accum[i + 1] = formatLine(line, vlqState, sources, names);
    vlqState[0] = 0;
    return accum;
  }, {});
};

const formatLine = (line, state, sources, names) => {
  const segs = line.split(",");
  return segs.map((seg) => {
    if (!seg) return "";
    const decoded = vlq.decode(seg);
    for (var i = 0; i < 5; i++) {
      state[i] =
        typeof decoded[i] === "number" ? state[i] + decoded[i] : state[i];
    }
    return formatSegment(...state.concat([sources, names]));
  });
};

const formatSegment = (
  col,
  source,
  sourceLine,
  sourceCol,
  name,
  sources,
  names
) =>
  `${col + 1} => ${sources[source]} ${sourceLine + 1}:${sourceCol + 1}${
    names[name] ? ` ${names[name]}` : ``
  }`;

module.exports = {
  formatMappings,
};
