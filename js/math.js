(function() {
  var MathUtil, Matrix, Vector, cos, sin;

  cos = Math.cos;

  sin = Math.sin;

  MathUtil = (function() {
    function MathUtil() {}

    MathUtil.deg2rad = function(angle) {
      return (angle / 180) * Math.PI;
    };

    MathUtil.applyRot = function(vertex, rotation) {
      vertex = Matrix.multiply(vertex, Matrix.rotateX(rotation[0]));
      vertex = Matrix.multiply(vertex, Matrix.rotateY(rotation[1]));
      vertex = Matrix.multiply(vertex, Matrix.rotateZ(rotation[2]));
      return vertex;
    };

    MathUtil.vecfloor = function(v) {
      return [v[0] | 0, v[1] | 0, v[2] | 0, v[3] | 0];
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

    Matrix.fromTransform = function(p, s) {
      return [[s[0], 0, 0, p[0]], [0, s[1], 0, p[1]], [0, 0, s[2], p[2]], [0, 0, 0, 1]];
    };

    Matrix.rotateX = function(a) {
      return [[1, 0, 0, 0], [0, cos(a), sin(a), 0], [0, -sin(a), cos(a), 0], [0, 0, 0, 1]];
    };

    Matrix.rotateY = function(a) {
      return [[cos(a), 0, -sin(a), 0], [0, 1, 0, 0], [sin(a), 0, cos(a), 0], [0, 0, 0, 1]];
    };

    Matrix.rotateZ = function(a) {
      return [[cos(a), sin(a), 0, 0], [-sin(a), cos(a), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
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
