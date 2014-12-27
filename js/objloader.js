(function() {
  var OBJLoader;

  OBJLoader = (function() {
    function OBJLoader(data) {
      var faces, line, params, type, verts, _i, _len, _ref;
      verts = [];
      faces = [];
      _ref = data.split("\n");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        params = line.split(" ");
        type = params.splice(0, 1);
        switch (type[0]) {
          case "v":
            verts.push([parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), 1]);
            break;
          case "f":
            faces.push((params.slice(0, 3)).map(function(i) {
              return (parseInt((i.split("/"))[0])) - 1;
            }));
        }
      }
      this.mesh = new Mesh(verts, faces);
      return;
    }

    OBJLoader.prototype.make = function(position, rotation, scale) {
      var transform;
      transform = new Transform(position, rotation, scale);
      return new Object3d(this.mesh, transform);
    };

    return OBJLoader;

  })();

  window.OBJLoader = OBJLoader;

}).call(this);

//# sourceMappingURL=objloader.js.map
