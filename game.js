// 游戏状态
const game = {
    state: 'start', // start, selection, playing
    sun: 50,
    level: 1,
    running: false,
    selectedPlant: null,
    selectedSlots: [],
    plants: [],
    zombies: [],
    bullets: [],
    suns: [],
    startTime: 0,
    gameTime: 0,
    levelDuration: 240,
    firstZombieShown: false,
    shovelActive: false,
    plantCooldowns: {}
};

// 植物类型配置
const plantTypes = {
    sunflower: {
        name: '向日葵', cost: 50, hp: 100, cooldown: 7500, produce: 'sun',
        svg: '<svg viewBox="0 0 100 100" width="70" height="70" style="overflow:visible"><g transform-origin="50 80"><animateTransform attributeName="transform" type="rotate" values="-5;5;-5" dur="2s" repeatCount="indefinite"/><path d="M50 95 L50 60" stroke="#4caf50" stroke-width="6" fill="none"/><path d="M50 80 Q30 70 20 80 Q30 90 50 85" fill="#4caf50" stroke="#2e7d32" stroke-width="2"/><path d="M50 80 Q70 70 80 80 Q70 90 50 85" fill="#4caf50" stroke="#2e7d32" stroke-width="2"/><path d="M50 20 L60 40 L80 30 L70 50 L90 60 L70 70 L80 90 L60 80 L50 100 L40 80 L20 90 L30 70 L10 60 L30 50 L10 30 L40 40 Z" fill="#fbc02d" stroke="#f57f17" stroke-width="2"/><circle cx="50" cy="50" r="35" fill="#ffeb3b" stroke="#fbc02d" stroke-width="2" stroke-dasharray="5,2"/><circle cx="50" cy="50" r="22" fill="#5d4037" stroke="#3e2723" stroke-width="2"/><circle cx="42" cy="45" r="3" fill="black"/><circle cx="58" cy="45" r="3" fill="black"/><path d="M40 55 Q50 62 60 55" stroke="black" stroke-width="2" fill="none"/></g></svg>'
    },
    peashooter: {
        name: '豌豆射手', cost: 100, hp: 200, cooldown: 1050, produce: 'bullet',
        svg: '<svg viewBox="0 0 100 100" width="70" height="70" style="overflow:visible"><path d="M50 90 Q45 60 35 50" stroke="#4caf50" stroke-width="6" fill="none"/><path d="M50 90 Q30 90 20 80 Q30 100 50 95" fill="#4caf50" stroke="#2e7d32" stroke-width="2"/><path d="M50 90 Q70 90 80 80 Q70 100 50 95" fill="#4caf50" stroke="#2e7d32" stroke-width="2"/><circle cx="35" cy="40" r="26" fill="#2e7d32" opacity="0.3"/><circle cx="35" cy="35" r="25" fill="#76ff03" stroke="#2e7d32" stroke-width="3"/><path d="M55 25 L85 20 L85 50 L55 45 Z" fill="#76ff03" stroke="#2e7d32" stroke-width="3"/><ellipse cx="85" cy="35" rx="5" ry="15" fill="#33691e"/><path d="M15 35 Q10 20 25 25" fill="#4caf50" stroke="#2e7d32" stroke-width="2"/><circle cx="45" cy="25" r="5" fill="black"/><circle cx="47" cy="23" r="1.5" fill="white"/><path d="M40 18 L55 20" stroke="#1b5e20" stroke-width="2"/></svg>'
    },
    snowpea: {
        name: '寒冰射手', cost: 175, hp: 200, cooldown: 1050, produce: 'icebullet',
        svg: '<svg viewBox="0 0 100 100" width="50" height="50"><circle cx="55" cy="35" r="22" fill="#87CEEB" stroke="#4682B4" stroke-width="3"/><ellipse cx="30" cy="35" rx="15" ry="10" fill="#87CEEB" stroke="#4682B4" stroke-width="2"/><path d="M50 60 Q45 85 50 95" stroke="#2e7d32" stroke-width="6" fill="none"/><ellipse cx="50" cy="90" rx="18" ry="8" fill="#4a8b1c"/><circle cx="50" cy="30" r="4" fill="#fff"/><circle cx="60" cy="30" r="4" fill="#fff"/><path d="M55 20 L60 25 L55 30" stroke="#fff" stroke-width="2" fill="none"/></svg>'
    },
    wallnut: {
        name: '坚果墙', cost: 50, hp: 800, cooldown: 30000, produce: null,
        svg: '<svg viewBox="0 0 100 100" width="70" height="70" style="overflow:visible"><g transform-origin="50 90"><animateTransform attributeName="transform" type="rotate" values="-2;2;-2" dur="3s" repeatCount="indefinite"/><ellipse cx="50" cy="50" rx="30" ry="40" fill="#d7ccc8" stroke="#5d4037" stroke-width="4"/><path d="M35 25 Q50 15 65 25" stroke="#8d6e63" stroke-width="3" fill="none"/><path d="M30 60 Q50 70 70 60" stroke="#8d6e63" stroke-width="3" fill="none"/><circle cx="38" cy="40" r="10" fill="white" stroke="#5d4037" stroke-width="2"/><circle cx="42" cy="40" r="3" fill="black"/><circle cx="62" cy="40" r="10" fill="white" stroke="#5d4037" stroke-width="2"/><circle cx="66" cy="40" r="3" fill="black"/><line x1="45" y1="55" x2="55" y2="55" stroke="#5d4037" stroke-width="2"/></g></svg>'
    },
    cherrybomb: {
        name: '樱桃炸弹', cost: 150, hp: 100, cooldown: 50000, produce: 'explode',
        svg: '<svg viewBox="0 0 100 100" width="50" height="50"><circle cx="40" cy="60" r="20" fill="#d32f2f" stroke="#b71c1c" stroke-width="3"/><circle cx="60" cy="60" r="20" fill="#d32f2f" stroke="#b71c1c" stroke-width="3"/><path d="M40 40 Q50 20 60 40" stroke="#2e7d32" stroke-width="3" fill="none"/><circle cx="38" cy="55" r="3" fill="#fff"/><circle cx="58" cy="55" r="3" fill="#fff"/></svg>'
    },
    potatomine: {
        name: '土豆雷', cost: 25, hp: 100, cooldown: 30000, produce: 'mine',
        svg: '<svg viewBox="0 0 100 100" width="50" height="50"><ellipse cx="50" cy="60" rx="25" ry="20" fill="#8d6e63" stroke="#5d4037" stroke-width="3"/><circle cx="45" cy="55" r="3" fill="#333"/><circle cx="55" cy="55" r="3" fill="#333"/><path d="M50 65 Q45 70 50 72" stroke="#333" stroke-width="2" fill="none"/></svg>'
    }
};

