var Keyboard = {
    ARROW_UP:38,
    ARROW_DOWN:40,
    ARROW_LEFT:37,
    ARROW_RIGHT:39,
}

var MOVEMENT_DELTA = 20;

var isOutBoundLeft = function (background, character) {
    return 280 >= character.x
}

var isOutBoundRight = function (background, character) {
    return 680 <= character.x
}

var HelloWorldLayer = cc.Layer.extend({
    scene:null,
    bunny:null,
    bombs: [],
    carrots: [],
    ctor:function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        var size = cc.winSize;

        //posicionando la imagen de fondo
        this.scene = new cc.Sprite(res.fondo_png);
        this.scene.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.scene, 0);

        this.bunny = new cc.Sprite(res.conejo_png);
        this.bunny.setPosition(size.width / 2,size.height * 0.15);
        this.addChild(this.bunny, 1);

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if (Keyboard.ARROW_LEFT == keyCode
                    && !isOutBoundLeft(self.scene, self.bunny))  {

                    self.bunny.x -= MOVEMENT_DELTA;

                } else if (!isOutBoundRight(self.scene, self.bunny)) {

                    self.bunny.x += MOVEMENT_DELTA;

                }
            }
        }, this.bunny);


        this.schedule(this.spriteGenerator);
        this.schedule(this.collictionDectector)
        return true;
    },

    spriteGenerator: function () {
        var r1 = Math.random() * 9;
        var r2 = Math.random() * 9;
        if (r1 <= 2) {
            this._generateBomb();
        }else if (r2 <= 1) {
            this._generateCarrot();
        }
    },
    _generateCarrot: function () {

        if (this.carrots.length > 5) return;

        var size = cc.winSize;
        var rand = (Math.random() * 2.3) + 1.4;

        var fallingSpeed = 5*Math.random() + 2;

        var animation = cc.MoveBy.create(fallingSpeed, cc.p(0,-800));
        var carrot = new cc.Sprite(res.zanahoria_png);

        carrot.setPosition(size.width / rand, size.height + 50);
        carrot.setScale(0.5,0.5);
        this.addChild(carrot, 1);

        carrot.runAction(animation);
        this.carrots.push(carrot);

    },
    _generateBomb: function(){
        if (this.bombs.length > 5) return;

        var size = cc.winSize;
        var r = 2.3*Math.random() + 1.4;

        var fallingSpeed = 10*Math.random() + 5;

        var moveBy = cc.MoveBy.create(fallingSpeed, cc.p(0,-800));
        var bomb = new cc.Sprite(res.bomba_png);

        bomb.setPosition(size.width / r, size.height + 50);
        bomb.setScale(0.5,0.5);
        this.addChild(bomb, 1);

        bomb.runAction(moveBy);
        this.bombs.push(bomb);
    },

    collictionDectector: function(){

        var bunnyBox = this.bunny.getBoundingBox();
        var layer = this;
        var carrots = this.carrots;
        var bombs = this.bombs;

        carrots.forEach(function (carrot) {
            var carrotBox = carrot.getBoundingBox();
            if(cc.rectContainsRect(bunnyBox, carrotBox)){
                layer.removeChild(carrot);
            } else if(carrot.y < 0) {
                layer.removeChild(carrot);
                carrots.splice(carrots.indexOf(carrot), 1);
            }
        });


        bombs.forEach(function (bomb) {
            var bombBox = bomb.getBoundingBox();
            if(cc.rectContainsRect(bunnyBox, bombBox)){
                layer.removeChild(bomb, true);
                cc.director.pause()
            } else if(bomb.y < 0) {
                layer.removeChild(bomb, true);
                bombs.splice(bombs.indexOf(bomb), 1);
            }
        });

   }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
