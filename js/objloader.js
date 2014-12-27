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
            this.verts.push([parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), 1]);
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
      var mesh, transform, verts;
      verts = this.verts.map(function(v) {
        return MathUtil.applyRot(v, rotation);
      });
      transform = new Transform(position, rotation, scale);
      mesh = new Mesh(verts, this.faces);
      return new Object3d(mesh, transform);
    };

    return OBJLoader;

  })();

  window.OBJLoader = OBJLoader;

}).call(this);

//# sourceMappingURL=objloader.js.map
