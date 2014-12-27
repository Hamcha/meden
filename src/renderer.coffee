## General Utils ##

triangulateQuads = (faces) ->
	trifaces = []
	for face in faces
		trifaces.push [face[0], face[1], face[2]]
		trifaces.push [face[2], face[3], face[0]]
	return trifaces

## 3D Rendering functions ##

# Backface Culling
winding = (camera, face, obj) ->
	mesh = obj.mesh; matrix = obj.transform.matrix()
	prev = camera.project Matrix.multiply mesh.verts[face[0]], matrix
	dep  = camera.project Matrix.multiply mesh.verts[face[1]], matrix
	des  = camera.project Matrix.multiply mesh.verts[face[2]], matrix
	area = ((dep[0]-prev[0]) * (prev[1]-des[1])) - ((des[0]-prev[0]) * (prev[1]-dep[1]))
	return area > 0

class Camera
	constructor: (@width, @height, @fov, @near, @far) ->
		@ratio = width / height
		@matrix = Matrix.perspective @ratio, @near, @far, @fov
		return

	project: (coord) ->
		[x, y, z] = Matrix.multiply coord, @matrix
		pcoord = [(x * @width  / z) + @width  / 2,
		          (y * @height / z) + @height / 2,
		      	   z]

class Renderer
	constructor: (@ctx, @width, @height) ->
		@img = new Buffer ctx, width, height
		@options =
			wireframe : false
			fill: true
		@camera = new Camera width, height, 70, 0.1, 1000
		return

	draw: (obj) ->
		vx = []
		mesh = obj.mesh; matrix = obj.transform.matrix()
		for face in mesh.faces
			continue unless !@options.fill or winding @camera, face, obj
			dp0 = @camera.project Matrix.multiply mesh.verts[face[0]], matrix
			dp1 = @camera.project Matrix.multiply mesh.verts[face[1]], matrix
			dp2 = @camera.project Matrix.multiply mesh.verts[face[2]], matrix
			vx.push [dp0, dp1, dp2]
		if @options.fill
			for dp in vx
				@img.triangle dp[0][..], dp[1][..], dp[2][..], [255,255,255]
		if @options.wireframe
			wirecolor =	if @options.fill then [0,0,0] else [255,255,255]
			for dp in vx
				@img.line dp[0],dp[1],wirecolor
				@img.line dp[1],dp[2],wirecolor
				@img.line dp[2],dp[0],wirecolor
		return

	clear: ->
		@img.clear()
		return

	show: ->
		@img.src.data.set @img.b8
		@ctx.putImageData @img.src,0,0
		return

window.Renderer = Renderer