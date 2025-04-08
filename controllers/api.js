// API info
exports.api = function(req, res) {
    res.write('[');
    res.write('{"resource":"journals", ');
    res.write('"verbs":["GET","POST","PUT","DELETE"]}');
    res.write(']');
    res.send();
  };
  