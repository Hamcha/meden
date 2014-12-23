(function() {
  var Camera, Meshes, Renderer, applyRot, triangulateQuads, winding;

  applyRot = function(vertex, rotation) {
    vertex = Matrix.multiply(vertex, Matrix.rotateX(rotation[0]));
    vertex = Matrix.multiply(vertex, Matrix.rotateY(rotation[1]));
    vertex = Matrix.multiply(vertex, Matrix.rotateZ(rotation[2]));
    return vertex;
  };

  triangulateQuads = function(faces) {
    var face, trifaces, _i, _len;
    trifaces = [];
    for (_i = 0, _len = faces.length; _i < _len; _i++) {
      face = faces[_i];
      trifaces.push([face[0], face[1], face[2]]);
      trifaces.push([face[2], face[3], face[0]]);
    }
    return trifaces;
  };

  winding = function(camera, face, mesh) {
    var area, dep, des, i, prev, _i, _ref;
    area = 0;
    prev = camera.project(Matrix.multiply(mesh.verts[face[0]], mesh.matrix));
    for (i = _i = 0, _ref = face.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      dep = camera.project(Matrix.multiply(mesh.verts[face[i]], mesh.matrix));
      des = camera.project(Matrix.multiply(mesh.verts[face[i + 1]], mesh.matrix));
      area += ((dep[0] - prev[0]) * (prev[1] - des[1])) - ((des[0] - prev[0]) * (prev[1] - dep[1]));
    }
    return area >= 0;
  };

  Camera = (function() {
    function Camera(width, height, fov, near, far) {
      this.width = width;
      this.height = height;
      this.fov = fov;
      this.near = near;
      this.far = far;
      this.ratio = width / height;
      this.matrix = Matrix.perspective(this.ratio, this.near, this.far, this.fov);
      return;
    }

    Camera.prototype.project = function(coord) {
      var pcoord;
      pcoord = Matrix.multiply(coord, this.matrix);
      return pcoord = [(pcoord[0] * this.width / pcoord[2]) + this.width / 2, (pcoord[1] * this.height / pcoord[2]) + this.height / 2];
    };

    return Camera;

  })();

  Renderer = (function() {
    function Renderer(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.depth = new Buffer(ctx, width, height);
      this.img = new Buffer(ctx, width, height);
      this.options = {
        wireframe: false,
        culling: true
      };
      this.camera = new Camera(width, height, 70, 0.1, 1000);
      return;
    }

    Renderer.prototype.draw = function(mesh) {
      var dp1, dp2, dpa, face, i, point, _i, _j, _len, _ref, _ref1;
      _ref = mesh.faces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        face = _ref[_i];
        if (this.options.culling && !winding(this.camera, face, mesh)) {
          continue;
        }
        point = Matrix.multiply(mesh.verts[face[0]], mesh.matrix);
        for (i = _j = 1, _ref1 = face.length; 1 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
          dp1 = this.camera.project(Matrix.multiply(mesh.verts[face[i - 1]], mesh.matrix));
          dp2 = this.camera.project(Matrix.multiply(mesh.verts[face[i]], mesh.matrix));
          if (this.options.wireframe) {
            this.img.line(dp1[0], dp1[1], dp2[0], dp2[1], [255, 255, 255]);
          }
        }
        dpa = this.camera.project(Matrix.multiply(mesh.verts[face[0]], mesh.matrix));
        if (this.options.wireframe) {
          this.img.line(dpa[0], dpa[1], dp2[0], dp2[1], [255, 255, 255]);
        }
      }
    };

    Renderer.prototype.clear = function() {
      this.img.clear();
    };

    Renderer.prototype.show = function() {
      this.img.src.data.set(this.img.b8);
      this.ctx.putImageData(this.img.src, 0, 0);
    };

    return Renderer;

  })();

  Meshes = (function() {
    function Meshes() {}

    Meshes.cube = function(position, rotation, scale) {
      var faces, matrix, verts;
      verts = [[-0.5, -0.5, -0.5, 1], [-0.5, -0.5, 0.5, 1], [-0.5, 0.5, -0.5, 1], [-0.5, 0.5, 0.5, 1], [0.5, -0.5, -0.5, 1], [0.5, -0.5, 0.5, 1], [0.5, 0.5, -0.5, 1], [0.5, 0.5, 0.5, 1]];
      faces = [[0, 1, 3, 2], [1, 5, 7, 3], [2, 3, 7, 6], [4, 6, 7, 5], [0, 2, 6, 4], [0, 4, 5, 1]];
      verts = verts.map(function(v) {
        return applyRot(v, rotation);
      });
      faces = triangulateQuads(faces);
      matrix = Matrix.fromTransform(position, scale);
      return {
        matrix: matrix,
        verts: verts,
        faces: faces
      };
    };

    return Meshes;

  })();

  window.Renderer = Renderer;

  window.Meshes = Meshes;

}).call(this);

//# sourceMappingURL=renderer.js.map
