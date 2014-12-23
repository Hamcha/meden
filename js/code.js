(function() {
  var c, ctx, h, renderLoop, t, w, _ref;

  _ref = [640, 480], w = _ref[0], h = _ref[1];

  renderLoop = function() {
    var t;
    t = Date.now() / 1000;
    requestAnimationFrame(renderLoop);
    meden.clear();
    meden.draw(Meshes.cube([0, 0, 20], [t * 2, t, t / 2], [3, 3, 3]));
    return meden.show();
  };

  t = Date.now();

  window.switchVar = function(varname, value) {
    switch (varname) {
      case 'wireframe':
        return meden.options.wireframe = value;
      case 'culling':
        return meden.options.culling = value;
      case 'fill':
        return meden.options.fill = value;
      default:
        return console.warn("Unknown option: " + varname);
    }
  };

  c = document.createElement("canvas");

  c.width = w;

  c.height = h;

  ctx = c.getContext("2d");

  window.meden = new Renderer(ctx, w, h);

  meden.options.wireframe = true;

  document.getElementById("canvas").appendChild(c);

  renderLoop();

}).call(this);

//# sourceMappingURL=code.js.map
