## General Utils ##

triangulateQuads = (faces) ->
	trifaces = []
	for face in faces
		trifaces.push [face[0], face[1], face[2]]
		trifaces.push [face[2], face[3], face[0]]
	return trifaces

## 3D Rendering functions ##

# Backface Culling
winding = (camera, face, mesh) ->
	prev = camera.project Matrix.multiply mesh.verts[face[0]],mesh.matrix
	dep  = camera.project Matrix.multiply mesh.verts[face[1]],mesh.matrix
	des  = camera.project Matrix.multiply mesh.verts[face[2]],mesh.matrix
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
			culling: true
		@camera = new Camera width, height, 70, 0.1, 1000
		return

	draw: (mesh) ->
		vx = []
		for face in mesh.faces
			continue if @options.culling and not winding @camera, face, mesh
			dp0 = @camera.project Matrix.multiply mesh.verts[face[0]], mesh.matrix
			dp1 = @camera.project Matrix.multiply mesh.verts[face[1]], mesh.matrix
			dp2 = @camera.project Matrix.multiply mesh.verts[face[2]], mesh.matrix
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

# Cube mesh generator
class Meshes
	@cube: (position,rotation,scale) ->
		verts = [[-0.5,-0.5,-0.5,1],[-0.5,-0.5, 0.5,1],
		         [-0.5, 0.5,-0.5,1],[-0.5, 0.5, 0.5,1],
		         [ 0.5,-0.5,-0.5,1],[ 0.5,-0.5, 0.5,1],
		         [ 0.5, 0.5,-0.5,1],[ 0.5, 0.5, 0.5,1]]
		faces = [[0,1,3,2],[1,5,7,3],[2,3,7,6],
		         [4,6,7,5],[0,2,6,4],[0,4,5,1]]
		verts = verts.map (v) -> MathUtil.applyRot v, rotation
		faces = triangulateQuads faces
		matrix = Matrix.fromTransform position, scale
		return {matrix, verts, faces}

window.Renderer = Renderer
window.Meshes = Meshes