// 僵尸类型配置
const zombieTypes = {
    normal: {
        hp: 100, speed: 0.35, damage: 10,
        svg: '<svg viewBox="0 0 100 100" width="50" height="50"><circle cx="50" cy="30" r="15" fill="#a5d6a7" stroke="#388e3c" stroke-width="2"/><rect x="35" y="45" width="30" height="35" fill="#5c6bc0" rx="5"/><rect x="30" y="50" width="8" height="25" fill="#8d6e63"/><rect x="62" y="50" width="8" height="25" fill="#8d6e63"/><circle cx="45" cy="28" r="2" fill="#d32f2f"/><circle cx="55" cy="28" r="2" fill="#d32f2f"/></svg>'
    },
    cone: {
        hp: 200, speed: 0.28, damage: 10,
        svg: '<svg viewBox="0 0 100 100" width="50" height="50"><polygon points="50,10 35,30 65,30" fill="#ff9800" stroke="#e65100" stroke-width="2"/><circle cx="50" cy="35" r="15" fill="#a5d6a7" stroke="#388e3c" stroke-width="2"/><rect x="35" y="50" width="30" height="35" fill="#5c6bc0" rx="5"/><rect x="30" y="55" width="8" height="25" fill="#8d6e63"/><rect x="62" y="55" width="8" height="25" fill="#8d6e63"/></svg>'
    },
    bucket: {
        hp: 350, speed: 0.21, damage: 15,
        svg: '<svg viewBox="0 0 100 100" width="50" height="50"><rect x="35" y="15" width="30" height="20" fill="#757575" stroke="#424242" stroke-width="2" rx="3"/><circle cx="50" cy="38" r="15" fill="#a5d6a7" stroke="#388e3c" stroke-width="2"/><rect x="35" y="53" width="30" height="35" fill="#5c6bc0" rx="5"/><rect x="30" y="58" width="8" height="25" fill="#8d6e63"/><rect x="62" y="58" width="8" height="25" fill="#8d6e63"/></svg>'
    }
};

// 界面切换
function switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screen + 'Screen').style.display = 'flex';
    game.state = screen;
}

// 显示僵尸警告
function showZombieAlert() {
    const alert = document.createElement('div');
    alert.className = 'zombie-alert';
    alert.textContent = '僵尸来了！！！';
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 2000);
}

