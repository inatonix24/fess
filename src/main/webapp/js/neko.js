var box2d = {
    b2Vec2:Box2D.Common.Math.b2Vec2,
    b2AABB:Box2D.Collision.b2AABB,
    b2BodyDef:Box2D.Dynamics.b2BodyDef,
    b2Body:Box2D.Dynamics.b2Body,
    b2FixtureDef:Box2D.Dynamics.b2FixtureDef,
    b2Fixture:Box2D.Dynamics.b2Fixture,
    b2World:Box2D.Dynamics.b2World,
    b2MassData:Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape:Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape:Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw:Box2D.Dynamics.b2DebugDraw,
    b2MouseJointDef:Box2D.Dynamics.Joints.b2MouseJointDef
};

var SCALE = 30;
var stage, world;
var STAGE_W = window.innerWidth;
var STAGE_H = window.innerHeight - 120;
var GROUND_W = STAGE_W;
var GROUND_H = STAGE_H - 35;
var mouseJoint = null;
var ground = null;
var mousePoint = new box2d.b2Vec2();
var lastPressObject;
var mouseX, mouseY;
var isMouseDown = false;
var isMobile = ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) 
    || navigator.userAgent.indexOf('iPod') > 0 
    || navigator.userAgent.indexOf('Android') > 0)
var isNekocountready = false;
var addedNekocount = 0;
var isNekocountupdating = false;

function init() {
    getNekocount();
    setInterval(updateNekocount, 1000);
    var canvas = document.getElementById("canvas");
    canvas.setAttribute("width", STAGE_W + "px");
    canvas.setAttribute("height", STAGE_H + "px");
    canvas.width *= devicePixelRatio;
    canvas.height *= devicePixelRatio;
    canvas.style.width = String(canvas.width / devicePixelRatio) + "px";
    canvas.style.height = String(canvas.height / devicePixelRatio) + "px";
    STAGE_W *= devicePixelRatio;
    STAGE_H *= devicePixelRatio;
    GROUND_W *= devicePixelRatio;
    GROUND_H *= devicePixelRatio;
    stage = new createjs.Stage(canvas);
    setupPhysics();
    addEvent(canvas);
    createNeko();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener("tick", handleTick);
}

function initAWSconfig() {
    AWS.config.update({
        region: "us-east-1",
    });
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:7019adee-e4b3-44a4-852d-5de814122221",
        RoleArn: "arn:aws:iam::931594971096:role/Cognito_DynamoPoolUnauth"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();
    return docClient;
}

function updateCount(docClient, params) {
    docClient.get(params, function(err, data) {
        if (err) {
            console.error(err)
        } else {
            var nowCount = parseInt($("#nekocount").text())
            var newCount = data.Item.nekocount
            if(isNaN(nowCount) || nowCount < newCount) {
                $("#nekocount").html(newCount)
                if(!isNekocountready) {
                    $("#nekocount").addClass('magictime vanishIn');
                    $("#nekocount").css('visibility', 'visible')
                    isNekocountready = true;
                    setTimeout(function (){
                        //firefoxだとなぜか少し待ってから値を更新しないとcssが変になる場合がある
                        var temp = $("#nekocount").text()
                        $("#nekocount").html(temp)
                        $("#nekocount").css('-webkit-animation', 'neon 1.2s ease-in-out infinite alternate');
                        $("#nekocount").css('animation', 'neon 1.2s ease-in-out infinite alternate');
                    },1100)//検証して最短の時間
                }
            }
        }
    });
}

function getNekocount() {
    var docClient = initAWSconfig();
    AWS.config.credentials.get(function(error) {
        if (!error) {
            var params = {
                TableName :"Nekocount",
                Key:{
                    "id": 0
                }
            };
            setInterval(
                function() {
                    updateCount(docClient, params)
                },
                2000)
        }
    })
}

function updateNekocount() {
    if(!isNekocountupdating && addedNekocount !== 0) {
        isNekocountupdating = true;
        var docClient = initAWSconfig();
        AWS.config.credentials.get(function(error) {
            if (!error) {
                var tempCount = addedNekocount;
                var params = {
                    TableName :"Nekocount",
                    Key:{
                        "id": 0
                    },
                    UpdateExpression: "set nekocount = nekocount + :val",
                    ExpressionAttributeValues:{
                        ":val": tempCount
                    },
                    ReturnValues:"UPDATED_NEW"
                };
                docClient.update(params, function(err, data) {
                    if (err) {
                        console.error(err)
                    } else {
                        addedNekocount = addedNekocount - tempCount;
                    }
                    setTimeout(function() {
                        isNekocountupdating = false;
                    }, 2000);
                });
            }
        })
    }
}

