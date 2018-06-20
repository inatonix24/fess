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
var STAGE_H = window.innerHeight - 140;
var GROUND_W = STAGE_W;
var GROUND_H = 25;
var IMAGE_SIZE = 54;
var mouseJoint = null;
var ground = null;
var mousePoint = new box2d.b2Vec2();
var lastPressObject;

function init() {
    var canvas = document.getElementById("canvas");
    canvas.setAttribute("width", STAGE_W + "px");
     canvas.setAttribute("height", STAGE_H + "px");
    stage = new createjs.Stage(canvas);

    // enable touch action
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(stage);
    }

    // init Physics
    setupPhysics();

    createNeko();

    stage.onPress = handleMouseDown;

    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener("tick", handleTick);
}

function handleMouseDown(event) {
    var mouseX = event.stageX;
    var mouseY = event.stageY;
    mousePoint.Set(mouseX / SCALE, mouseY / SCALE);
    var hitBody = getBodyAtMouse();

    if (hitBody) {
        createNeko();

        //if joint exists then create
        var def = new box2d.b2MouseJointDef();

        def.bodyA = ground;
        def.bodyB = hitBody;
        def.target = mousePoint;

        def.collideConnected = true;
        def.maxForce = 1000 * hitBody.GetMass();
        def.dampingRatio = 0;

        mouseJoint = world.CreateJoint(def);

        lastPressObject = hitBody.GetUserData();
        createjs.Tween.get(lastPressObject, {override:true})
            .to({scaleX:1.4, scaleY:1.4}, 600, createjs.Ease.elasticOut);
        stage.addChild(lastPressObject);

        hitBody.SetAwake(true);
    }

    event.onMouseMove = handleMouseMove;
    event.onMouseUp = handleMouseUp;
}


function handleMouseMove(event) {
    // canvas 上の座標に変換
    var mouseX = event.stageX;
    var mouseY = event.stageY;
    mousePoint.Set(mouseX / SCALE, mouseY / SCALE);

    if (mouseJoint) {
        mouseJoint.SetTarget(mousePoint);
    }
}
function handleMouseUp(event) {
    this.onMouseMove = this.onMouseUp = null; // dispose event handler

    isMousePressed = false;

    if (mouseJoint) {
        world.DestroyJoint(mouseJoint);
        mouseJoint = false;

        if (lastPressObject) {
            createjs.Tween.get(lastPressObject, {override:true})
                .to({scaleX:1, scaleY:1}, 300, createjs.Ease.cubicOut);
        }
    }
}

function createNeko() {
    // create shape
    var bmp = new createjs.Bitmap("../images/nekobean.png");
    bmp.regX = IMAGE_SIZE / 2;
    bmp.regY = IMAGE_SIZE / 2;
    stage.addChild(bmp);

    // create ground
    var fixDef = new box2d.b2FixtureDef(0);
    fixDef.density = 1;
    fixDef.friction = 0.6;
    fixDef.restitution = 0.7;
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    bodyDef.position.x = GROUND_W / SCALE + 5;
    bodyDef.position.y = (Math.random() * 100 + 0) / SCALE;
    bodyDef.userData = bmp;
    fixDef.shape = new box2d.b2CircleShape(IMAGE_SIZE / 2 / SCALE);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function setupPhysics() {
    world = new box2d.b2World(new box2d.b2Vec2(0, 100), true);

    createWall(STAGE_W / 2, 0, GROUND_W, GROUND_H);
    createWall(0, STAGE_H / 2, GROUND_H, GROUND_W);
    createWall2(STAGE_W, STAGE_H / 2, 100, 100);
    ground = createWall(STAGE_W / 2, STAGE_H, GROUND_W, GROUND_H);
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

function createWall2(x, y, w, h) {

    var fixDef = new box2d.b2FixtureDef(0);
    fixDef.density = 1;
    fixDef.friction = 0.5;
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.position.x = x / SCALE + 3;
    bodyDef.position.y = y / SCALE;
    fixDef.shape = new box2d.b2PolygonShape();
    fixDef.shape.SetAsOrientedBox(1, 100,new box2d.b2Vec2(5,0),Math.PI/6);
    var ground = world.CreateBody(bodyDef);
    ground.CreateFixture(fixDef);
    return ground;
}

function getBodyAtMouse(includeStatic) {
    var aabb = new box2d.b2AABB();
    aabb.lowerBound.Set(mousePoint.x - 0.001, mousePoint.y - 0.001);
    aabb.upperBound.Set(mousePoint.x + 0.001, mousePoint.y + 0.001);

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
}