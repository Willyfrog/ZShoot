Crafty.c("Z", {
    init: function () {
        this.addComponent("2D, Canvas, Color, Collision");
        this.attr({w: 32, h: 32, life: 2, chaseafter:[], target: null}).color("green");
        this.collision(new Crafty.polygon([0,0],[this._w, 0],[this._w, this._h], [0, this._h]));
        this.onHit("Bullet", function (hitters) {
            var b = hitters[0].obj;
            this.life -= b.dmg;
            b.destroy();
            console.log("ow! damage!");
            if (this.life <= 0) {
                this.destroy();
            }
        });

        this.bind("EnterFrame", function () {
            // check for new target

            if (this.chaseafter.length!==0){
                var p = null,
                    dist = 0;

                if (this.chaseafter.length===1)
                    p = this.chaseafter[0];
                else {
                    p = closerOne(this, this.chaseafter);
                }
                
                dist =  entityDistance(this, p);
                if (entityDistance(this, p) < Z_DISTANCE_INI){ //within smell distance?
                    if (this.target != p) {
                        console.log("oh! hi, nice brains!");
                        this.target = p;
                    }
                }

                if (this.target != null) {
                    if (dist > Z_DISTANCE_END) {
                        this.target = null; //ran away
                    }

                }
                if (this.target != null){
                    var v = new Crafty.math.Vector2D(this.target._x - this._x, this.target._y - this._y);
                    v = v.scaleToMagnitude(Z_SPEED);
                    var old = this._x;
                    this.x += v.x;
                    if (this.hit('Building') || this.hit('Z')){
                        this.x = old;
                    }
                    old = this._y;
                    this.y += v.y;
                    if (this.hit('Building') || this.hit(' Z')){
                        this.y = old;
                    }
                }
            }
        });
    },
    position: function (ox, oy) {
        this.attr({x: ox, y: oy});
        return this;
    },
    chase: function (players) {
        if (players instanceof Array){
            this.chaseafter.concat(players);
        } else {
            this.chaseafter.push(players);
        }
        console.log("chasing after " + this.chaseafter.length + " players");
    }
});

function spawnZ(x, y, chaselist){
    console.log("spawning a Z in " + x + ", " + y);
    var z = Crafty.e("Z");
    z.chase(chaselist);
    return z.position(x, y);

}