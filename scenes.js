Crafty.scene("GameScene", function () {
    console.log("Now on GameScene");
    minimap = gen_map(WORLD_WIDTH,WORLD_HEIGHT);
    var area = Crafty.e("2D").attr({x:0, y:0, w:WORLD_WIDTH, h: WORLD_HEIGHT});
    var b = null;
    for (var i=0; i<minimap.length; i++){
	b = Crafty.e("Building");
        b.build(minimap[i][0], minimap[i][1], minimap[i][2], minimap[i][3]);
    }
    Crafty.background("#222");
    
    
    //marcadores
    var s = Crafty.e("Shooter"),
        p1 = Crafty.e("Player");
    s.set_shooter(p1);
    p1.multiway_config(PLAYER_SPEED, "W", "S", "A", "D").color_config("blue").position_config(0, 10);
    Crafty.viewport.clampToEntities = false;
    Crafty.viewport.follow(p1, 0, 0);
        
    this.bind("EndGame", function () {
	p1.destroy();
	area.destroy();
            Crafty.scene("GameOver");
    });
    
    spawnZ(180, 40, p1);
    spawnZ(500, 480, p1);
    
});

Crafty.scene("GameOver", function () {
    Crafty.e("2D, Text, DOM").attr({x: WIDTH / 2 - 50, y: HEIGHT / 3, w:100 }).text("GAME OVER");
    Crafty.e("2D, Text, DOM").attr({x: WIDTH / 2 - 55, y: HEIGHT / 3 + 30, w:110}).text("Press R to restart");
    Crafty.background("#555");
    console.log("GameOver");
    Crafty.e("Keyboard").bind('KeyDown', function (){
	if (this.isDown('R'))
	    Crafty.scene("GameScene");
    });
});