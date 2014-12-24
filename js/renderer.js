(function() {
  var Camera, Meshes, Renderer, triangulateQuads, winding;

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
    var area, dep, des, prev;
    prev = camera.project(Matrix.multiply(mesh.verts[face[0]], mesh.matrix));
    dep = camera.project(Matrix.multiply(mesh.verts[face[1]], mesh.matrix));
    des = camera.project(Matrix.multiply(mesh.verts[face[2]], mesh.matrix));
    area = ((dep[0] - prev[0]) * (prev[1] - des[1])) - ((des[0] - prev[0]) * (prev[1] - dep[1]));
    return area > 0;
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
        fill: true,
        culling: true
      };
      this.camera = new Camera(width, height, 70, 0.1, 1000);
      return;
    }

    Renderer.prototype.draw = function(mesh) {
      var color, dp, dp0, dp1, dp2, face, vx, wirecolor, _i, _j, _k, _len, _len1, _len2, _ref;
      vx = [];
      _ref = mesh.faces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        face = _ref[_i];
        if (this.options.culling && !winding(this.camera, face, mesh)) {
          continue;
        }
        dp0 = this.camera.project(Matrix.multiply(mesh.verts[face[0]], mesh.matrix));
        dp1 = this.camera.project(Matrix.multiply(mesh.verts[face[1]], mesh.matrix));
        dp2 = this.camera.project(Matrix.multiply(mesh.verts[face[2]], mesh.matrix));
        color = MathUtil.vecfloor(Vector.scale(Vector.normalize([face[0], face[1], face[2], 1]), 255));
        vx.push([dp0, dp1, dp2, color]);
      }
      if (this.options.fill) {
        for (_j = 0, _len1 = vx.length; _j < _len1; _j++) {
          dp = vx[_j];
          this.img.triangle(dp[0].slice(0), dp[1].slice(0), dp[2].slice(0), dp[3].slice(0));
        }
      }
      if (this.options.wireframe) {
        for (_k = 0, _len2 = vx.length; _k < _len2; _k++) {
          dp = vx[_k];
          if (this.options.fill) {
            wirecolor = [255 - dp[3][0], 255 - dp[3][1], 255 - dp[3][2]];
          } else {
            wirecolor = [255, 255, 255];
          }
          this.img.line(dp[0][0], dp[0][1], dp[1][0], dp[1][1], wirecolor);
          this.img.line(dp[1][0], dp[1][1], dp[2][0], dp[2][1], wirecolor);
          this.img.line(dp[2][0], dp[2][1], dp[0][0], dp[0][1], wirecolor);
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
        return MathUtil.applyRot(v, rotation);
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
