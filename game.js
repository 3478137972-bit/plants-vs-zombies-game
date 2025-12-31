// 游戏状态
const game = {
    sun: 50,
    level: 1,
    running: false,
    selectedPlant: null,
    plants: [],
    zombies: [],
    bullets: [],
    suns: [],
    progress: 0,
    totalZombies: 0,
    killedZombies: 0
};

// 植物类型配置
const plantTypes = {
    sunflower: { cost: 50, hp: 100, emoji: '🌻', cooldown: 24000, produce: 'sun' },
    peashooter: { cost: 100, hp: 200, emoji: '🌱', cooldown: 1500, produce: 'bullet' },
    wallnut: { cost: 50, hp: 800, emoji: '🥜', cooldown: 0, produce: null }
};

// 僵尸类型配置
const zombieTypes = {
    normal: { hp: 100, speed: 0.7, damage: 10, emoji: '🧟' },
    cone: { hp: 200, speed: 0.56, damage: 10, emoji: '🧟‍♂️' },
    bucket: { hp: 350, speed: 0.42, damage: 15, emoji: '🧟‍♀️' }
};

// 计算关卡僵尸总数
function calculateTotalZombies(level) {
    return Math.min(15 + level * 3, 30);
}

// 初始化游戏板
function initBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => placePlant(row, col);
            board.appendChild(cell);
        }
    }
}

// 选择植物卡片
document.querySelectorAll('.card').forEach(card => {
    card.onclick = () => {
        const cost = parseInt(card.dataset.cost);
        if (game.sun >= cost) {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            game.selectedPlant = card.dataset.plant;
        }
    };
});

// 放置植物
function placePlant(row, col) {
    if (!game.running || !game.selectedPlant) return;

    const plantType = plantTypes[game.selectedPlant];
    if (game.sun < plantType.cost) return;

    // 检查是否已有植物
    if (game.plants.some(p => p.row === row && p.col === col)) return;

    game.sun -= plantType.cost;
    updateSunDisplay();

    const plant = {
        type: game.selectedPlant,
        row,
        col,
        hp: plantType.hp,
        maxHp: plantType.hp,
        lastAction: Date.now(),
        element: createPlantElement(game.selectedPlant, row, col)
    };

    game.plants.push(plant);
    game.selectedPlant = null;
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
}

// 创建植物元素
function createPlantElement(type, row, col) {
    const plant = document.createElement('div');
    plant.className = 'plant';
    plant.innerHTML = `
        <div class="hp-bar"><div class="hp-fill"></div></div>
        <div>${plantTypes[type].emoji}</div>
    `;
    plant.style.top = `${row * 102 + 10}px`;
    plant.style.left = `${col * 72 + 10}px`;
    document.getElementById('gameBoard').appendChild(plant);
    return plant;
}

// 生成僵尸
function spawnZombie(type, row) {
    const zombieType = zombieTypes[type];
    const zombie = {
        type,
        row,
        hp: zombieType.hp,
        maxHp: zombieType.hp,
        x: 650,
        speed: zombieType.speed,
        damage: zombieType.damage,
        lastAttack: Date.now(),
        element: createZombieElement(type, row)
    };
    game.zombies.push(zombie);
}

// 创建僵尸元素
function createZombieElement(type, row) {
    const zombie = document.createElement('div');
    zombie.className = 'zombie';
    zombie.innerHTML = `
        <div class="hp-bar"><div class="hp-fill"></div></div>
        <div>${zombieTypes[type].emoji}</div>
    `;
    zombie.style.top = `${row * 102 + 10}px`;
    zombie.style.left = '650px';
    document.getElementById('gameBoard').appendChild(zombie);
    return zombie;
}

// 生成阳光
function spawnSun(x, y) {
    const sun = {
        x,
        y,
        element: createSunElement(x, y),
        lifetime: Date.now()
    };
    game.suns.push(sun);

    setTimeout(() => {
        const index = game.suns.indexOf(sun);
        if (index > -1) {
            sun.element.remove();
            game.suns.splice(index, 1);
        }
    }, 8000);
}

// 创建阳光元素
function createSunElement(x, y) {
    const sun = document.createElement('div');
    sun.className = 'sun';
    sun.textContent = '☀';
    sun.style.left = `${x}px`;
    sun.style.top = `${y}px`;
    sun.onclick = () => collectSun(sun);
    document.getElementById('gameBoard').appendChild(sun);
    return sun;
}

// 收集阳光
function collectSun(sunElement) {
    const index = game.suns.findIndex(s => s.element === sunElement);
    if (index > -1) {
        game.sun += 25;
        updateSunDisplay();
        sunElement.remove();
        game.suns.splice(index, 1);
    }
}

// 发射子弹
function shootBullet(plant) {
    const bullet = {
        row: plant.row,
        x: plant.col * 72 + 60,
        element: createBulletElement(plant.row, plant.col * 72 + 60)
    };
    game.bullets.push(bullet);
}

// 创建子弹元素
function createBulletElement(row, x) {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.top = `${row * 102 + 45}px`;
    bullet.style.left = `${x}px`;
    document.getElementById('gameBoard').appendChild(bullet);
    return bullet;
}

// 更新阳光显示
function updateSunDisplay() {
    document.getElementById('sunCount').textContent = game.sun;
    document.querySelectorAll('.card').forEach(card => {
        const cost = parseInt(card.dataset.cost);
        card.classList.toggle('disabled', game.sun < cost);
    });
}

