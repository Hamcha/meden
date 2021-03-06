(function() {
  var Buffer;

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

    Buffer.prototype.setPixel = function(x, y, c) {
      x = x | 0;
      y = y | 0;
      if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
        return false;
      }
      this.b32[y * this.w + x] = (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];
      return true;
    };

    Buffer.prototype.setPixelDepth = function(x, y, z, c) {
      x = x | 0;
      y = y | 0;
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
      var offset;
      x = x | 0;
      y = y | 0;
      offset = y * this.w + x;
      return [this.b8[offset], this.b8[offset + 1], this.b8[offset + 2]];
    };

    Buffer.prototype._horlineDepth = function(x1, z1, x2, z2, y, c) {
      var dz, i, z;
      x1 = x1 | 0;
      x2 = x2 | 0;
      i = x2 - x1;
      dz = (z2 - z1) / i;
      z = z2;
      while (i > 0) {
        this.setPixelDepth(x1 + i, y, z, c);
        z -= dz;
        i--;
      }
    };

    Buffer.prototype.line = function(v1, v2, c) {
      var dx, dy, dz, e2, err, p, points, sx, sy, x, x1, x2, y, y1, y2, z, z1, z2, _i, _len;
      x1 = v1[0] | 0;
      x2 = v2[0] | 0;
      y1 = v1[1] | 0;
      y2 = v2[1] | 0;
      z1 = v1[2];
      z2 = v2[2];
      dx = Math.abs(x2 - x1);
      dy = Math.abs(y2 - y1);
      sx = x1 < x2 ? 1 : -1;
      sy = y1 < y2 ? 1 : -1;
      err = dx - dy;
      x = x1;
      y = y1;
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
      z = z1;
      dz = (z2 - z1) / points.length;
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        this.setPixelDepth(p[0], p[1], z, c);
        z += dz;
      }
    };

    Buffer.prototype.triangle = function(v1, v2, v3, c) {
      var A, Ax, Ay, Az, B, Bx, By, Bz, C, Cx, Cy, Cz, d1, d2, d3, div, dx1, dx2, dx3, dz1, dz2, dz3, end, endD, line, point, start, startD, _ref;
      _ref = [v1, v2, v3].sort(function(a, b) {
        return a[1] - b[1];
      }), A = _ref[0], B = _ref[1], C = _ref[2];
      Ax = A[0], Ay = A[1], Az = A[2];
      Bx = B[0], By = B[1], Bz = B[2];
      Cx = C[0], Cy = C[1], Cz = C[2];
      this.line(A, B, c);
      this.line(B, C, c);
      this.line(A, C, c);
      d1 = By - Ay;
      if (d1 > 0) {
        div = 1 / d1;
        dx1 = (Bx - Ax) * div;
        dz1 = (Bz - Az) * div;
      } else {
        dx1 = dz1 = 0;
      }
      d2 = Cy - Ay;
      if (d2 > 0) {
        div = 1 / d2;
        dx2 = (Cx - Ax) * div;
        dz2 = (Cz - Az) * div;
      } else {
        dx2 = dz2 = 0;
      }
      d3 = Cy - By;
      if (d3 > 0) {
        div = 1 / d3;
        dx3 = (Cx - Bx) * div;
        dz3 = (Cz - Bz) * div;
      } else {
        dx3 = dz3 = 0;
      }
      end = start = Ax;
      endD = startD = Az;
      line = Ay;
      if (dx1 > dx2) {
        while (line <= By) {
          point = start;
          this._horlineDepth(start, startD, end, endD, line, c);
          start += dx2;
          end += dx1;
          startD += dz2;
          endD += dz1;
          line++;
        }
        end = Bx;
        while (line <= Cy) {
          this._horlineDepth(start, startD, end, endD, line, c);
          start += dx2;
          end += dx3;
          startD += dz2;
          endD += dz3;
          line++;
        }
      } else {
        while (line <= By) {
          this._horlineDepth(start, startD, end, endD, line, c);
          start += dx1;
          end += dx2;
          startD += dz1;
          endD += dz2;
          line++;
        }
        start = Bx;
        while (line <= Cy) {
          this._horlineDepth(start, startD, Math.ceil(end), endD, line, c);
          start += dx3;
          end += dx2;
          startD += dz3;
          endD += dz2;
          line++;
        }
      }
    };

    Buffer.prototype.clear = function() {
      var i;
      i = this.b32.length - 1;
      while (i--) {
        this.b32[i] = -16777216;
        this.depth[i] = Infinity;
      }
    };

    return Buffer;

  })();

  window.Buffer = Buffer;

}).call(this);

//# sourceMappingURL=buffer.js.map