function addNekocount() {
    //isNekocountready falseの場合もカウントをキャッシュした方がいいか。
    //現状だとカウントが表示されるまでにクリックしてもカウントされない。
    if(isNekocountready) {
        addedNekocount += 1;
        $("#nekocount").html(parseInt($("#nekocount").text()) + 1);
    }
}

function addEvent(element) {
    if(isMobile) {
        element.addEventListener("touchstart", function(e) {
            isMouseDown = true;
            handleMouseMove(e);
            e.preventDefault();
            element.addEventListener("touchmove", handleMouseMove, true);
        }, true);
        
        element.addEventListener("touchend", function() {
            element.removeEventListener("touchmove", handleMouseMove, true);
            isMouseDown = false;
            mouseX = undefined;
            mouseY = undefined;
        }, true);
    } else {
        element.addEventListener("mousedown", function(e) {
            isMouseDown = true;
            handleMouseMove(e);
            element.addEventListener("mousemove", handleMouseMove, true);
        }, true);
        
        element.addEventListener("mouseup", function() {
            element.removeEventListener("mousemove", handleMouseMove, true);
            isMouseDown = false;
            mouseX = undefined;
            mouseY = undefined;
        }, true);
    }
}

function handleMouseMove(e) {
    var clientX, clientY;
    if(isMobile) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
    } else {
        clientX = e.clientX
        clientY = e.clientY   
    }
    mouseX = (clientX - canvas.getBoundingClientRect().left) / SCALE * devicePixelRatio;
    mouseY = (clientY - canvas.getBoundingClientRect().top) / SCALE * devicePixelRatio;
}

function createNeko() {
    var x = Math.random();
    var mameRatio = 8;
    var imageSrc = null;
    if(x > mameRatio / 100){
        imageSrc = "images/nekobean.png";
        IMAGE_SIZE_RATIO = 0.2;
    }else{
        imageSrc = "images/mame.png";
        IMAGE_SIZE_RATIO = 0.37;
    }
    var clickedCount = (parseInt($("#nekocount").text()) + 1)
    if((clickedCount % 100) === 0) {
        IMAGE_SIZE_RATIO *= 3;
        if((clickedCount % 1000) === 0) {
            IMAGE_SIZE_RATIO *= 2;
            if((clickedCount % 10000) === 0) {
                IMAGE_SIZE_RATIO *= 2;
            }
        }
    }
    var canvasImage = new Image();
    canvasImage.onload = function() {
        var bmp = new createjs.Bitmap(canvasImage);
        bmp.regX = bmp.image.width / 2;
        bmp.regY = bmp.image.height / 2 ;
        bmp.scaleX = IMAGE_SIZE_RATIO;
        bmp.scaleY = IMAGE_SIZE_RATIO;
        bmp.scaleXorg = bmp.scaleX;
        bmp.scaleYorg = bmp.scaleY;
        stage.addChild(bmp);
        
        var fixDef = new box2d.b2FixtureDef(0);
        fixDef.density = 1;
        fixDef.friction = 0.6;
        fixDef.restitution = 0.7;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.position.x = (Math.random() * 2 * GROUND_W - GROUND_W / 2) / SCALE;
        bodyDef.position.y = (Math.random() * -100) / SCALE;
        bodyDef.userData = bmp;
        fixDef.shape = new box2d.b2CircleShape(bmp.image.height * IMAGE_SIZE_RATIO / 2 / SCALE);
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    }
    canvasImage.src = imageSrc
    addNekocount();
}

function setupPhysics() {
    world = new box2d.b2World(new box2d.b2Vec2(0, 100), true);

    //デバッグ描画の設定
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite ( canvas.getContext ("2d"));
    debugDraw.SetDrawScale(SCALE);     //描画スケール
    debugDraw.SetFillAlpha(0.3);    //半透明値
    debugDraw.SetLineThickness(1.0);//線の太さ
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);// 何をデバッグ描画するか
    world.SetDebugDraw(debugDraw);
    
    createWall2(STAGE_W / SCALE, GROUND_H / SCALE, Math.PI * 0.25);
    createWall2(0, GROUND_H / SCALE, Math.PI * -0.25);
    createBox(STAGE_W / SCALE, GROUND_H / SCALE);
    createBox(0, GROUND_H / SCALE);
    ground = createWall(STAGE_W / 2, GROUND_H, GROUND_W, 0.01);
}

