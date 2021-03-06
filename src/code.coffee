## Rendering options ##

[w,h] = [640,480] # Resolution

# FPS counter and render loop
start = Date.now()
frameCount = 0
captureInterval = 1000
fpscont = document.getElementById "fps"
renderLoop = () ->
	now = Date.now()
	t = now/1000
	elapsed = now - start
	requestAnimationFrame renderLoop

	meden.clear()
	#meden.draw Meshes.cube [0,0,20], [t*2,t,t/2], [3,3,3]
	meden.draw window.model.make [0,1,10], [0,t,0.5], [2,2,2]
	meden.show()

	frameCount++
	if elapsed > captureInterval
		frameCount = frameCount * 1000 / elapsed
		fpscont.innerHTML = "(" + Math.round(frameCount) + " FPS)"
		frameCount = 0
		start = now

# Time variable
t = Date.now()

# Checkbox callback
window.switchVar = (varname, value) ->
	switch varname
		when 'wireframe' then meden.options.wireframe = value
		when 'fill' then meden.options.fill = value
		else console.warn "Unknown option: " + varname

# Init render canvas
c = document.createElement "canvas"
c.width  = w
c.height = h
ctx = c.getContext "2d"

window.meden = new Renderer ctx, w, h
meden.options.wireframe = true

# Load OBJ model
xhr "model/hovercraft.obj", {}, (data) ->
	window.model = new OBJLoader data

	# Start rendering
	canvasdiv = document.getElementById "canvas"
	canvasdiv.removeChild document.getElementById "loading"
	canvasdiv.appendChild c
	renderLoop()