var ROAD_SIZE = 80,
    BUILD_MIN_SIZE = 3,
    WORLD_HEIGHT = 10,
    WORLD_WIDTH = 16;

function divide_square(x1,y1,w,h){
    // si es el tamaño minimo, no dividimos
    if (w< BUILD_MIN_SIZE && h<BUILD_MIN_SIZE)
	return [[x1, y1, w, h]];
    // si no tiene suficiente ancho->en altura fijo
    var divancho = true;
    if (w<BUILD_MIN_SIZE){
	divancho = false;
    } else if (h>BUILD_MIN_SIZE){
	divancho = (Crafty.math.randomInt(1,3)>1);
    }

    if (divancho){
	var w2 = Crafty.math.randomInt(1,w - 2);
	//Crafty.e("Interseccion").center(x1+w2 + ROAD_SIZE / 2, y1 + ROAD_SIZE / 2 );
	//Crafty.e("Interseccion").center(x1+w2 + ROAD_SIZE / 2, y1 + h + ROAD_SIZE / 2 );
	return [[x1,y1, w2, h], [x1+w2+1, y1, w-w2-1, h]];
    }
    else {
	var h2 = Crafty.math.randomInt(1,h - 2);
	//Crafty.e("Interseccion").center(x1 + ROAD_SIZE / 2, y1 + h2 + ROAD_SIZE / 2 );
	//Crafty.e("Interseccion").center(x1+w + ROAD_SIZE / 2, y1 + h2 + ROAD_SIZE / 2 );
	return [[x1,y1, w, h2],[x1, y1+h2+1, w, h-h2-1]];
    }
}

function gen_map(maxx, maxy){
    var pasadas = 5;
    var city = [[1,1,maxx-1,maxy - 1]];
    Crafty.e("Interseccion").center(ROAD_SIZE / 2, ROAD_SIZE/2 );
    Crafty.e("Interseccion").center((maxx - 0.5) * ROAD_SIZE, ROAD_SIZE / 2 );
    Crafty.e("Interseccion").center((maxx - 0.5)*ROAD_SIZE, (maxy - 0.5) * ROAD_SIZE);
    Crafty.e("Interseccion").center(ROAD_SIZE / 2, (maxy - 0.5)*ROAD_SIZE);
    console.log("city inicial: " + city);
    for (var i=0; i<pasadas; i++){
	var nucity = [];
	for(var s=0; s<city.length; s++){
	    nucity = nucity.concat(divide_square(city[s][0],city[s][1],city[s][2],city[s][3]));
	}
	city = nucity;
    }
    console.log("ciudad: " + city);
    return city;
}

function build_map(maxx, maxy){
    //generate terrain
    var minimap = gen_map(maxx,maxy);
    //build terrain
    var b = null;
    for (var i=0; i<minimap.length; i++){
	Crafty.e("Building").build(minimap[i][0]*ROAD_SIZE, minimap[i][1]*ROAD_SIZE, minimap[i][2]*ROAD_SIZE, minimap[i][3]*ROAD_SIZE);
    }
}

Crafty.c("Building", {
    init: function () {
        this.addComponent("2D, Canvas, Color, Collision");
        this.color("grey");
        this.onHit("Bullet", function (hitters) {
            // TODO: sonido disparo a edificio
            hitters[0].obj.destroy();
        });
    },
    
    build: function (px, py, sidex, sidey) {
	if (sidey==undefined) {
	    sidey = sidex;
	}
        this.attr({x: px, y: py, w: sidex, h: sidey});
        this.collision( new Crafty.polygon([[2, 2], [this._w - 2, 2], [this._w - 2, this._h - 2], [2, this._h - 2]]));
        //this.collision( [0, 0], [this.w , 0], [this.w , this.h ], [0, this.h]);

        return this;
    },
    es_ancho: function()
    {
	return w > h;
    }
});



//para generar los nodos para pathfinding, deben ir a las intersecciones
Crafty.c("Interseccion", {
    init: function () {
	this.addComponent("2D, Canvas, Color");
	this.attr({w:ROAD_SIZE, h:ROAD_SIZE, paths:{}});
	this.color("Pink");
    },
    center: function (x, y) {
	if(y!==undefined){
	    this.y = y-ROAD_SIZE/2;
	}
	if(x!==undefined){
	    this.x = x-ROAD_SIZE/2;
	}
	return this;
    },
    pos: function() {
	console.log(this.x + " - " + this.y);
    },
    north: function(nodo) {
	if (nodo!=undefined){
	    this.paths['N'] = nodo;
	}
	return this.paths['N'];
    },
    south: function(nodo) {
	if (nodo!=undefined){
	    this.paths['S'] = nodo;
	}
	return this.paths['S'];
    },
    east: function(nodo) {
	if (nodo!=undefined){
	    this.paths['E'] = nodo;
	}
	return this.paths['E'];
    },
    west: function(nodo) {
	if (nodo!=undefined){
	    this.paths['W'] = nodo;
	}
	return this.paths['W'];
    }
    
});