function createWall(x, y, w, h) {
    // create ground shape
    var shape = new createjs.Shape();
    shape.graphics.beginFill("#FFF").drawRect(0, 0, w, h);
    shape.regX = w / 2;
    shape.regY = h / 2;
    stage.addChild(shape);

    // create ground
    var fixDef = new box2d.b2FixtureDef(0);
    fixDef.density = 1;
    fixDef.friction = 0.5;
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;
    bodyDef.userData = shape;
    fixDef.shape = new box2d.b2PolygonShape();
    fixDef.shape.SetAsBox(w / 2 / SCALE, h / 2 / SCALE);
    var ground = world.CreateBody(bodyDef);
    ground.CreateFixture(fixDef);
    return ground;
}

function createWall2(x, y, angle) {
    var fixDef = new box2d.b2FixtureDef(0);
    fixDef.density = 1;
    fixDef.friction = 0.5;
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.position.y = (y-1)/ 2;
    var length = bodyDef.position.y / Math.cos(angle); // 線全体の半分の長さ
    bodyDef.position.x = x + length * Math.sin(angle);
    fixDef.shape = new box2d.b2PolygonShape();
    fixDef.shape.SetAsOrientedBox(0.01, length, new box2d.b2Vec2(0,0), angle);
    var ground = world.CreateBody(bodyDef);
    ground.CreateFixture(fixDef);
    return ground;
}

function createBox(x, y) {

    var fixDef = new box2d.b2FixtureDef(0);
    fixDef.density = 1;
    fixDef.friction = 0.5;
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;
    fixDef.shape = new box2d.b2PolygonShape();
    fixDef.shape.SetAsOrientedBox(0.01, 1,new box2d.b2Vec2(0,0));
    var ground = world.CreateBody(bodyDef);
    ground.CreateFixture(fixDef);
    return ground;
}


function getBodyAtMouse(includeStatic) {
    mousePoint = new box2d.b2Vec2(mouseX, mouseY);
    var aabb = new box2d.b2AABB();
    aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
    aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
    var body = null;

    // Query the world for overlapping shapes.
    function getBodyCallback(fixture) {
        var shape = fixture.GetShape();

        if (fixture.GetBody().GetType() != box2d.b2Body.b2_staticBody || includeStatic) {
            var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mousePoint);

            if (inside) {
                body = fixture.GetBody();
                return false;
            }
        }

        return true;
    }

    world.QueryAABB(getBodyCallback, aabb);
    return body;
}

function handleTick() {

    // マウスが押されていて、マウスジョイントが作成されていない場合
    if(isMouseDown && (!mouseJoint)) {
        var hitBody = getBodyAtMouse();

        if (hitBody) {
            createNeko();
    
            //if joint exists then create
            var def = new box2d.b2MouseJointDef();
    
            def.bodyA = ground;
            def.bodyB = hitBody;
            def.target.Set(mouseX, mouseY); // マウスジョイント位置
    
            def.collideConnected = true;
            def.maxForce = 1000 * hitBody.GetMass();
            def.dampingRatio = 0;
    
            mouseJoint = world.CreateJoint(def);
    
            lastPressObject = hitBody.GetUserData();
            createjs.Tween.get(lastPressObject, {override:true})
                .to({scaleX:lastPressObject.scaleX * 1.4, scaleY:lastPressObject.scaleY * 1.4}, 600, createjs.Ease.elasticOut);
            stage.addChild(lastPressObject);
    
            hitBody.SetAwake(true);
        }
    }
    if(mouseJoint) {
        // マウスドラッグしたとき
        if(isMouseDown) {                
            mouseJoint.SetTarget(new box2d.b2Vec2(mouseX, mouseY));
        } 
        // ドロップしたとき
        else {
            world.DestroyJoint(mouseJoint);
            mouseJoint = null;
            if (lastPressObject) {
                createjs.Tween.get(lastPressObject, {override:true})
                    .to({scaleX:lastPressObject.scaleXorg, scaleY:lastPressObject.scaleYorg }, 500, createjs.Ease.cubicOut);
            }
        }
    }

    world.Step(1 / 60, 10, 10);

    // Box2Dの計算結果を描画に反映
    var body = world.GetBodyList();
    while (body) {
        var obj = body.GetUserData();
        if (obj) {
            var position = body.GetPosition();
            obj.x = position.x * SCALE;
            obj.y = position.y * SCALE;
            obj.rotation = body.GetAngle() * 180 / Math.PI;
        }
        body = body.GetNext();
    }
    stage.update();
    // world.DrawDebugData(); // デバック描画
}