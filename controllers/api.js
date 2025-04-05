// API info
exports.api = function(req, res) {
    res.write('[');
    res.write('{"resource":"costumes", ');
    res.write('"verbs":["GET","POST","PUT","DELETE"]}');
    res.write(']');
    res.send();
  };
  