// 初始化选卡界面
function initSelection() {
    const inventory = document.getElementById('plantInventory');
    inventory.innerHTML = '';
    Object.keys(plantTypes).forEach(key => {
        const plant = plantTypes[key];
        const card = document.createElement('div');
        card.className = 'inventory-card';
        card.dataset.plant = key;
        card.innerHTML = `
            <div class="card-img">${plant.svg}</div>
            <div class="card-info">${plant.name}<br>${plant.cost}</div>
        `;
        card.onclick = () => selectPlant(key, card);
        inventory.appendChild(card);
    });
    updateSlots();
}

// 选择植物
function selectPlant(key, card) {
    if (game.selectedSlots.includes(key)) {
        game.selectedSlots = game.selectedSlots.filter(p => p !== key);
        card.classList.remove('selected');
    } else if (game.selectedSlots.length < 6) {
        game.selectedSlots.push(key);
        card.classList.add('selected');
    }
    updateSlots();
}

// 更新槽位显示
function updateSlots() {
    const slots = document.getElementById('selectedSlots');
    slots.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        if (i < game.selectedSlots.length) {
            const key = game.selectedSlots[i];
            const plant = plantTypes[key];
            const card = document.createElement('div');
            card.className = 'slot-card';
            card.innerHTML = `
                <div class="card-img">${plant.svg}</div>
                <div class="card-info">${plant.name}<br>${plant.cost}</div>
            `;
            card.onclick = () => {
                game.selectedSlots.splice(i, 1);
                initSelection();
            };
            slots.appendChild(card);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'slot-placeholder';
            slots.appendChild(placeholder);
        }
    }
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
            cell.onclick = () => cellClick(row, col);
            board.appendChild(cell);
        }
    }
}

// 格子点击
function cellClick(row, col) {
    if (!game.running) return;

    if (game.shovelActive) {
        const plant = game.plants.find(p => p.row === row && p.col === col);
        if (plant) {
            plant.element.remove();
            game.plants = game.plants.filter(p => p !== plant);
        }
        game.shovelActive = false;
        document.getElementById('shovelBtn').classList.remove('active');
        return;
    }

    if (game.selectedPlant) {
        placePlant(row, col);
    }
}

// 初始化卡片栏
function initCards() {
    const container = document.getElementById('plantCards');
    container.innerHTML = '';
    game.selectedSlots.forEach(key => {
        const plant = plantTypes[key];
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.plant = key;
        card.innerHTML = `
            <div class="card-img">${plant.svg}</div>
            <div class="card-info">${plant.cost}</div>
            <div class="cd-mask"></div>
        `;
        card.onclick = () => selectCard(key, card);
        container.appendChild(card);
    });
}

// 选择卡片
function selectCard(key, card) {
    const plant = plantTypes[key];
    if (game.sun < plant.cost) return;
    if (game.plantCooldowns[key] && Date.now() < game.plantCooldowns[key]) return;

    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    game.selectedPlant = key;
}

// 放置植物
function placePlant(row, col) {
    const plantType = plantTypes[game.selectedPlant];
    if (game.sun < plantType.cost) return;
    if (game.plants.some(p => p.row === row && p.col === col)) return;

    game.sun -= plantType.cost;
    game.plantCooldowns[game.selectedPlant] = Date.now() + plantType.cooldown;
    updateSunDisplay();

    const plant = {
        type: game.selectedPlant,
        row, col,
        hp: plantType.hp,
        maxHp: plantType.hp,
        lastAction: Date.now(),
        element: createPlantElement(game.selectedPlant, row, col)
    };

    game.plants.push(plant);

    if (plantType.produce === 'explode') {
        setTimeout(() => explodeBomb(plant), 1000);
    } else if (plantType.produce === 'mine') {
        plant.armed = false;
        setTimeout(() => {
            plant.armed = true;
            plant.element.style.opacity = '1';
        }, 15000);
        plant.element.style.opacity = '0.5';
    }

    game.selectedPlant = null;
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
}

// 创建植物元素
function createPlantElement(type, row, col) {
    const plant = document.createElement('div');
    plant.className = 'plant';
    plant.innerHTML = `
        <div class="hp-bar"><div class="hp-fill"></div></div>
        ${plantTypes[type].svg}
    `;
    plant.style.top = `${row * 102 + 10}px`;
    plant.style.left = `${col * 72 + 10}px`;
    document.getElementById('gameBoard').appendChild(plant);
    return plant;
}

