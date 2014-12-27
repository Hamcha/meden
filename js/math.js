(function() {
  var MathUtil, Matrix, Vector, cos, sin;

  cos = Math.cos;

  sin = Math.sin;

  MathUtil = (function() {
    function MathUtil() {}

    MathUtil.deg2rad = function(angle) {
      return (angle / 180) * Math.PI;
    };

    MathUtil.eulerQuat = function(x, y, z) {
      var cx, cy, cz, sx, sy, sz;
      sx = Math.sin(x / 2);
      cx = Math.cos(x / 2);
      sy = Math.sin(y / 2);
      cy = Math.cos(y / 2);
      sz = Math.sin(z / 2);
      cz = Math.cos(z / 2);
      return [cx * cy * cz + sx * sy * sz, sx * cy * cz - cx * sy * sz, cx * sy * cz + sx * cy * sz, cx * cy * sz - sx * sy * cz];
    };

    MathUtil.lerp = function(a, b, t) {
      return a + (b - a) * t;
    };

    return MathUtil;

  })();

  Vector = (function() {
    function Vector() {}

    Vector.normalize = function(v) {
      var len;
      len = Math.sqrt(v[0] + v[1] + v[2] + v[3]);
      return [v[0] / len, v[1] / len, v[2] / len, v[3] / len];
    };

    Vector.scale = function(v, s) {
      return [v[0] * s, v[1] * s, v[2] * s, v[3] * s];
    };

    return Vector;

  })();

  Matrix = (function() {
    function Matrix() {}

    Matrix.multiply = function(c, m) {
      return [c[0] * m[0][0] + c[1] * m[0][1] + c[2] * m[0][2] + c[3] * m[0][3], c[0] * m[1][0] + c[1] * m[1][1] + c[2] * m[1][2] + c[3] * m[1][3], c[0] * m[2][0] + c[1] * m[2][1] + c[2] * m[2][2] + c[3] * m[2][3], c[0] * m[3][0] + c[1] * m[3][1] + c[2] * m[3][2] + c[3] * m[3][3]];
    };

    Matrix.identity = function() {
      return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    };

    Matrix.applyMove = function(m, x, y, z) {
      m[0][3] += x;
      m[1][3] += y;
      m[2][3] += z;
      return m;
    };

    Matrix.applyScale = function(m, x, y, z) {
      return [Vector.scale(m[0], x), Vector.scale(m[1], x), Vector.scale(m[2], x), m[3]];
    };

    Matrix.rotation = function(x, y, z, w) {
      return [[1 - 2 * y * y - 2 * z * z, 2 * x * y + 2 * z * w, 2 * x * z - 2 * y * w, 0], [2 * x * y - 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * z * y + 2 * x * w, 0], [2 * x * z + 2 * y * w, 2 * z * y - 2 * x * w, 1 - 2 * x * x - 2 * y * y, 0], [0, 0, 0, 1]];
    };

    Matrix.perspective = function(ratio, near, far, fov) {
      var f, l, m, n;
      f = 1 / Math.tan(MathUtil.deg2rad(fov * .5));
      l = f / ratio;
      n = (-near - far) / (near - far);
      m = 2 * near * far / (near - far);
      return [[l, 0, 0, 0], [0, f, 0, 0], [0, 0, n, m], [0, 0, 1, 0]];
    };

    return Matrix;

  })();

  window.MathUtil = MathUtil;

  window.Vector = Vector;

  window.Matrix = Matrix;

}).call(this);

//# sourceMappingURL=math.js.map
