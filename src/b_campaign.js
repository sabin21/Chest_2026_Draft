
import './styles/normalize.css'
import './styles/common.css'
import './styles/b_campaign.css'

import Matter from 'matter-js';

// Setup Matter JS
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Body = Matter.Body;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Disable default gravity (we will apply custom gravity towards center)
engine.gravity.y = 0;
engine.gravity.x = 0;

// Get container dimensions
const container = document.getElementById('interactive-area');
// Use let for dimensions to update on resize
let width = container.clientWidth;
let height = container.clientHeight;

// Create renderer
const render = Render.create({
    element: container,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false, // Set to false to see colors/sprites
        background: 'transparent'
    }
});

// Central Circle (Static)
// The visual circle is HTML/CSS, but we need a physics body for collision
// Center coordinates
let cx = width / 2;
let cy = height / 2;
const centerRadius = 300; // Matches CSS width/2

const centerBody = Bodies.circle(cx, cy, centerRadius + 10, { // Slightly larger for padding
    isStatic: true,
    render: {
        fillStyle: 'transparent',
        visible: false // We use the HTML element for visuals
    }
});

Composite.add(world, centerBody);

// Floating Elements (Hearts and Faces)
const floatingBodies = [];
// Use local character images
const imageUrls = [
    './img/type_b/float_character_1.png',
    './img/type_b/float_character_2.png',
    './img/type_b/float_character_3.png',
    './img/type_b/float_character_4.png',
    './img/type_b/float_character_5.png',
    './img/type_b/float_character_6.png',
    './img/type_b/float_character_7.png',
    './img/type_b/float_heart_1.png',
    './img/type_b/float_heart_2.png',
    './img/type_b/float_heart_3.png',
    './img/type_b/float_heart_4.png'
];

function createFloatingBody(x, y, size, type) {
    let body;
    const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    // Calculate scale to fit image (240px) to body size (radius * 2)
    const scale = (size * 2) / 240;

    if (type === 'circle') {
        body = Bodies.circle(x, y, size, {
            restitution: 0.9, // Bouncy
            friction: 0.1,
            frictionAir: 0.02,
            render: {
                sprite: {
                    texture: imageUrl,
                    xScale: scale,
                    yScale: scale
                }
            }
        });
    } else {
        body = Bodies.circle(x, y, size, {
            restitution: 0.9,
            friction: 0.1,
            frictionAir: 0.02,
            render: {
                sprite: {
                    texture: imageUrl,
                    xScale: scale,
                    yScale: scale
                }
            }
        });
    }

    return body;
}

// Spawn bodies around the center
const numBodies = 80;
for (let i = 0; i < numBodies; i++) {
    let body;
    let attempts = 0;
    const maxAttempts = 80;

    while (!body && attempts < maxAttempts) {
        const angle = Math.random() * Math.PI * 2;
        const dist = centerRadius + 100 + Math.random() * 1200; // Spawn outside the center circle
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const size = 50 + Math.random() * 20;

        // Check overlap
        let overlap = false;
        for (let j = 0; j < floatingBodies.length; j++) {
            const other = floatingBodies[j];
            const dx = x - other.position.x;
            const dy = y - other.position.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < size + other.circleRadius + 10) { // +10 buffer
                overlap = true;
                break;
            }
        }

        if (!overlap) {
            body = createFloatingBody(x, y, size, 'circle');
            floatingBodies.push(body);
            Composite.add(world, body);
        }
        attempts++;
    }
}

Events.on(engine, 'beforeUpdate', function () {
    floatingBodies.forEach(body => {
        // Skip gravity if the body is being dragged
        if (mouseConstraint.body === body) return;

        const dx = cx - body.position.x;
        const dy = cy - body.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize force direction
        const forceMagnitude = 0.0005 * body.mass; // Increased strength (10x)
        const force = Vector.create(dx / distance * forceMagnitude, dy / distance * forceMagnitude);

        Body.applyForce(body, body.position, force);
    });
});

// Run the engine
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Add Mouse Interaction
const Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(world, mouseConstraint);
mouse.element.removeEventListener('wheel', mouse.mousewheel);

// Keep the mouse in sync with rendering
render.mouse = mouse;

// Handle Resize
window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight;

    render.canvas.width = width;
    render.canvas.height = height;

    // Update center coordinates
    cx = width / 2;
    cy = height / 2;

    // Reposition center body
    Body.setPosition(centerBody, { x: cx, y: cy });
});

// Animation for Progress Ring
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
}

// Animate from 0 to 75
const targetTemp = 75;
const tempValEl = document.getElementById('temp-val');
let currentTemp = 0;

setTimeout(() => {
    setProgress(targetTemp);

    const interval = setInterval(() => {
        if (currentTemp >= targetTemp) {
            clearInterval(interval);
        } else {
            currentTemp++;
            tempValEl.innerText = currentTemp;
        }
    }, 2000 / targetTemp); // 2 seconds duration
}, 500);