// 更新进度条
function updateProgress() {
    game.progress = (game.killedZombies / game.totalZombies) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${game.progress}%`;
    }
}

// 游戏循环
function gameLoop() {
    if (!game.running) return;

    const now = Date.now();

    // 植物行动
    game.plants.forEach(plant => {
        const plantType = plantTypes[plant.type];
        if (now - plant.lastAction >= plantType.cooldown) {
            if (plantType.produce === 'sun') {
                spawnSun(plant.col * 72 + 20, plant.row * 102 + 20);
                plant.lastAction = now;
            } else if (plantType.produce === 'bullet') {
                const hasZombieInRow = game.zombies.some(z => z.row === plant.row);
                if (hasZombieInRow) {
                    shootBullet(plant);
                    plant.lastAction = now;
                }
            }
        }
    });

    // 移动僵尸
    game.zombies.forEach(zombie => {
        const plantsInRow = game.plants.filter(p => p.row === zombie.row);
        const blockingPlant = plantsInRow.find(p => {
            const plantX = p.col * 72;
            return zombie.x <= plantX + 60 && zombie.x >= plantX;
        });

        if (blockingPlant) {
            if (now - zombie.lastAttack >= 1000) {
                blockingPlant.hp -= zombie.damage;
                updatePlantHP(blockingPlant);
                zombie.lastAttack = now;

                if (blockingPlant.hp <= 0) {
                    blockingPlant.element.remove();
                    game.plants = game.plants.filter(p => p !== blockingPlant);
                }
            }
        } else {
            zombie.x -= zombie.speed;
            zombie.element.style.left = `${zombie.x}px`;

            if (zombie.x < 0) {
                gameOver();
                return;
            }
        }
    });

    // 移动子弹
    game.bullets.forEach(bullet => {
        bullet.x += 5;
        bullet.element.style.left = `${bullet.x}px`;

        // 检测碰撞
        const hitZombie = game.zombies.find(z =>
            z.row === bullet.row &&
            bullet.x >= z.x &&
            bullet.x <= z.x + 60
        );

        if (hitZombie) {
            hitZombie.hp -= 20;
            updateZombieHP(hitZombie);
            bullet.element.remove();
            game.bullets = game.bullets.filter(b => b !== bullet);

            if (hitZombie.hp <= 0) {
                hitZombie.element.remove();
                game.zombies = game.zombies.filter(z => z !== hitZombie);
                game.killedZombies++;
                updateProgress();
            }
        } else if (bullet.x > 700) {
            bullet.element.remove();
            game.bullets = game.bullets.filter(b => b !== bullet);
        }
    });

    // 检查关卡完成
    if (game.killedZombies >= game.totalZombies && game.zombies.length === 0) {
        levelComplete();
    }

    requestAnimationFrame(gameLoop);
}

// 更新植物血量
function updatePlantHP(plant) {
    const hpFill = plant.element.querySelector('.hp-fill');
    hpFill.style.width = `${(plant.hp / plant.maxHp) * 100}%`;
}

// 更新僵尸血量
function updateZombieHP(zombie) {
    const hpFill = zombie.element.querySelector('.hp-fill');
    hpFill.style.width = `${(zombie.hp / zombie.maxHp) * 100}%`;
}

// 开始关卡
function startLevel() {
    game.running = true;
    game.totalZombies = calculateTotalZombies(game.level);
    game.killedZombies = 0;
    game.spawnedZombies = 0;

    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('nextLevelBtn').style.display = 'none';

    updateProgress();
    spawnZombiesGradually();
    gameLoop();
}

// 渐进式生成僵尸
function spawnZombiesGradually() {
    if (!game.running || game.spawnedZombies >= game.totalZombies) return;

    const row = Math.floor(Math.random() * 5);
    const progress = game.spawnedZombies / game.totalZombies;

    let type = 'normal';
    if (progress > 0.7 && Math.random() < 0.3) type = 'bucket';
    else if (progress > 0.4 && Math.random() < 0.4) type = 'cone';

    spawnZombie(type, row);
    game.spawnedZombies++;

    const interval = Math.max(3000 - game.level * 200, 1500);
    setTimeout(spawnZombiesGradually, interval);
}

// 关卡完成
function levelComplete() {
    game.running = false;
    alert(`关卡 ${game.level} 完成！`);
    document.getElementById('nextLevelBtn').style.display = 'inline-block';
}

// 游戏结束
function gameOver() {
    game.running = false;
    alert('游戏结束！僵尸进入了你的房子！');
    document.getElementById('startBtn').style.display = 'inline-block';
    resetGame();
}

// 重置游戏
function resetGame() {
    game.plants.forEach(p => p.element.remove());
    game.zombies.forEach(z => z.element.remove());
    game.bullets.forEach(b => b.element.remove());
    game.suns.forEach(s => s.element.remove());

    game.plants = [];
    game.zombies = [];
    game.bullets = [];
    game.suns = [];
    game.sun = 50;
    game.level = 1;

    updateSunDisplay();
    document.getElementById('levelNum').textContent = game.level;
}

// 下一关
document.getElementById('nextLevelBtn').onclick = () => {
    game.level++;
    document.getElementById('levelNum').textContent = game.level;
    game.sun += 50;
    updateSunDisplay();
    startLevel();
};

// 开始游戏
document.getElementById('startBtn').onclick = () => {
    resetGame();
    startLevel();
};

// 初始化
initBoard();
updateSunDisplay();

// 定期生成天降阳光
setInterval(() => {
    if (game.running) {
        const x = Math.random() * 600;
        const y = Math.random() * 400;
        spawnSun(x, y);
    }
}, 10000);
