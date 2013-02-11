// primero pre-generado -> despues generador automatico
var world = {
    buildings:[
	{x:4,y:4,w:10,h:9},
	{x:4,y:17,w:10,h:13},
	{x:18,y:4,w:12,h:26},
	{x:34,y:4,w:24,h:12},
	{x:34,y:20,w:24,h:10},
	{x:4,y:34,w:23,h:23},
	{x:31,y:34,w:9,h:23},
	{x:44,y:34,w:14,h:10},
	{x:44,y:48,w:14,h:9}
    ],
    intersections:[]
};

Crafty.scene("GameScene", function () {
    console.log("Now on GameScene");
    Crafty.sprite(1,"recursos/z.png",{z1:[0,0,20,32]});
    //build_map(WORLD_WIDTH,WORLD_HEIGHT);
    //var area = Crafty.e("2D").attr({x:0, y:0, w:WORLD_WIDTH, h: WORLD_HEIGHT});
    console.log(world);
    build_world(world); //TODO: generar aleatoriamente el mundo

    Crafty.background("#222");
    
    
    //marcadores
    var s = Crafty.e("Shooter"),
        p1 = Crafty.e("Player");
    s.set_shooter(p1);
    p1.multiway_config(PLAYER_SPEED, "W", "S", "A", "D").color_config("blue").position_config(0, 10);
    Crafty.viewport.clampToEntities = false;
    Crafty.viewport.follow(p1, 0, 0);
    //Crafty.viewport.bounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        
    this.bind("EndGame", function () {
	p1.destroy();
	area.destroy();
            Crafty.scene("GameOver");
    });
    
    //spawnZ(180, 40, p1);
    //spawnZ(500, 480, p1);
    
});

Crafty.scene("GameOver", function () {
    console.log("vpx: " +  Crafty.viewport.x);
    console.log("vpy: " +  Crafty.viewport.y);
    Crafty("2D").destroy(); //remove all zombies
    Crafty.viewport.x=0;
    Crafty.viewport.y=0;
    Crafty.e("2D, Text, DOM").attr({x: WIDTH / 2 - 50, y: HEIGHT / 3, w:100 }).text("GAME OVER");
    Crafty.e("2D, Text, DOM").attr({x: WIDTH / 2 - 55, y: HEIGHT / 3 + 30, w:110}).text("Press R to restart");
    Crafty.background("#555");
    console.log("GameOver");
    Crafty.e("Keyboard").bind('KeyDown', function (){
	if (this.isDown('R')){
	    this.unbind('KeyDown');
	    Crafty.scene("GameScene");
	}
    });
});

Crafty.scene("LoadingScene", function () {
    console.log("Loading Assets");
});