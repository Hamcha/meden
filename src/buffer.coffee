# Absolute pixel
px = (p) -> p|0

class Buffer
	constructor: (@ctx, @w, @h) ->
		@src = ctx.createImageData w, h
		@bf  = new ArrayBuffer @src.data.length
		@b8  = new Uint8ClampedArray @bf
		@b32 = new Uint32Array @bf
		return

	setPixel: (x,y,c) ->
		return if x < 0 or x >= @w or y < 0 or y >= @h
		@b32[y*@w+x] = (255  << 24) |
		               (c[2] << 16) |
		               (c[1] << 8)  |
		                c[0]
		return

	getPixel: (x,y) -> 
		[@b8[y*@w+x], @b8[y*@w+x+1], @b8[y*@w+x+2]]

	_horline: (x1, x2, y, c) ->
		@setPixel i,y,c for i in [x1..x2]
		return
	
	# Brasenham algorithm
	line: (x1, y1, x2, y2, c) ->
		[x1, y1, x2, y2] = [px(x1), px(y1), px(x2), px(y2)]
		[dx, dy] = [Math.abs(x2 - x1), Math.abs(y2 - y1)]
		sx = if x1 < x2 then 1 else -1
		sy = if y1 < y2 then 1 else -1
		err = dx-dy
		while true
			@setPixel x1, y1, c
			break if (x1 is x2) and (y1 is y2)
			e2 = 2*err
			if e2 > -dy
				err -= dy
				x1 += sx
			if e2 <  dx
				err += dx
				y1 += sy
		return

	# Scanline triangle fill algorithm 
	# http://www-users.mat.uni.torun.pl/~wrona/3d_tutor/tri_fillers.html
	triangle: (v1, v2, v3, c) ->
		[A, B, C] = [v1, v2, v3].sort (a, b) -> a[1]-b[1]
		dx1 = if B[1]-A[1] > 0 then (B[0]-A[0])/(B[1]-A[1]) else 0
		dx2 = if C[1]-A[1] > 0 then (C[0]-A[0])/(C[1]-A[1]) else 0
		dx3 = if C[1]-B[1] > 0 then (C[0]-B[0])/(C[1]-B[1]) else 0
		end = start = A[0]
		line = A[1]
		if dx1 > dx2
			while line <= B[1]
				@_horline px(start), px(end), px(line), c
				start += dx2
				end += dx1
				line++
			end = B[0]
			while line <= C[1]
				@_horline px(start), px(end), px(line), c
				start += dx2
				end += dx3
				line++
		else
			while line <= B[1]
				@_horline px(start), px(end), px(line), c
				start += dx1
				end += dx2
				line++
			start = B[0]
			while line <= C[1]
				@_horline px(start), px(end), px(line), c
				start += dx3
				end += dx2
				line++
		return


	clear: () ->
		@b32[i] = -16777216 for i in [0...@b32.length]
		return

window.Buffer = Buffer