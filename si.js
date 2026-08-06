// Motherboard Simulation JavaScript

// Setup canvas for motherboard simulation
const canvas = document.getElementById('motherboardCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to full viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables for nodes, lines, and other network components
const spacing = 80;
const nodes = [];
const lines = [];
let allowMotion = false;
let glowingNodes = [];
let glowingLines = [];

// Create nodes (circles) in the canvas space
for (let x = 0; x < canvas.width; x += spacing) {
    for (let y = 0; y < canvas.height; y += spacing) {
        nodes.push({ x, y, visible: false });
    }
}

// Create lines between nodes to simulate a network
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < spacing + 20 && Math.random() < 0.3) {
            lines.push({ a, b, visible: false });
        }
    }
}

// Setup glowing effects for nodes and lines
for (let i = 0; i < 60; i++) {
    glowingNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 4,
        glow: false
    });

    glowingLines.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        glow: false
    });
}

// Draw the nodes (circles) and lines (connections)
function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (allowMotion) {
        lines.forEach((line, i) => {
            line.a.x += Math.sin(Date.now() * 0.001 + i) * 0.1;
            line.b.x += Math.sin(Date.now() * 0.001 + i + 1) * 0.1;
            line.a.y += Math.cos(Date.now() * 0.001 + i) * 0.1;
            line.b.y += Math.cos(Date.now() * 0.001 + i + 1) * 0.1;
        });
    }

    // Draw the glowing lines
    glowingLines.forEach(line => {
        if (line.glow) {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.strokeStyle = "#00ff99";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00ff99";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    // Draw the glowing nodes
    nodes.forEach(node => {
        if (node.visible) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#00ff99";
            ctx.shadowBlur = 5;
            ctx.shadowColor = "#00ff99";
            ctx.fill();
        }
    });

    // Draw glowing circles randomly
    glowingNodes.forEach(node => {
        if (node.glow) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = "#00ff99";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00ff99";
            ctx.fill();
        }
    });
}

// Update progress based on form inputs (Simulating motherboard action)
function updateProgressByInputs() {
    const inputs = document.querySelectorAll('.input-field');
    const total = inputs.length;
    const filled = Array.from(inputs).filter(i => i.value.trim()).length;
    const progress = filled / total;

    const visibleNodes = Math.floor(progress * nodes.length);
    const visibleLines = Math.floor(progress * lines.length);
    const visibleShapes = Math.floor(progress * glowingNodes.length);

    nodes.forEach((n, i) => n.visible = i < visibleNodes);
    lines.forEach((l, i) => l.visible = i < visibleLines);
    glowingNodes.forEach((s, i) => s.glow = i < visibleShapes);
    glowingLines.forEach((l, i) => l.glow = i < visibleShapes);

    allowMotion = (filled === total);
}

// Track changes in input fields to trigger the update
function trackInputs() {
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('input', updateProgressByInputs);
    });
}

// Start the tracking when the page is loaded
trackInputs();

// Continuously draw the network
setInterval(drawNetwork, 50);

// Extra functionality for simulation
function simulateRandomEvents() {
    // Random events that affect the network, for example, random glowing lines or nodes
    setInterval(() => {
        const randomNode = glowingNodes[Math.floor(Math.random() * glowingNodes.length)];
        randomNode.glow = !randomNode.glow;
    }, 2000);
}

// Start the random event simulation
simulateRandomEvents();

// Adding more Nodes and Lines with Advanced Effects
const advancedNodes = [];
const advancedLines = [];

// Function to generate advanced glowing nodes
function createAdvancedNodes() {
    for (let x = 0; x < canvas.width; x += spacing * 2) {
        for (let y = 0; y < canvas.height; y += spacing * 2) {
            advancedNodes.push({ x, y, size: Math.random() * 10 + 5, visible: false });
        }
    }
}

// Function to create more complex lines between nodes
function createAdvancedLines() {
    for (let i = 0; i < advancedNodes.length; i++) {
        for (let j = i + 1; j < advancedNodes.length; j++) {
            const a = advancedNodes[i], b = advancedNodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < spacing + 40 && Math.random() < 0.2) {
                advancedLines.push({ a, b, visible: false });
            }
        }
    }
}

