####################
## START RENDERER ##
####################

## Rendering options ##

[w,h] = [640,480] # Resolution
ratio = w/h

wireframe = true

## General Utils ##

# Math functions
cos = Math.cos
sin = Math.sin

# Degrees to Radian
deg2rad = (angle) -> (angle / 180) * Math.PI

## Matrix functions ##

# Rotation matricies (X,Y,Z)
rotX = (a) -> [[1,   0   ,  0   ,0],
               [0, cos(a),sin(a),0],
               [0,-sin(a),cos(a),0],
               [0,   0   ,  0   ,1]]

rotY = (a) -> [[cos(a),0,-sin(a),0],
               [  0   ,1,  0    ,0],
               [sin(a),0, cos(a),0],
               [0,   0   ,  0   ,1]]

rotZ = (a) -> [[ cos(a),sin(a),0,0],
               [-sin(a),cos(a),0,0],
               [   0   ,  0   ,1,0],
               [0,   0   ,  0   ,1]]

applyRot = (vertex, rotation) ->
	vertex = mat4mul vertex, rotX rotation[0]
	vertex = mat4mul vertex, rotY rotation[1]
	vertex = mat4mul vertex, rotZ rotation[2]
	return vertex

# Multiply mat4x4 * vec4
mat4mul = (c,m) -> 
	[c[0]*m[0][0]+c[1]*m[0][1]+c[2]*m[0][2]+c[3]*m[0][3],
	 c[0]*m[1][0]+c[1]*m[1][1]+c[2]*m[1][2]+c[3]*m[1][3],
	 c[0]*m[2][0]+c[1]*m[2][1]+c[2]*m[2][2]+c[3]*m[2][3],
	 c[0]*m[3][0]+c[1]*m[3][1]+c[2]*m[3][2]+c[3]*m[3][3]]

# Project to Camera
project = (coord) -> 
	near = 0.1
	far  = 1000
	fov  = 70
	cpos = [0,0,0]
	# Put into Perspective
	pcoord = mat4mul coord, perspmat near, far, fov
	pcoord = [(pcoord[0] * w / pcoord[2])+w/2, 
	          (pcoord[1] * h / pcoord[2])+h/2]
	return pcoord

# Make Transformation matrix from Position, Scale
makemat = (p,s) -> [[s[0], 0  , 0  ,p[0]],
                    [ 0  ,s[1], 0  ,p[1]],
                    [ 0  , 0  ,s[2],p[2]],
                    [ 0  , 0  , 0  , 1  ]]

# Create Perspective Matrix
perspmat = (near, far, fov) ->
	f = 1 / Math.tan deg2rad fov * .5
	l = f/ratio
	n = (-near-far)/(near-far)
	m = 2*near*far/(near-far)
	return [[ l, 0, 0, 0 ],
	        [ 0, f, 0, 0 ],
	        [ 0, 0, n, m ],
	        [ 0, 0, 1, 0 ]]

## Pixel blitting functions ##
setp = (b,x,y,c) -> 
	return if x < 0 or x >= w or y < 0 or y >= h
	b[y*w+x] = (255 << 24) | 
	           (c[2] << 16) | (c[1] << 8) | c[0]
	
getp = (b,x,y)   -> [b[y*w+x], b[y*w+x+1], b[y*w+x+2]]

## 3D Rendering functions ##

# Backface Culling
winding = (face,mesh) ->
	area = 0
	prev = project mat4mul mesh.verts[face[0]],mesh.matrix
	for i in [0...face.length-1]
		dep = project mat4mul mesh.verts[face[i]],mesh.matrix
		des = project mat4mul mesh.verts[face[i+1]],mesh.matrix
		area += ((dep[0]-prev[0]) * (prev[1]-des[1])) - ((des[0]-prev[0]) * (prev[1]-dep[1]))
	return area < 0

# Draw mesh
draw = (mesh) ->
	for p,i in mesh.faces
		point = mat4mul mesh.verts[p[0]],mesh.matrix
		dpa = project mat4mul mesh.verts[p[0]],mesh.matrix
		for i in [1...p.length] by 2
			dp1 = project mat4mul mesh.verts[p[i-1]],mesh.matrix
			dp2 = project mat4mul mesh.verts[p[i]],mesh.matrix
			line dp1[0],dp1[1],dp2[0],dp2[1],[255,255,255] if wireframe
		line dpa[0],dpa[1],dp2[0],dp2[1],[255,255,255] if wireframe

## Meden initialization ##
medenInit = (ctx) ->
	# Create global object meden
	window.meden = {}
	
	# Depth buffer
	meden.depth = ctx.createImageData w,h
	meden.dbuf = new ArrayBuffer meden.depth.data.length
	meden.db8 = new Uint8ClampedArray meden.dbuf
	meden.d32 = new Uint32Array meden.dbuf

	# Final rendering surface
	meden.img = ctx.createImageData w,h
	meden.buf = new ArrayBuffer meden.img.data.length
	meden.bu8 = new Uint8ClampedArray meden.buf
	meden.b32 = new Uint32Array meden.buf
		
## 3d Utils functions ##

# Absolute pixel
px = (p) -> Math.floor(p)

# Line blitter (Bresenham optimized)
line = (x1,y1,x2,y2,c) ->
	[x1,y1,x2,y2] = [px(x1), px(y1), px(x2), px(y2)]
	[dx,dy] = [Math.abs(x2-x1),Math.abs(y2-y1)]
	sx = if x1 < x2 then 1 else -1
	sy = if y1 < y2 then 1 else -1
	err = dx-dy
	while true
		setp meden.b32,x1,y1,c
		break if (x1 is x2) and (y1 is y2)
		e2 = 2*err
		if e2 > -dy
			err -= dy
			x1 += sx
		if e2 <  dx
			err += dx
			y1 += sy

# Cube mesh generator
cube = (position,rotation,scale) ->
	verts = [[-0.5,-0.5,-0.5,1],[-0.5,-0.5, 0.5,1],
	         [-0.5, 0.5,-0.5,1],[-0.5, 0.5, 0.5,1],
	         [ 0.5,-0.5,-0.5,1],[ 0.5,-0.5, 0.5,1],
	         [ 0.5, 0.5,-0.5,1],[ 0.5, 0.5, 0.5,1]]
	faces = [[0,1,3,2],[1,5,7,3],[2,3,7,6],
	         [4,6,7,5],[0,2,6,4],[0,4,5,1]]
	verts = verts.map (v) -> applyRot v, rotation
	matrix = makemat position,scale
	return {matrix,verts,faces}

##################
## END RENDERER ##
##################

renderLoop = () ->
	t = Date.now()/1000
	requestAnimationFrame renderLoop
	meden.b32[i] = -16777216 for i in [0...meden.b32.length] # Clear
	line 320,0,320,480,[255,0,0]
	line 0,240,640,240,[0,255,0]
	draw cube [0,0,20], [t/3,t/10,t/5], [10,10,10]
	draw cube [0,0,20], [t*2,t,t/2], [3,3,3]
	meden.img.data.set meden.bu8
	ctx.putImageData meden.img,0,0
	
# Time variable
t = Date.now()

# Init render canvas
c = document.createElement "canvas"
c.width  = w
c.height = h
ctx = c.getContext "2d"

medenInit ctx

window.switchVar = (varname, value) ->
	switch varname
		when 'wireframe' then wireframe = value
		else console.warn "Unknown option: " + varname

document.getElementById("canvas").appendChild c
renderLoop()