(function() {
  var Buffer, px;

  px = function(p) {
    return p | 0;
  };

  Buffer = (function() {
    function Buffer(ctx, w, h) {
      this.ctx = ctx;
      this.w = w;
      this.h = h;
      this.src = ctx.createImageData(w, h);
      this.bf = new ArrayBuffer(this.src.data.length);
      this.b8 = new Uint8ClampedArray(this.bf);
      this.b32 = new Uint32Array(this.bf);
      this.depth = new ArrayBuffer(this.src.data.length);
      return;
    }

    Buffer.prototype.createDepth = function() {};

    Buffer.prototype.setPixel = function(x, y, c) {
      if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
        return false;
      }
      this.b32[y * this.w + x] = (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];
      return true;
    };

    Buffer.prototype.setPixelDepth = function(x, y, z, c) {
      if (this.depth == null) {
        return false;
      }
      if (this.depth[y * this.w + x] < z) {
        return false;
      }
      this.setPixel(x, y, c);
      this.depth[y * this.w + x] = z;
      return true;
    };

    Buffer.prototype.getPixel = function(x, y) {
      return [this.b8[y * this.w + x], this.b8[y * this.w + x + 1], this.b8[y * this.w + x + 2]];
    };

    Buffer.prototype._horline = function(x1, x2, y, c) {
      var i, _i;
      for (i = _i = x1; x1 <= x2 ? _i <= x2 : _i >= x2; i = x1 <= x2 ? ++_i : --_i) {
        this.setPixel(i, y, c);
      }
    };

    Buffer.prototype._horlineDepth = function(x1, z1, x2, z2, y, c) {
      var dz, i, z, _i;
      dz = (z2 - z1) / (x2 - x1);
      z = z1;
      for (i = _i = x1; x1 <= x2 ? _i <= x2 : _i >= x2; i = x1 <= x2 ? ++_i : --_i) {
        this.setPixelDepth(i, y, z, c);
        z += dz;
      }
    };

    Buffer.prototype.line = function(v1, v2, c) {
      var dx, dy, dz, e2, err, p, points, sx, sy, x, x1, x2, y, y1, y2, z, z1, z2, _i, _len, _ref, _ref1, _ref2;
      _ref = [px(v1[0]), px(v1[1]), v1[2], px(v2[0]), px(v2[1]), v2[2]], x1 = _ref[0], y1 = _ref[1], z1 = _ref[2], x2 = _ref[3], y2 = _ref[4], z2 = _ref[5];
      _ref1 = [Math.abs(x2 - x1), Math.abs(y2 - y1)], dx = _ref1[0], dy = _ref1[1];
      sx = x1 < x2 ? 1 : -1;
      sy = y1 < y2 ? 1 : -1;
      err = dx - dy;
      _ref2 = [x1, y1], x = _ref2[0], y = _ref2[1];
      points = [];
      while (true) {
        points.push([x, y]);
        if ((x === x2) && (y === y2)) {
          break;
        }
        e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }
        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }
      z = z1 - 0.01;
      dz = (z2 - z1) / points.length;
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        this.setPixelDepth(p[0], p[1], z, c);
        z += dz;
      }
    };

    Buffer.prototype.triangle = function(v1, v2, v3, c) {
      var A, B, C, dx1, dx2, dx3, dz1, dz2, dz3, end, endD, line, point, start, startD, _ref;
      _ref = [v1, v2, v3].sort(function(a, b) {
        return a[1] - b[1];
      }), A = _ref[0], B = _ref[1], C = _ref[2];
      if (B[1] - A[1] > 0) {
        dx1 = (B[0] - A[0]) / (B[1] - A[1]);
        dz1 = (B[2] - A[2]) / (B[1] - A[1]);
      } else {
        dx1 = dz1 = 0;
      }
      if (C[1] - A[1] > 0) {
        dx2 = (C[0] - A[0]) / (C[1] - A[1]);
        dz2 = (C[2] - A[2]) / (C[1] - A[1]);
      } else {
        dx2 = dz2 = 0;
      }
      if (C[1] - B[1] > 0) {
        dx3 = (C[0] - B[0]) / (C[1] - B[1]);
        dz3 = (C[2] - B[2]) / (C[1] - B[1]);
      } else {
        dx3 = dz3 = 0;
      }
      end = start = A[0];
      endD = startD = A[2];
      line = A[1];
      if (dx1 > dx2) {
        while (line <= B[1]) {
          point = start;
          this._horlineDepth(px(start), startD, px(end), endD, px(line), c);
          start += dx2;
          end += dx1;
          startD += dz2;
          endD += dz1;
          line++;
        }
        end = B[0];
        while (line <= C[1]) {
          this._horlineDepth(px(start), startD, px(end), endD, px(line), c);
          start += dx2;
          end += dx3;
          startD += dz2;
          endD += dz3;
          line++;
        }
      } else {
        while (line <= B[1]) {
          this._horlineDepth(px(start), startD, px(end), endD, px(line), c);
          start += dx1;
          end += dx2;
          startD += dz1;
          endD += dz2;
          line++;
        }
        start = B[0];
        while (line <= C[1]) {
          this._horlineDepth(px(start), startD, px(end), endD, px(line), c);
          start += dx3;
          end += dx2;
          startD += dz3;
          endD += dz2;
          line++;
        }
      }
    };

    Buffer.prototype.clear = function() {
      var i, _i, _ref;
      for (i = _i = 0, _ref = this.b32.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.b32[i] = -16777216;
        this.depth[i] = Infinity;
      }
    };

    return Buffer;

  })();

  window.Buffer = Buffer;

}).call(this);

//# sourceMappingURL=buffer.js.map