// Draw advanced nodes and lines on canvas
function drawAdvancedNetwork() {
    advancedNodes.forEach(node => {
        if (node.visible) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = "#00ff99";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#00ff99";
            ctx.fill();
        }
    });

    advancedLines.forEach(line => {
        if (line.visible) {
            ctx.beginPath();
            ctx.moveTo(line.a.x, line.a.y);
            ctx.lineTo(line.b.x, line.b.y);
            ctx.strokeStyle = "#00ff99";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00ff99";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

// Update advanced network visibility based on progress
function updateAdvancedProgress() {
    const inputs = document.querySelectorAll('.input-field');
    const total = inputs.length;
    const filled = Array.from(inputs).filter(i => i.value.trim()).length;
    const progress = filled / total;

    const visibleNodes = Math.floor(progress * advancedNodes.length);
    const visibleLines = Math.floor(progress * advancedLines.length);

    advancedNodes.forEach((n, i) => n.visible = i < visibleNodes);
    advancedLines.forEach((l, i) => l.visible = i < visibleLines);
}

// Add new random events that affect the advanced network
function advancedSimulationEvents() {
    setInterval(() => {
        const randomNode = advancedNodes[Math.floor(Math.random() * advancedNodes.length)];
        randomNode.visible = !randomNode.visible;
    }, 3000);

    setInterval(() => {
        const randomLine = advancedLines[Math.floor(Math.random() * advancedLines.length)];
        randomLine.visible = !randomLine.visible;
    }, 4000);
}

// Start the advanced simulation
createAdvancedNodes();
createAdvancedLines();
advancedSimulationEvents();

// Additional Dynamic Effects for Node Interactions
function nodeInteractionEffects() {
    setInterval(() => {
        advancedNodes.forEach(node => {
            node.size = Math.random() * 10 + 5;
        });
    }, 1000);

    setInterval(() => {
        advancedLines.forEach(line => {
            line.a.x += Math.random() * 10 - 5;
            line.a.y += Math.random() * 10 - 5;
            line.b.x += Math.random() * 10 - 5;
            line.b.y += Math.random() * 10 - 5;
        });
    }, 2000);
}

// Adding a New Layer of Nodes for Interaction
const interactiveNodes = [];
const interactiveLines = [];

// Create interactive nodes for user engagement
function createInteractiveNodes() {
    for (let x = 0; x < canvas.width; x += spacing * 1.5) {
        for (let y = 0; y < canvas.height; y += spacing * 1.5) {
            interactiveNodes.push({ x, y, size: Math.random() * 8 + 6, visible: false });
        }
    }
}

// Create interactive lines that connect the interactive nodes
function createInteractiveLines() {
    for (let i = 0; i < interactiveNodes.length; i++) {
        for (let j = i + 1; j < interactiveNodes.length; j++) {
            const a = interactiveNodes[i], b = interactiveNodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < spacing + 20 && Math.random() < 0.25) {
                interactiveLines.push({ a, b, visible: false });
            }
        }
    }
}

// Draw interactive nodes and lines
function drawInteractiveNetwork() {
    interactiveNodes.forEach(node => {
        if (node.visible) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = "#ff9900";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ff9900";
            ctx.fill();
        }
    });

    interactiveLines.forEach(line => {
        if (line.visible) {
            ctx.beginPath();
            ctx.moveTo(line.a.x, line.a.y);
            ctx.lineTo(line.b.x, line.b.y);
            ctx.strokeStyle = "#ff9900";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ff9900";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

// Update interactive network visibility
function updateInteractiveProgress() {
    const inputs = document.querySelectorAll('.input-field');
    const total = inputs.length;
    const filled = Array.from(inputs).filter(i => i.value.trim()).length;
    const progress = filled / total;

    const visibleNodes = Math.floor(progress * interactiveNodes.length);
    const visibleLines = Math.floor(progress * interactiveLines.length);

    interactiveNodes.forEach((n, i) => n.visible = i < visibleNodes);
    interactiveLines.forEach((l, i) => l.visible = i < visibleLines);
}

// Start the interactive network
createInteractiveNodes();
createInteractiveLines();

// Simulate random node interactions
function interactiveSimulation() {
    setInterval(() => {
        const randomNode = interactiveNodes[Math.floor(Math.random() * interactiveNodes.length)];
        randomNode.visible = !randomNode.visible;
    }, 5000);

    setInterval(() => {
        const randomLine = interactiveLines[Math.floor(Math.random() * interactiveLines.length)];
        randomLine.visible = !randomLine.visible;
    }, 6000);
}

// Start interactive network simulation
interactiveSimulation();

// Combine all simulations together for a complete motherboard experience
function startCompleteSimulation() {
    drawNetwork();
    drawAdvancedNetwork();
    drawInteractiveNetwork();
}

// Trigger the full simulation at intervals
setInterval(startCompleteSimulation, 50);
// Adding Complex Node Interactions
const complexNodes = [];
const complexLines = [];

// Create complex nodes that will interact dynamically
function createComplexNodes() {
    for (let x = 0; x < canvas.width; x += spacing * 2.5) {
        for (let y = 0; y < canvas.height; y += spacing * 2.5) {
            complexNodes.push({ x, y, size: Math.random() * 10 + 10, visible: false });
        }
    }
}

// Create complex lines that connect the complex nodes
function createComplexLines() {
    for (let i = 0; i < complexNodes.length; i++) {
        for (let j = i + 1; j < complexNodes.length; j++) {
            const a = complexNodes[i], b = complexNodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < spacing + 30 && Math.random() < 0.3) {
                complexLines.push({ a, b, visible: false });
            }
        }
    }
}

// Draw complex nodes and lines
function drawComplexNetwork() {
    complexNodes.forEach(node => {
        if (node.visible) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = "#ff3300";
            ctx.shadowBlur = 25;
            ctx.shadowColor = "#ff3300";
            ctx.fill();
        }
    });

    complexLines.forEach(line => {
        if (line.visible) {
            ctx.beginPath();
            ctx.moveTo(line.a.x, line.a.y);
            ctx.lineTo(line.b.x, line.b.y);
            ctx.strokeStyle = "#ff3300";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ff3300";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    });
}

// Update complex network visibility based on progress
function updateComplexProgress() {
    const inputs = document.querySelectorAll('.input-field');
    const total = inputs.length;
    const filled = Array.from(inputs).filter(i => i.value.trim()).length;
    const progress = filled / total;

    const visibleNodes = Math.floor(progress * complexNodes.length);
    const visibleLines = Math.floor(progress * complexLines.length);

    complexNodes.forEach((n, i) => n.visible = i < visibleNodes);
    complexLines.forEach((l, i) => l.visible = i < visibleLines);
}

// Adding Complex Node Interaction
function complexNodeInteractions() {
    setInterval(() => {
        const randomNode = complexNodes[Math.floor(Math.random() * complexNodes.length)];
        randomNode.size = Math.random() * 15 + 10; // Change size dynamically
    }, 3000);

    setInterval(() => {
        complexLines.forEach(line => {
            const rand = Math.random();
            if (rand < 0.05) {
                line.visible = !line.visible; // Randomly toggle visibility of lines
            }
        });
    }, 5000);
}

// Start the complex network and interactions
createComplexNodes();
createComplexLines();
complexNodeInteractions();

// Adding another layer of interaction based on user input
function userInteractionLayer() {
    const userNodes = [];
    const userLines = [];

    // Create user interaction nodes that respond to the mouse
    function createUserNodes() {
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            userNodes.push({ x, y, size: 10, visible: true });
        }
    }

    // Create lines between user nodes
    function createUserLines() {
        for (let i = 0; i < userNodes.length; i++) {
            for (let j = i + 1; j < userNodes.length; j++) {
                const a = userNodes[i], b = userNodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < spacing + 50 && Math.random() < 0.5) {
                    userLines.push({ a, b, visible: true });
                }
            }
        }
    }

    // Draw user interaction nodes
    function drawUserNetwork() {
        userNodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = "#ffcc00";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ffcc00";
            ctx.fill();
        });

        userLines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.a.x, line.a.y);
            ctx.lineTo(line.b.x, line.b.y);
            ctx.strokeStyle = "#ffcc00";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ffcc00";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    // Mouse interaction: Update node positions with mouse movement
    function mouseInteraction() {
        canvas.addEventListener("mousemove", (event) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Move closest node to mouse
            let closestNode = null;
            let minDistance = Infinity;
            userNodes.forEach(node => {
                const dist = Math.sqrt(Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2));
                if (dist < minDistance) {
                    closestNode = node;
                    minDistance = dist;
                }
            });

            if (closestNode) {
                closestNode.x = mouseX;
                closestNode.y = mouseY;
            }
        });
    }

    createUserNodes();
    createUserLines();
    mouseInteraction();

    // Update user interaction layer
    setInterval(drawUserNetwork, 50);
}

// Initialize the full simulation with multiple networks
function initializeFullSimulation() {
    drawNetwork();          // Regular network drawing
    drawAdvancedNetwork();  // Advanced network drawing
    drawInteractiveNetwork(); // Interactive network drawing
    drawComplexNetwork();   // Complex network drawing
    drawUserNetwork();      // User interaction layer drawing
}

// Call the initialization function to start drawing everything
initializeFullSimulation();

// Continuous update for network interactions
setInterval(initializeFullSimulation, 50);
