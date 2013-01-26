var ROAD_SIZE = 80,
    BUILD_MIN_SIZE = ROAD_SIZE*3,
    WORLD_HEIGHT = 800,
    WORLD_WIDTH = 1280;

function divide_square(x1,y1,w,h){
    console.log('diviendo');
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
    
    console.log("divancho: " + divancho);  
    if (divancho){
	var w2 = Crafty.math.randomInt(ROAD_SIZE,w - ROAD_SIZE*2);
	return [[x1,y1, w2, h], [x1+w2+ROAD_SIZE, y1, w-w2-ROAD_SIZE, h]];
    }
    else {
	var h2 = Crafty.math.randomInt(ROAD_SIZE,h - ROAD_SIZE);
	return [[x1,y1, w, h2],[x1, y1+h2+ROAD_SIZE, w, h-h2-ROAD_SIZE]];
    }
}

function gen_map(maxx, maxy){
    var pasadas = 5;
    var city = [[ROAD_SIZE,ROAD_SIZE,maxx-ROAD_SIZE,maxy - ROAD_SIZE]];
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
	this.addComponent("2D, Canvas");
	this.attr({w:ROAD_SIZE, h:ROAD_SIZE});
    },
    center: function (x, y) {
	if(y!==undefined){
	    this.y = y;
	}
	if(x!==undefined){
	    this.x = x;
	}
	return this;
    }
});