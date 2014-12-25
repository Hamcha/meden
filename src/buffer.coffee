# Absolute pixel
px = (p) -> p|0

class Buffer
	constructor: (@ctx, @w, @h) ->
		@src = ctx.createImageData w, h
		@bf  = new ArrayBuffer @src.data.length
		@b8  = new Uint8ClampedArray @bf
		@b32 = new Uint32Array @bf
		@depth = new ArrayBuffer @src.data.length
		@options =
			ignoreDepth: false
		return

	createDepth: () ->
		return

	setPixel: (x,y,c) ->
		return false if x < 0 or x >= @w or y < 0 or y >= @h
		@b32[y*@w+x] = (255  << 24) |
		               (c[2] << 16) |
		               (c[1] << 8)  |
		                c[0]
		return true

	setPixelDepth: (x,y,z,c) ->
		if !@options.ignoreDepth
			return false unless @depth?
			return false if @depth[y*@w+x] < z
			@depth[y*@w+x] = z
		@setPixel x,y,c
		return true

	getPixel: (x,y) -> 
		[@b8[y*@w+x], @b8[y*@w+x+1], @b8[y*@w+x+2]]

	_horline: (x1, x2, y, c) ->
		@setPixel i,y,c for i in [x1..x2]
		return

	_horlineDepth: (x1, z1, x2, z2, y, c) ->
		dz = (z2 - z1)/(x2 - x1)
		z = z1
		for i in [x1..x2]
			@setPixelDepth i,y,z,c
			z += dz
		return
	
	# Brasenham algorithm
	line: (v1, v2, c) ->
		[x1, y1, z1, x2, y2, z2] = [px(v1[0]), px(v1[1]), v1[2], px(v2[0]), px(v2[1]), v2[2]]
		[dx, dy] = [Math.abs(x2 - x1), Math.abs(y2 - y1)]
		sx = if x1 < x2 then 1 else -1
		sy = if y1 < y2 then 1 else -1
		err = dx-dy
		[x, y] = [x1, y1]
		points = []
		while true
			points.push [x, y]
			break if (x is x2) and (y is y2)
			e2 = 2*err
			if e2 > -dy
				err -= dy
				x += sx
			if e2 <  dx
				err += dx
				y += sy
		z = z1 - 0.01
		dz = (z2-z1)/points.length
		for p in points
			@setPixelDepth p[0], p[1], z, c
			z += dz
		return

	# Scanline triangle fill algorithm 
	# http://www-users.mat.uni.torun.pl/~wrona/3d_tutor/tri_fillers.html
	triangle: (v1, v2, v3, c) ->
		[A, B, C] = [v1, v2, v3].sort (a, b) -> a[1]-b[1]
		
		if B[1]-A[1] > 0
			dx1 = (B[0]-A[0])/(B[1]-A[1])
			dz1 = (B[2]-A[2])/(B[1]-A[1])
		else
			dx1 = dz1 = 0

		if C[1]-A[1] > 0
			dx2 = (C[0]-A[0])/(C[1]-A[1])
			dz2 = (C[2]-A[2])/(C[1]-A[1])
		else
			dx2 = dz2 = 0
		
		if C[1]-B[1] > 0
			dx3 = (C[0]-B[0])/(C[1]-B[1])
			dz3 = (C[2]-B[2])/(C[1]-B[1])
		else
			dx3 = dz3 = 0
		end = start = A[0]
		endD = startD = A[2]
		line = A[1]
		if dx1 > dx2
			while line <= B[1]
				point = start
				@_horlineDepth px(start), startD, px(end), endD, px(line), c
				start += dx2
				end += dx1
				startD += dz2
				endD += dz1
				line++
			end = B[0]
			while line <= C[1]
				@_horlineDepth px(start), startD, px(end), endD, px(line), c
				start += dx2
				end += dx3
				startD += dz2
				endD += dz3
				line++
		else
			while line <= B[1]
				@_horlineDepth px(start), startD, px(end), endD, px(line), c
				start += dx1
				end += dx2
				startD += dz1
				endD += dz2
				line++
			start = B[0]
			while line <= C[1]
				@_horlineDepth px(start), startD, px(end), endD, px(line), c
				start += dx3
				end += dx2
				startD += dz3
				endD += dz2
				line++
		return


	clear: () ->
		for i in [0...@b32.length]
			@b32[i] = -16777216 
			@depth[i] = Infinity
		return

window.Buffer = Buffer