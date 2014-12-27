class OBJLoader
	constructor: (data) ->
		verts = []; faces = []
		for line in data.split "\n"
			params = line.split " "
			type = params.splice 0,1
			switch type[0]
				when "v" # Vertex
					verts.push [parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), 1]
				when "f" # Face (MUST BE PRE-TRIANGULATED)
					faces.push (params.slice 0,3).map (i) -> (parseInt (i.split "/")[0]) - 1
		@mesh = new Mesh verts, faces
		return

	make: (position, rotation, scale) ->
		transform = new Transform position, rotation, scale
		return new Object3d @mesh, transform

window.OBJLoader = OBJLoader