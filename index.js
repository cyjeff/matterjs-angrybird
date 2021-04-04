// 1. Create World and Ground

let engine = Matter.Engine.create();
let render = Matter.Render.create({
  element: document.body,
  engine: engine,
});

let ground = Matter.Bodies.rectangle(400, 600, 1000, 100, { isStatic: true });
Matter.World.add(engine.world, [ground]);

// 2. Add Targets

let pyramid = Matter.Composites.pyramid(500, 100, 9, 6, 10, 0, function (x, y) {
  return Matter.Bodies.rectangle(x, y, 20, 60);
});

Matter.World.add(engine.world, [pyramid]);

// 3a. Add Ball and Sling

let ball = Matter.Bodies.circle(200, 450, 15);
let sling = Matter.Constraint.create({
  pointA: { x: 200, y: 450 },
  bodyB: ball,
  stiffness: 0.01,
});

Matter.World.add(engine.world, [ball, sling]);

// 3b.

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
});
render.mouse = mouse;

Matter.World.add(engine.world, [mouseConstraint]);

// 4. Add Firing Function

let firing = false;
Matter.Events.on(mouseConstraint, "enddrag", (e) => {
  if (e.body === ball) firing = true;
});
Matter.Events.on(engine, "afterUpdate", () => {
  if (firing && ball.position.x - 200 > 30) {
    ball = Matter.Bodies.circle(200, 450, 15);
    Matter.World.add(engine.world, ball);
    sling.bodyB = ball;
    firing = false;
  }
});

// Run the Engine

Matter.Render.run(render);
Matter.Engine.run(engine);
