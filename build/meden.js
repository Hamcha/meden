(function() {
  var applyRot, c, cos, ctx, cube, deg2rad, draw, getp, h, line, makemat, mat4mul, medenInit, perspmat, project, px, ratio, renderLoop, rotX, rotY, rotZ, setp, sin, t, w, winding, wireframe, _ref;

  _ref = [640, 480], w = _ref[0], h = _ref[1];

  ratio = w / h;

  wireframe = true;

  cos = Math.cos;

  sin = Math.sin;

  deg2rad = function(angle) {
    return (angle / 180) * Math.PI;
  };

  rotX = function(a) {
    return [[1, 0, 0, 0], [0, cos(a), sin(a), 0], [0, -sin(a), cos(a), 0], [0, 0, 0, 1]];
  };

  rotY = function(a) {
    return [[cos(a), 0, -sin(a), 0], [0, 1, 0, 0], [sin(a), 0, cos(a), 0], [0, 0, 0, 1]];
  };

  rotZ = function(a) {
    return [[cos(a), sin(a), 0, 0], [-sin(a), cos(a), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  };

  applyRot = function(vertex, rotation) {
    vertex = mat4mul(vertex, rotX(rotation[0]));
    vertex = mat4mul(vertex, rotY(rotation[1]));
    vertex = mat4mul(vertex, rotZ(rotation[2]));
    return vertex;
  };

  mat4mul = function(c, m) {
    return [c[0] * m[0][0] + c[1] * m[0][1] + c[2] * m[0][2] + c[3] * m[0][3], c[0] * m[1][0] + c[1] * m[1][1] + c[2] * m[1][2] + c[3] * m[1][3], c[0] * m[2][0] + c[1] * m[2][1] + c[2] * m[2][2] + c[3] * m[2][3], c[0] * m[3][0] + c[1] * m[3][1] + c[2] * m[3][2] + c[3] * m[3][3]];
  };

  project = function(coord) {
    var cpos, far, fov, near, pcoord;
    near = 0.1;
    far = 1000;
    fov = 70;
    cpos = [0, 0, 0];
    pcoord = mat4mul(coord, perspmat(near, far, fov));
    pcoord = [(pcoord[0] * w / pcoord[2]) + w / 2, (pcoord[1] * h / pcoord[2]) + h / 2];
    return pcoord;
  };

  makemat = function(p, s) {
    return [[s[0], 0, 0, p[0]], [0, s[1], 0, p[1]], [0, 0, s[2], p[2]], [0, 0, 0, 1]];
  };

  perspmat = function(near, far, fov) {
    var f, l, m, n;
    f = 1 / Math.tan(deg2rad(fov * .5));
    l = f / ratio;
    n = (-near - far) / (near - far);
    m = 2 * near * far / (near - far);
    return [[l, 0, 0, 0], [0, f, 0, 0], [0, 0, n, m], [0, 0, 1, 0]];
  };

  setp = function(b, x, y, c) {
    if (x < 0 || x >= w || y < 0 || y >= h) {
      return;
    }
    return b[y * w + x] = (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];
  };

  getp = function(b, x, y) {
    return [b[y * w + x], b[y * w + x + 1], b[y * w + x + 2]];
  };

  winding = function(face, mesh) {
    var area, dep, des, i, prev, _i, _ref1;
    area = 0;
    prev = project(mat4mul(mesh.verts[face[0]], mesh.matrix));
    for (i = _i = 0, _ref1 = face.length - 1; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      dep = project(mat4mul(mesh.verts[face[i]], mesh.matrix));
      des = project(mat4mul(mesh.verts[face[i + 1]], mesh.matrix));
      area += ((dep[0] - prev[0]) * (prev[1] - des[1])) - ((des[0] - prev[0]) * (prev[1] - dep[1]));
    }
    return area < 0;
  };

  draw = function(mesh) {
    var dp1, dp2, dpa, i, p, point, _i, _j, _len, _ref1, _ref2, _results;
    _ref1 = mesh.faces;
    _results = [];
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      p = _ref1[i];
      point = mat4mul(mesh.verts[p[0]], mesh.matrix);
      dpa = project(mat4mul(mesh.verts[p[0]], mesh.matrix));
      for (i = _j = 1, _ref2 = p.length; _j < _ref2; i = _j += 2) {
        dp1 = project(mat4mul(mesh.verts[p[i - 1]], mesh.matrix));
        dp2 = project(mat4mul(mesh.verts[p[i]], mesh.matrix));
        if (wireframe) {
          line(dp1[0], dp1[1], dp2[0], dp2[1], [255, 255, 255]);
        }
      }
      if (wireframe) {
        _results.push(line(dpa[0], dpa[1], dp2[0], dp2[1], [255, 255, 255]));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  medenInit = function(ctx) {
    window.meden = {};
    meden.depth = ctx.createImageData(w, h);
    meden.dbuf = new ArrayBuffer(meden.depth.data.length);
    meden.db8 = new Uint8ClampedArray(meden.dbuf);
    meden.d32 = new Uint32Array(meden.dbuf);
    meden.img = ctx.createImageData(w, h);
    meden.buf = new ArrayBuffer(meden.img.data.length);
    meden.bu8 = new Uint8ClampedArray(meden.buf);
    return meden.b32 = new Uint32Array(meden.buf);
  };

  px = function(p) {
    return Math.floor(p);
  };

  line = function(x1, y1, x2, y2, c) {
    var dx, dy, e2, err, sx, sy, _ref1, _ref2, _results;
    _ref1 = [px(x1), px(y1), px(x2), px(y2)], x1 = _ref1[0], y1 = _ref1[1], x2 = _ref1[2], y2 = _ref1[3];
    _ref2 = [Math.abs(x2 - x1), Math.abs(y2 - y1)], dx = _ref2[0], dy = _ref2[1];
    sx = x1 < x2 ? 1 : -1;
    sy = y1 < y2 ? 1 : -1;
    err = dx - dy;
    _results = [];
    while (true) {
      setp(meden.b32, x1, y1, c);
      if ((x1 === x2) && (y1 === y2)) {
        break;
      }
      e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        _results.push(y1 += sy);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  cube = function(position, rotation, scale) {
    var faces, matrix, verts;
    verts = [[-0.5, -0.5, -0.5, 1], [-0.5, -0.5, 0.5, 1], [-0.5, 0.5, -0.5, 1], [-0.5, 0.5, 0.5, 1], [0.5, -0.5, -0.5, 1], [0.5, -0.5, 0.5, 1], [0.5, 0.5, -0.5, 1], [0.5, 0.5, 0.5, 1]];
    faces = [[0, 1, 3, 2], [1, 5, 7, 3], [2, 3, 7, 6], [4, 6, 7, 5], [0, 2, 6, 4], [0, 4, 5, 1]];
    verts = verts.map(function(v) {
      return applyRot(v, rotation);
    });
    matrix = makemat(position, scale);
    return {
      matrix: matrix,
      verts: verts,
      faces: faces
    };
  };

  renderLoop = function() {
    var i, t, _i, _ref1;
    t = Date.now() / 1000;
    requestAnimationFrame(renderLoop);
    for (i = _i = 0, _ref1 = meden.b32.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      meden.b32[i] = -16777216;
    }
    line(320, 0, 320, 480, [255, 0, 0]);
    line(0, 240, 640, 240, [0, 255, 0]);
    draw(cube([0, 0, 20], [t * 2, t, t / 2], [3, 3, 3]));
    meden.img.data.set(meden.bu8);
    return ctx.putImageData(meden.img, 0, 0);
  };

  t = Date.now();

  c = document.createElement("canvas");

  c.width = w;

  c.height = h;

  ctx = c.getContext("2d");

  medenInit(ctx);

  window.switchVar = function(varname, value) {
    switch (varname) {
      case 'wireframe':
        return wireframe = value;
      default:
        return console.warn("Unknown option: " + varname);
    }
  };

  document.getElementById("canvas").appendChild(c);

  renderLoop();

}).call(this);

//# sourceMappingURL=meden.js.map
