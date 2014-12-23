## Rendering options ##

[w,h] = [640,480] # Resolution

renderLoop = () ->
	t = Date.now()/1000
	requestAnimationFrame renderLoop
	meden.clear()
	meden.img.line 320,0,320,480,[255,0,0]
	meden.img.line 0,240,640,240,[0,255,0]
	meden.draw Meshes.cube [0,0,20], [t*2,t,t/2], [3,3,3]
	meden.show()

# Time variable
t = Date.now()

window.switchVar = (varname, value) ->
	switch varname
		when 'wireframe' then meden.options.wireframe = value
		when 'culling' then meden.options.culling = value
		else console.warn "Unknown option: " + varname

# Init render canvas
c = document.createElement "canvas"
c.width  = w
c.height = h
ctx = c.getContext "2d"

window.meden = new Renderer ctx, w, h
meden.options.wireframe = true

document.getElementById("canvas").appendChild c
renderLoop()