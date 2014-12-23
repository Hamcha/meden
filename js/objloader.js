(function() {
  var OBJLoader;

  OBJLoader = (function() {
    function OBJLoader(data) {
      var line, params, type, _i, _len, _ref;
      this.verts = [];
      this.faces = [];
      _ref = data.split("\n");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        params = line.split(" ");
        type = params.splice(0, 1);
        switch (type[0]) {
          case "v":
            this.verts.push((params.slice(0, 3)).map(function(i) {
              return parseFloat(i);
            }));
            break;
          case "f":
            this.faces.push((params.slice(0, 3)).map(function(i) {
              return (parseInt((i.split("/"))[0])) - 1;
            }));
        }
      }
      return;
    }

    OBJLoader.prototype.make = function(position, rotation, scale) {
      var matrix, verts;
      verts = this.verts.map(function(v) {
        return MathUtil.applyRot(v, rotation);
      });
      matrix = Matrix.fromTransform(position, scale);
      return {
        matrix: matrix,
        verts: verts,
        faces: this.faces
      };
    };

    return OBJLoader;

  })();

  window.OBJLoader = OBJLoader;

}).call(this);

//# sourceMappingURL=objloader.js.map
