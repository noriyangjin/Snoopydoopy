document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const mainScreen = document.getElementById('main-screen');
    const successScreen = document.getElementById('success-screen');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    // Intro Screen Logic
    introScreen.addEventListener('click', () => {
        introScreen.classList.remove('active');
        introScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
    });

    // Interaction Logic
    let noClickCount = 0;
    const noTexts = ["No", "Are you sure?", "Really?", "Think again!", "Last chance!", "Pretty please?", "Don't break my heart!"];
    const baseYesSize = 1.2;
    const baseNoSize = 1.2;

    noBtn.addEventListener('click', () => {
        noClickCount++;
        
        // Decrease No button size
        const newNoScale = Math.max(0.5, baseNoSize - (noClickCount * 0.1));
        noBtn.style.transform = `scale(${newNoScale})`;
        
        // Increase Yes button size
        const newYesScale = baseYesSize + (noClickCount * 0.5);
        yesBtn.style.transform = `scale(${newYesScale})`;

        // Change Text
        if (noClickCount < noTexts.length) {
            noBtn.innerText = noTexts[noClickCount];
        } else {
            noBtn.innerText = "💔";
        }
    });

    yesBtn.addEventListener('click', () => {
        mainScreen.classList.remove('active');
        mainScreen.classList.add('hidden');
        successScreen.classList.remove('hidden');
        successScreen.classList.add('active');
        startConfetti();
    });

    // Confetti Logic
    let confetti = [];
    const confettiCount = 300;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;
    const colors = [
        { front: 'red', back: 'darkred' },
        { front: 'green', back: 'darkgreen' },
        { front: 'blue', back: 'darkblue' },
        { front: 'yellow', back: 'darkyellow' },
        { front: 'orange', back: 'darkorange' },
        { front: 'pink', back: 'darkpink' },
        { front: 'purple', back: 'darkpurple' },
        { front: 'turquoise', back: 'darkturquoise' }
    ];

    resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    randomRange = (min, max) => Math.random() * (max - min) + min;

    initConfetti = () => {
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                color: colors[Math.floor(randomRange(0, colors.length))],
                dimensions: {
                    x: randomRange(10, 20),
                    y: randomRange(10, 30)
                },
                position: {
                    x: randomRange(0, canvas.width),
                    y: canvas.height - 1
                },
                rotation: randomRange(0, 2 * Math.PI),
                scale: {
                    x: 1,
                    y: 1
                },
                velocity: {
                    x: randomRange(-25, 25),
                    y: randomRange(0, -50)
                }
            });
        }
    };

    // Helper to draw
    render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((confetto, index) => {
            let width = (confetto.dimensions.x * confetto.scale.x);
            let height = (confetto.dimensions.y * confetto.scale.y);

            ctx.translate(confetto.position.x, confetto.position.y);
            ctx.rotate(confetto.rotation);
            
            confetto.velocity.x -= confetto.velocity.x * drag;
            confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
            confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

            confetto.position.x += confetto.velocity.x;
            confetto.position.y += confetto.velocity.y;

            if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

            if (confetto.position.x > canvas.width) confetto.position.x = 0;
            if (confetto.position.x < 0) confetto.position.x = canvas.width;

            confetto.scale.y = Math.cos(confetto.position.y * 0.1);
            ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

            ctx.fillRect(-width / 2, -height / 2, width, height);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });

        if (confetti.length > 0) window.requestAnimationFrame(render);
    };

    startConfetti = () => {
        initConfetti();
        render();
    };
});
