var UNIT_SIZE = 8,
    BUILD_MIN_SIZE = 30,
    WORLD_HEIGHT = 90,
    WORLD_WIDTH = 150;


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
	this.addComponent("2D, Canvas, Color, Collision");
	this.attr({w:UNIT_SIZE*2, h:UNIT_SIZE*2, paths:{'N':undefined, 'S':undefined, 'E':undefined, 'W':undefined}, intensity:0, pressed:false});
	this.color("Black");
	this.onHit('Player', function () {
	    //console.log('!');
	    this.intensity = 8;
	    this.pressed = true;
	    this.propagate();
	}, function() {
	    this.pressed=false;
	});
	this.bind('EnterFrame', function () {
	    if (this.intensity>0 && !this.pressed){
		this.intensity = this.intensity-2;
	    }
	    this.color('#'+ this.intensity * 101010);
	});
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
    setIntensity: function (i) {
	if (this.intensity < i) {
	    this.intensity = i;
	    this.color('#'+this.intensity*111);
	    //this.propagate();
	}
    },
    propagate: function() {
	if (this.intensity > 0) {
	    var i = this.intensity - 2;
	    if (this.paths['N'] != undefined) {
		this.paths['N'].setIntensity(i);
	    }
	    if (this.paths['E'] != undefined) {
		this.paths['E'].setIntensity(i);
	    }
	    if (this.paths['W'] != undefined) {
	    this.paths['W'].setIntensity(i);
	    }
	    if (this.paths['S'] != undefined) {
		this.paths['S'].setIntensity(i);
	    }
	}
    }
    
});

function build_world (json_world) {
    console.log('building...' + json_world);
    var v;
    for (var i = 0; i < json_world.buildings.length; i++) {
	v = json_world.buildings[i];
	Crafty.e('Building').build(v.x*UNIT_SIZE, 
				   v.y*UNIT_SIZE, 
				   v.w*UNIT_SIZE,
				   v.h*UNIT_SIZE);
    }
    console.log('i vale: ' + i);
}
