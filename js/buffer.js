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
      return;
    }

    Buffer.prototype.setPixel = function(x, y, c) {
      if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
        return;
      }
      this.b32[y * this.w + x] = (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];
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

    Buffer.prototype.line = function(x1, y1, x2, y2, c) {
      var dx, dy, e2, err, sx, sy, _ref, _ref1;
      _ref = [px(x1), px(y1), px(x2), px(y2)], x1 = _ref[0], y1 = _ref[1], x2 = _ref[2], y2 = _ref[3];
      _ref1 = [Math.abs(x2 - x1), Math.abs(y2 - y1)], dx = _ref1[0], dy = _ref1[1];
      sx = x1 < x2 ? 1 : -1;
      sy = y1 < y2 ? 1 : -1;
      err = dx - dy;
      while (true) {
        this.setPixel(x1, y1, c);
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
          y1 += sy;
        }
      }
    };

    Buffer.prototype.triangle = function(v1, v2, v3, c) {
      var A, B, C, dx1, dx2, dx3, end, line, start, _ref;
      _ref = [v1, v2, v3].sort(function(a, b) {
        return a[1] - b[1];
      }), A = _ref[0], B = _ref[1], C = _ref[2];
      dx1 = B[1] - A[1] > 0 ? (B[0] - A[0]) / (B[1] - A[1]) : 0;
      dx2 = C[1] - A[1] > 0 ? (C[0] - A[0]) / (C[1] - A[1]) : 0;
      dx3 = C[1] - B[1] > 0 ? (C[0] - B[0]) / (C[1] - B[1]) : 0;
      end = start = A[0];
      line = A[1];
      if (dx1 > dx2) {
        while (line <= B[1]) {
          this._horline(px(start), px(end), px(line), c);
          start += dx2;
          end += dx1;
          line++;
        }
        end = B[0];
        while (line <= C[1]) {
          this._horline(px(start), px(end), px(line), c);
          start += dx2;
          end += dx3;
          line++;
        }
      } else {
        while (line <= B[1]) {
          this._horline(px(start), px(end), px(line), c);
          start += dx1;
          end += dx2;
          line++;
        }
        start = B[0];
        while (line <= C[1]) {
          this._horline(px(start), px(end), px(line), c);
          start += dx3;
          end += dx2;
          line++;
        }
      }
    };

    Buffer.prototype.clear = function() {
      var i, _i, _ref;
      for (i = _i = 0, _ref = this.b32.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.b32[i] = -16777216;
      }
    };

    return Buffer;

  })();

  window.Buffer = Buffer;

}).call(this);

//# sourceMappingURL=buffer.js.map
