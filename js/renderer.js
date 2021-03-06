(function() {
  var Camera, Renderer, triangulateQuads;

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
      var pcoord, x, y, z, _ref;
      _ref = Matrix.multiply(coord, this.matrix), x = _ref[0], y = _ref[1], z = _ref[2];
      return pcoord = [(x * this.width / z) + this.width / 2, (y * this.height / z) + this.height / 2, z];
    };

    return Camera;

  })();

  Renderer = (function() {
    function Renderer(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.img = new Buffer(ctx, width, height);
      this.options = {
        wireframe: false,
        fill: true
      };
      this.camera = new Camera(width, height, 70, 0.1, 1000);
      return;
    }

    Renderer.prototype.draw = function(obj) {
      var A, B, C, area, culling, dp, dp0, dp1, dp2, face, matrix, mesh, vx, wirecolor, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      vx = [];
      mesh = obj.mesh;
      matrix = obj.transform.matrix();
      _ref = mesh.faces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        face = _ref[_i];
        dp0 = this.camera.project(Matrix.multiply(mesh.verts[face[0]], matrix));
        dp1 = this.camera.project(Matrix.multiply(mesh.verts[face[1]], matrix));
        dp2 = this.camera.project(Matrix.multiply(mesh.verts[face[2]], matrix));
        area = ((dp1[0] - dp0[0]) * (dp0[1] - dp2[1])) - ((dp2[0] - dp0[0]) * (dp0[1] - dp1[1]));
        culling = area > 0;
        if (!(culling || !this.options.fill)) {
          continue;
        }
        vx.push([dp0, dp1, dp2]);
      }
      if (this.options.fill) {
        for (_j = 0, _len1 = vx.length; _j < _len1; _j++) {
          dp = vx[_j];
          this.img.triangle(dp[0].slice(0), dp[1].slice(0), dp[2].slice(0), [255, 255, 255]);
        }
      }
      if (this.options.wireframe) {
        wirecolor = this.options.fill ? [0, 0, 0] : [255, 255, 255];
        for (_k = 0, _len2 = vx.length; _k < _len2; _k++) {
          dp = vx[_k];
          _ref1 = [dp[0].slice(0), dp[1].slice(0), dp[2].slice(0)], A = _ref1[0], B = _ref1[1], C = _ref1[2];
          A[2] -= 0.05;
          B[2] -= 0.05;
          C[2] -= 0.05;
          this.img.line(A, B, wirecolor);
          this.img.line(B, C, wirecolor);
          this.img.line(C, A, wirecolor);
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

  window.Renderer = Renderer;

}).call(this);

//# sourceMappingURL=renderer.js.map
