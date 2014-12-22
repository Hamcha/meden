# Absolute pixel
px = (p) -> Math.floor(p)

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

	getPixel: (x,y) -> [@b8[y*@w+x], @b8[y*@w+x+1], @b8[y*@w+x+2]]
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

	clear: () ->
		@b32[i] = -16777216 for i in [0...@b32.length]
		return

window.Buffer = Buffer