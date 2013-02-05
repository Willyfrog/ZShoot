var UNIT_SIZE = 8,
    BUILD_MIN_SIZE = 30,
    WORLD_HEIGHT = 90,
    WORLD_WIDTH = 150;

var xings = [];

function divide_square(x1,y1,w,h){
    // si es el tamaño minimo, no dividimos
    if (w< BUILD_MIN_SIZE && h<BUILD_MIN_SIZE)
	return [[x1, y1, w, h]];
    // si no tiene suficiente ancho->en altura fijo
    var divancho = true;
    if (w<BUILD_MIN_SIZE) {
	divancho = false;
    } else if (h>BUILD_MIN_SIZE) {
	divancho = (Crafty.math.randomInt(1,3)>1);
    }
    var v1, v2;
    if (divancho) {
	var w2 = Crafty.math.randomInt(10,w - 20);
	v1 = checkAndAddIntersection((x1+w2) * UNIT_SIZE, (y1 -10)* UNIT_SIZE);
	v2 = checkAndAddIntersection((x1+w2)* UNIT_SIZE, (y1 + h)*UNIT_SIZE);
	v1.south(v2);
	v2.north(v1);
	//add east-west para cada uno
	return [[x1,y1, w2, h], [x1+w2+10, y1, w-w2-10, h]];
    }
    else {
	var h2 = Crafty.math.randomInt(10,h - 20);
	v1 = checkAndAddIntersection((x1-10)*UNIT_SIZE, (y1 + h2) * UNIT_SIZE);
	v2 = checkAndAddIntersection((x1+w) * UNIT_SIZE, (y1 + h2) * UNIT_SIZE);
	v1.east(v2);
	v2.west(v1);
	//add north-south para cada uno
	return [[x1,y1, w, h2],[x1, y1+h2+10, w, h-h2-10]];
    }
}


function gen_map(maxx, maxy){
    var pasadas = 5;
    var city = [[10,10,maxx - 10,maxy - 10]];
    xings[0] = [];
    xings[0][0] = Crafty.e("Interseccion").origen(0, 0);
    xings[maxx] = [];
    xings[maxx][0] = Crafty.e("Interseccion").origen(maxx * UNIT_SIZE, 0);
    xings[maxx][maxy] = Crafty.e("Interseccion").origen(maxx*UNIT_SIZE, maxy * UNIT_SIZE);
    xings[0][maxy] = Crafty.e("Interseccion").origen(0, maxy*UNIT_SIZE);
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
	Crafty.e("Building").build(minimap[i][0]*UNIT_SIZE, minimap[i][1]*UNIT_SIZE, minimap[i][2]*UNIT_SIZE, minimap[i][3]*UNIT_SIZE);
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

function checkAndAddIntersection (x,y) {
    var found = false;
    if (xings[x] == undefined) {
	xings[x] = [];
	xings[x][y] = Crafty.e("Interseccion").origen(x,y);
    }
    else if (xings[x][y]==undefined) {
	xings[x][y] = Crafty.e("Interseccion").origen(x,y);
    }
    return xings[x][y];
}

//para generar los nodos para pathfinding, deben ir a las intersecciones
Crafty.c("Interseccion", {
    init: function () {
	this.addComponent("2D, Canvas, Color, Collision, WiredHitBox");
	this.attr({w:UNIT_SIZE, h:UNIT_SIZE, paths:{}});
	this.color("Black");
    },
    origen: function (x, y) {
	if(y!==undefined){
	    this.oy = y;
	    this.y = y + 5*UNIT_SIZE;
	}
	if(x!==undefined){
	    this.ox = x;
	    this.x = x + 5*UNIT_SIZE;
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

