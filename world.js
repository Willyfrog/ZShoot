var UNIT_SIZE = 8,
    BUILD_MIN_SIZE = 30,
    WORLD_HEIGHT = 90,
    WORLD_WIDTH = 150;

function divide_square(x1,y1,w,h){
    // si es el tamaño minimo, no dividimos
    if (w< BUILD_MIN_SIZE && h<BUILD_MIN_SIZE)
	return [[x1, y1, w, h]];
    // si no tiene suficiente ancho->en altura fijo
    var divancho = true;
    if (w<BUILD_MIN_SIZE){
	divancho = false;
    } else if (h>BUILD_MIN_SIZE) {
	divancho = (Crafty.math.randomInt(1,3)>1);
    }

    if (divancho){
	var w2 = Crafty.math.randomInt(10,w - 20);
	//Crafty.e("Interseccion").center((x1+w2) * UNIT_SIZE, (y1 -1 )* UNIT_SIZE);
	checkAndAddIntersection((x1+w2) * UNIT_SIZE, (y1 -10)* UNIT_SIZE);
	//Crafty.e("Interseccion").center((x1+w2)* UNIT_SIZE, (y1 + h)*UNIT_SIZE);
	checkAndAddIntersection((x1+w2)* UNIT_SIZE, (y1 + h)*UNIT_SIZE);
	return [[x1,y1, w2, h], [x1+w2+10, y1, w-w2-10, h]];
    }
    else {
	var h2 = Crafty.math.randomInt(10,h - 20);
	Crafty.e("Interseccion").center((x1-10)*UNIT_SIZE, (y1 + h2) * UNIT_SIZE);
	Crafty.e("Interseccion").center((x1+w) * UNIT_SIZE, (y1 + h2) * UNIT_SIZE);
	return [[x1,y1, w, h2],[x1, y1+h2+10, w, h-h2-10]];
    }
}

function gen_map(maxx, maxy){
    var pasadas = 5;
    var city = [[10,10,maxx - 10,maxy - 10]];
    Crafty.e("Interseccion").center(0, 0);
    Crafty.e("Interseccion").center(maxx * UNIT_SIZE, 0);
    Crafty.e("Interseccion").center(maxx*UNIT_SIZE, maxy * UNIT_SIZE);
    Crafty.e("Interseccion").center(0, maxy*UNIT_SIZE);
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
    var notfound = true;
    //TODO: optimizar
    for (var i in Crafty("Interseccion")) {
	if (i._x == x && i.__y == y) {
	    notfound = false;
	    break;
	}
    }
    if (notfound) {
	Crafty.e("Interseccion").center(x,y);
    }
}

//para generar los nodos para pathfinding, deben ir a las intersecciones
Crafty.c("Interseccion", {
    init: function () {
	this.addComponent("2D, Canvas, Color, Collision, WiredHitBox");
	this.attr({w:UNIT_SIZE, h:UNIT_SIZE, paths:{}});
	this.color("Black");
    },
    center: function (x, y) {
	if(y!==undefined){
	    this.y = y + 5*UNIT_SIZE;
	}
	if(x!==undefined){
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