// 樱桃炸弹爆炸
function explodeBomb(bomb) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.top = `${bomb.row * 102 - 25}px`;
    explosion.style.left = `${bomb.col * 72 - 25}px`;
    document.getElementById('gameBoard').appendChild(explosion);

    game.zombies.forEach(z => {
        const dist = Math.sqrt(Math.pow(z.row - bomb.row, 2) + Math.pow((z.x - bomb.col * 72) / 72, 2));
        if (dist <= 1.5) {
            z.hp = 0;
            z.element.remove();
        }
    });
    game.zombies = game.zombies.filter(z => z.hp > 0);

    bomb.element.remove();
    game.plants = game.plants.filter(p => p !== bomb);
    setTimeout(() => explosion.remove(), 500);
}

// 生成僵尸
function spawnZombie(type, row) {
    const zombieType = zombieTypes[type];
    const zombie = {
        type, row,
        hp: zombieType.hp,
        maxHp: zombieType.hp,
        x: 650,
        baseSpeed: zombieType.speed,
        speed: zombieType.speed,
        damage: zombieType.damage,
        lastAttack: Date.now(),
        isFrozen: false,
        freezeTimer: 0,
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
        ${zombieTypes[type].svg}
    `;
    zombie.style.top = `${row * 102 + 10}px`;
    zombie.style.left = '650px';
    document.getElementById('gameBoard').appendChild(zombie);
    return zombie;
}

// 生成阳光
function spawnSun(x, y) {
    const sun = {
        x, y,
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
    sun.style.transition = 'top 2s ease-out';
    sun.onclick = () => collectSun(sun);
    document.getElementById('gameBoard').appendChild(sun);

    if (y === 0) {
        const finalY = Math.random() * 400 + 50;
        setTimeout(() => sun.style.top = `${finalY}px`, 50);
    }
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
function shootBullet(plant, isIce = false) {
    const bullet = {
        row: plant.row,
        x: plant.col * 72 + 60,
        isIce,
        element: createBulletElement(plant.row, plant.col * 72 + 60, isIce)
    };
    game.bullets.push(bullet);
}

// 创建子弹元素
function createBulletElement(row, x, isIce) {
    const bullet = document.createElement('div');
    bullet.className = isIce ? 'bullet ice-bullet' : 'bullet';
    bullet.style.top = `${row * 102 + 45}px`;
    bullet.style.left = `${x}px`;
    document.getElementById('gameBoard').appendChild(bullet);
    return bullet;
}

// 更新阳光显示
function updateSunDisplay() {
    document.getElementById('sunCount').textContent = game.sun;
    document.querySelectorAll('.card').forEach(card => {
        const key = card.dataset.plant;
        const cost = plantTypes[key].cost;
        const onCooldown = game.plantCooldowns[key] && Date.now() < game.plantCooldowns[key];
        card.classList.toggle('disabled', game.sun < cost || onCooldown);
    });
}

// 更新卡片冷却
function updateCardCooldowns() {
    document.querySelectorAll('.card').forEach(card => {
        const key = card.dataset.plant;
        const cooldownEnd = game.plantCooldowns[key];
        if (cooldownEnd && Date.now() < cooldownEnd) {
            const total = plantTypes[key].cooldown;
            const remaining = cooldownEnd - Date.now();
            const ratio = remaining / total;
            card.querySelector('.cd-mask').style.height = `${ratio * 100}%`;
        } else {
            card.querySelector('.cd-mask').style.height = '0%';
        }
    });
}

// 更新进度条
function updateProgress() {
    const progress = (game.gameTime / game.levelDuration) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
}

// 游戏循环
function gameLoop() {
    if (!game.running) return;

    const now = Date.now();
    game.gameTime = (now - game.startTime) / 1000;

    if (!game.firstZombieShown && game.gameTime >= 10) {
        showZombieAlert();
        game.firstZombieShown = true;
    }

    updateProgress();
    updateCardCooldowns();

    // 植物行动
    game.plants.forEach(plant => {
        const plantType = plantTypes[plant.type];
        if (now - plant.lastAction >= plantType.cooldown) {
            if (plantType.produce === 'sun') {
                spawnSun(plant.col * 72 + 20, plant.row * 102 + 20);
                plant.lastAction = now;
            } else if (plantType.produce === 'bullet' || plantType.produce === 'icebullet') {
                const hasZombieInRow = game.zombies.some(z => z.row === plant.row);
                if (hasZombieInRow) {
                    shootBullet(plant, plantType.produce === 'icebullet');
                    plant.lastAction = now;
                }
            }
        }

        // 土豆雷检测
        if (plantType.produce === 'mine' && plant.armed) {
            const zombie = game.zombies.find(z =>
                z.row === plant.row &&
                Math.abs(z.x - plant.col * 72) < 40
            );
            if (zombie) {
                explodeBomb(plant);
            }
        }
    });

    // 移动僵尸
    game.zombies.forEach(zombie => {
        if (zombie.isFrozen) {
            zombie.speed = zombie.baseSpeed * 0.5;
            zombie.freezeTimer--;
            if (zombie.freezeTimer <= 0) {
                zombie.isFrozen = false;
                zombie.speed = zombie.baseSpeed;
            }
        }

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

        const hitZombie = game.zombies.find(z =>
            z.row === bullet.row &&
            bullet.x >= z.x &&
            bullet.x <= z.x + 60
        );

        if (hitZombie) {
            hitZombie.hp -= 20;
            if (bullet.isIce) {
                hitZombie.isFrozen = true;
                hitZombie.freezeTimer = 180;
            }
            updateZombieHP(hitZombie);
            bullet.element.remove();
            game.bullets = game.bullets.filter(b => b !== bullet);

            if (hitZombie.hp <= 0) {
                hitZombie.element.remove();
                game.zombies = game.zombies.filter(z => z !== hitZombie);
            }
        } else if (bullet.x > 700) {
            bullet.element.remove();
            game.bullets = game.bullets.filter(b => b !== bullet);
        }
    });

    if (game.gameTime >= game.levelDuration && game.zombies.length === 0) {
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
    game.startTime = Date.now();
    game.gameTime = 0;
    game.firstZombieShown = false;
    game.plantCooldowns = {};

    updateProgress();
    spawnZombiesByTime();
    gameLoop();
}

// 基于时间的僵尸生成
function spawnZombiesByTime() {
    if (!game.running) return;

    const t = game.gameTime;
    const row = Math.floor(Math.random() * 5);
    let type = 'normal';
    let interval = 5000;

    if (t < 10) {
        setTimeout(spawnZombiesByTime, 1000);
        return;
    } else if (t < 60) {
        type = 'normal';
        interval = 15000;
    } else if (t < 120) {
        type = 'normal';
        interval = 8000;
    } else if (t < 180) {
        type = Math.random() < 0.6 ? 'normal' : 'cone';
        interval = 6000;
    } else if (t < 240) {
        const rand = Math.random();
        if (rand < 0.4) type = 'normal';
        else if (rand < 0.75) type = 'cone';
        else type = 'bucket';
        interval = 3000;
    } else {
        setTimeout(spawnZombiesByTime, 1000);
        return;
    }

    spawnZombie(type, row);
    setTimeout(spawnZombiesByTime, interval);
}

// 关卡完成
function levelComplete() {
    game.running = false;
    showModal('关卡完成！', `你完成了关卡 ${game.level}！`, '下一关', () => {
        game.level++;
        resetLevel();
        switchScreen('selection');
    });
}

// 游戏结束
function gameOver() {
    game.running = false;
    showModal('游戏结束', '僵尸吃掉了你的脑子！', '重新开始', () => {
        game.level = 1;
        resetLevel();
        switchScreen('selection');
    });
}

// 显示弹窗
function showModal(title, message, btnText, callback) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modalBtn').textContent = btnText;
    document.getElementById('modalBtn').onclick = () => {
        document.getElementById('resultModal').style.display = 'none';
        callback();
    };
    document.getElementById('resultModal').style.display = 'flex';
}

// 重置关卡
function resetLevel() {
    game.plants.forEach(p => p.element.remove());
    game.zombies.forEach(z => z.element.remove());
    game.bullets.forEach(b => b.element.remove());
    game.suns.forEach(s => s.element.remove());

    game.plants = [];
    game.zombies = [];
    game.bullets = [];
    game.suns = [];
    game.sun = 50;
    game.selectedPlant = null;
    game.shovelActive = false;
    game.plantCooldowns = {};
}

// 初始化
document.getElementById('startAdventureBtn').onclick = () => {
    switchScreen('selection');
    initSelection();
};

document.getElementById('letsRockBtn').onclick = () => {
    if (game.selectedSlots.length === 0) {
        alert('请至少选择一个植物！');
        return;
    }
    switchScreen('game');
    initBoard();
    initCards();
    document.getElementById('levelNum').textContent = game.level;
    updateSunDisplay();
    startLevel();
};

document.getElementById('shovelBtn').onclick = () => {
    game.shovelActive = !game.shovelActive;
    document.getElementById('shovelBtn').classList.toggle('active', game.shovelActive);
    if (game.shovelActive) {
        game.selectedPlant = null;
        document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    }
};

// 定期生成天降阳光
setInterval(() => {
    if (game.running) {
        const x = Math.random() * 600;
        spawnSun(x, 0);
    }
}, 5000);
