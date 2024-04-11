import { Scene } from 'phaser';
import { Player } from '../sprites/Player';

const ENEMY_PROPERTIES = {
    chomper_small: {
        body_size: {
            x: 22, y: 26
        },
        offset: {
            x: 5, y: 16
        },
        max_health: 10,
        movement_speed: 50,
        mass: 1,
        attack_damage: 5,
        attack_interval: 1000
    },
    skeleton: {
        body_size: {
            x: 14, y: 22
        },
        offset: {
            x: 3, y: 6
        },
        max_health: 10,
        movement_speed: 70,
        mass: .6,
        attack_damage: 3,
        attack_interval: 1000
    },
    axol_muddy: {
        body_size: {
            x: 28, y: 26
        },
        offset: {
            x: 2, y: 4
        },
        max_health: 5,
        movement_speed: 5,
        mass: 2,
        attack_damage: 10,
        attack_interval: 1000
    },
    zombie_large: {
        body_size: {
            x: 36, y: 46
        },
        offset: {
            x: 2, y: 14
        },
        max_health: 50,
        movement_speed: 20,
        mass: 1.5,
        attack_damage: 15,
        attack_interval: 1000
    },
    zombie_tiny: {
        body_size: {
            x: 18, y: 18
        },
        offset: {
            x: 2, y: 2
        },
        max_health: 10,
        movement_speed: 80,
        mass: .5,
        attack_damage: 5,
        attack_interval: 1000
    },
    demon_pig: {
        body_size: {
            x: 36, y: 46
        },
        offset: {
            x: 2, y: 14
        },
        max_health: 100,
        movement_speed: 40,
        mass: 2,
        attack_damage: 50,
        attack_interval: 1000
    }
};

const PLAYER_ATTACK_PROPERTIES = {
    light: {
        damage: 5,
        pushback: 250,
        range: 128,
        cost: 10,
        shake: .002,
        offset: {
            x: 0, y: 10
        }
    },
    heavy: {
        damage: 15,
        pushback: 600,
        range: 192,
        cost: 20,
        shake: .004,
        offset: {
            x: 0, y: 0
        }
    }
};

const POTION_PROPERTIES = {
    small: { value: 5 },
    large: { value: 15 }
}

const ENEMY_HEALTH_BAR_WIDTH = 50;
const ENEMY_HEALTH_BAR_HEIGHT = 5;
const ENEMY_HEALTH_BAR_FILL_COLOR = 0xCC0000;
const ENEMY_HEALTH_BAR_VOID_COLOR = 0x000000;

export class GameScene extends Scene {

    player;
    cursors;
    map;
    enemies;
    potions;
    seconds_remaining;
    timer_event = null;
    target = null;
    target_aura = null;
    target_chest = null;
    target_is_hit = false;
    player_gain_magic_sprite;
    player_lose_health_sprite;
    player_teleport_sprite;
    game_has_started = false;
    game_is_over = false;
    level_data;

    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.level_data = this.game.registry.get("level_data");
        this.utilities = this.game.registry.get("utilities");
    }

    preload() {
        this.load.image('tiles', 'game-assets/dungeon-tileset-light.png?1=3');
        this.load.tilemapCSV('map', 'game-assets/narrower-map.csv?1=5');

        this.load.spritesheet('player_run', 'game-assets/sprites/player/run.png', { frameWidth: 32, frameHeight: 38 });
        this.load.spritesheet('player_idle', 'game-assets/sprites/player/idle.png', { frameWidth: 32, frameHeight: 34 });
        this.load.spritesheet('player_attack', 'game-assets/sprites/player/attack.png?1=1', { frameWidth: 34, frameHeight: 52 });

        this.load.spritesheet('player_attack_light', 'game-assets/sprites/effects/player_attack_light.png?1=4', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player_attack_heavy', 'game-assets/sprites/effects/player_attack_heavy.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('player_teleport', 'game-assets/sprites/effects/player_teleport.png', { frameWidth: 56, frameHeight: 56 });
        this.load.spritesheet('player_gain_magic', 'game-assets/sprites/effects/player_gain_magic.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player_lose_health', 'game-assets/sprites/effects/player_lose_health.png?1=1', { frameWidth: 64, frameHeight: 64 });

        this.load.spritesheet('enemy_death_effect', 'game-assets/sprites/effects/enemy_death.png?1=1', { frameWidth: 64, frameHeight: 64 });

        this.load.spritesheet('potion_blue_large', 'game-assets/sprites/potions/blue_large.png?1=1', { frameWidth: 20, frameHeight: 22 });
        this.load.spritesheet('potion_blue_small', 'game-assets/sprites/potions/blue_small.png', { frameWidth: 16, frameHeight: 22 });

        this.load.spritesheet('chomper_small_run', 'game-assets/sprites/enemies/chomper_small_run.png', { frameWidth: 32, frameHeight: 46 });
        this.load.spritesheet('chomper_small_idle', 'game-assets/sprites/enemies/chomper_small_idle.png', { frameWidth: 32, frameHeight: 46 });

        this.load.spritesheet('zombie_large_run', 'game-assets/sprites/enemies/zombie_large_run.png', { frameWidth: 40, frameHeight: 66 });
        this.load.spritesheet('zombie_large_idle', 'game-assets/sprites/enemies/zombie_large_idle.png', { frameWidth: 40, frameHeight: 54 });
        
        this.load.spritesheet('zombie_tiny_run', 'game-assets/sprites/enemies/zombie_tiny_run.png', { frameWidth: 22, frameHeight: 24 });
        this.load.spritesheet('zombie_tiny_idle', 'game-assets/sprites/enemies/zombie_tiny_idle.png', { frameWidth: 18, frameHeight: 20 });

        this.load.spritesheet('axol_muddy_run', 'game-assets/sprites/enemies/axol_muddy.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('axol_muddy_idle', 'game-assets/sprites/enemies/axol_muddy.png', { frameWidth: 32, frameHeight: 32 });
        
        this.load.spritesheet('demon_pig_run', 'game-assets/sprites/enemies/demon_pig_run.png', { frameWidth: 46, frameHeight: 68 });
        this.load.spritesheet('demon_pig_idle', 'game-assets/sprites/enemies/demon_pig_idle.png?1=1', { frameWidth: 52, frameHeight: 62 });

        this.load.spritesheet('skeleton_run', 'game-assets/sprites/enemies/skeleton_run.png', { frameWidth: 20, frameHeight: 32 });
        this.load.spritesheet('skeleton_idle', 'game-assets/sprites/enemies/skeleton_idle.png', { frameWidth: 20, frameHeight: 28 });
        
        this.load.spritesheet('target_idle', 'game-assets/sprites/stone.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('target_aura', 'game-assets/sprites/effects/target_aura.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('target_chest', 'game-assets/sprites/chest_empty.png', { frameWidth: 48, frameHeight: 32 });
        this.load.spritesheet('target_destruction', 'game-assets/sprites/effects/target_destruction.png', { frameWidth: 256, frameHeight: 256 });
    }

    create() {

        const uiScene = this.scene.get('UIScene');

        this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        const tileset = this.map.addTilesetImage('tiles');
        const layer = this.map.createLayer(0, tileset, 0, 0);

        this.map.setCollision([
            7, 27, 47, 
            76, 19, 39, 69, 59,
            67, 87, 89
        ]);

        this.anims.create({
            key: 'player_run',
            frames: this.anims.generateFrameNumbers('player_run', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('player_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player_attack',
            frames: this.anims.generateFrameNumbers('player_attack', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player_attack_light',
            frames: this.anims.generateFrameNumbers('player_attack_light', { start: 0, end: 18 }),
            frameRate: 38,
            repeat: 0
        });
        this.anims.create({
            key: 'player_attack_heavy',
            frames: this.anims.generateFrameNumbers('player_attack_heavy', { start: 0, end: 24 }),
            frameRate: 50,
            repeat: 0
        });
        this.anims.create({
            key: 'player_teleport',
            frames: this.anims.generateFrameNumbers('player_teleport', { start: 0, end: 18 }),
            frameRate: 38,
            repeat: 0
        });
        this.anims.create({
            key: 'player_gain_magic',
            frames: this.anims.generateFrameNumbers('player_gain_magic', { start: 0, end: 20 }),
            frameRate: 42,
            repeat: 0
        });
        this.anims.create({
            key: 'player_lose_health',
            frames: this.anims.generateFrameNumbers('player_lose_health', { start: 0, end: 20 }),
            frameRate: 42,
            repeat: 0
        });

        this.anims.create({
            key: 'enemy_death_effect',
            frames: this.anims.generateFrameNumbers('enemy_death_effect', { start: 0, end: 21 }),
            frameRate: 29,
            repeat: 0
        });

        this.anims.create({
            key: 'potion_blue_large',
            frames: this.anims.generateFrameNumbers('potion_blue_large', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'potion_blue_small',
            frames: this.anims.generateFrameNumbers('potion_blue_small', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'chomper_small_run',
            frames: this.anims.generateFrameNumbers('chomper_small_run', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'chomper_small_idle',
            frames: this.anims.generateFrameNumbers('chomper_small_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'chomper_small_death',
            frames: this.anims.generateFrameNumbers('chomper_small_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'zombie_large_run',
            frames: this.anims.generateFrameNumbers('zombie_large_run', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie_large_idle',
            frames: this.anims.generateFrameNumbers('zombie_large_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie_large_death',
            frames: this.anims.generateFrameNumbers('zombie_large_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'zombie_tiny_run',
            frames: this.anims.generateFrameNumbers('zombie_tiny_run', { frames: [0, 1, 2, 3] }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie_tiny_idle',
            frames: this.anims.generateFrameNumbers('zombie_tiny_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie_tiny_death',
            frames: this.anims.generateFrameNumbers('zombie_tiny_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'demon_pig_run',
            frames: this.anims.generateFrameNumbers('demon_pig_run', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'demon_pig_idle',
            frames: this.anims.generateFrameNumbers('demon_pig_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'demon_pig_death',
            frames: this.anims.generateFrameNumbers('demon_pig_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'axol_muddy_run',
            frames: this.anims.generateFrameNumbers('axol_muddy_run', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'axol_muddy_idle',
            frames: this.anims.generateFrameNumbers('axol_muddy_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'axol_muddy_death',
            frames: this.anims.generateFrameNumbers('axol_muddy_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'skeleton_run',
            frames: this.anims.generateFrameNumbers('skeleton_run', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'skeleton_idle',
            frames: this.anims.generateFrameNumbers('skeleton_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'skeleton_death',
            frames: this.anims.generateFrameNumbers('skeleton_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'target_idle',
            frames: this.anims.generateFrameNumbers('target_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'target_aura',
            frames: this.anims.generateFrameNumbers('target_aura', { start: 0, end: 18 }),
            frameRate: 19,
            repeat: -1
        });
        this.anims.create({
            key: 'target_destruction',
            frames: this.anims.generateFrameNumbers('target_destruction', { start: 0, end: 18 }),
            frameRate: 19,
            repeat: 0
        });

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

        this.potions = this.physics.add.group();

        if (this.level_data.potions.length > 0) {

            for (let potion_data of this.level_data.potions) {

                let sprite_name = "potion_blue_" + potion_data.size;

                let potion = this.potions.create(
                    potion_data.position.x, 
                    potion_data.position.y, 
                    sprite_name, 
                    1
                );
                potion.anims.play(sprite_name, true);
                potion.game_data = {
                    value: POTION_PROPERTIES[potion_data.size].value
                }

            }

        }

        if (this.level_data.target_location !== null) {

            this.target_chest = this.physics.add.sprite(
                this.level_data.target_location.x, 
                this.level_data.target_location.y + 20, 
                'target_chest', 
                0
            ).setImmovable();

            this.target_aura = this.physics.add.sprite(
                this.level_data.target_location.x, 
                this.level_data.target_location.y - 5, 
                'target_aura', 
                0
            ).setPushable(false);
            this.target_aura.name = "target_aura";
            this.target_aura.anims.play("target_aura");
        }

        this.player = new Player({
            scene: this, 
            x: 50,
            y: 100
        });
        this.player.setPushable(false);
        this.player.game_data = {
            max_health: 50,
            current_health: 50,
            max_magic: 100,
            current_magic: 100,
            last_horizontal_direction: 'right'
        }
        this.player.name = "player";
        this.player.setBodySize(26, 28);
        this.player.setOffset(3, 7);
        this.player.setActive(false).setVisible(false);

        this.physics.add.overlap(this.player, layer);
        this.physics.add.overlap(this.player, this.potions, this.playerCollectsPotion, null, this);

        this.player_gain_magic_sprite = this.physics.add.sprite(0, 0, 'player_gain_magic', 1)
            .setVisible(false);

        this.positionPlayerPowerEffectSprite(this.player, this.player_gain_magic_sprite);

        this.player_gain_magic_sprite.on('animationcomplete', () => {
            this.player_gain_magic_sprite.setVisible(false);
        });

        this.player_lose_health_sprite = this.physics.add.sprite(0, 0, 'player_lose_health', 1)
            .setVisible(false);

        this.positionPlayerPowerEffectSprite(this.player, this.player_lose_health_sprite);

        this.player_lose_health_sprite.on('animationcomplete', () => {
            this.player_lose_health_sprite.setVisible(false);
        });

        this.player_teleport_sprite = this.physics.add.sprite(
            this.player.body.x + 16, 
            this.player.body.y + 10, 
            'player_teleport', 
            1
        ).setVisible(false);
        this.player_teleport_sprite.on('animationcomplete', () => {
            this.player_teleport_sprite.setVisible(false);
        });

        if (this.level_data.target_location !== null) {

            this.target = this.physics.add.sprite(
                this.level_data.target_location.x, 
                this.level_data.target_location.y, 
                'target_idle', 
                0
            ).setPushable(false);
            this.target.name = "target";
            this.target.anims.play("target_idle");

            //this.physics.add.collider(this.player, this.target);
            this.physics.add.collider(this.player, this.target_chest);

        }

        this.enemies = this.physics.add.group();

        if (this.level_data.enemies.length > 0) {

            for (let enemy_data of this.level_data.enemies) {

                const this_enemy_properties = ENEMY_PROPERTIES[enemy_data.type];

                let enemy = this.enemies.create(
                    enemy_data.position.x, 
                    enemy_data.position.y, 
                    enemy_data.type + '_idle',
                    1
                );
                enemy.anims.play(enemy_data.type + '_idle', true);
                enemy.game_data = {
                    max_health: this_enemy_properties.max_health,
                    current_health: this_enemy_properties.max_health,
                    damaged_by_current_attack: false,
                    last_attack_time: null,
                    is_touching_player: false,
                    is_within_range_of_player: false,
                    movement_speed: this_enemy_properties.movement_speed,
                    attack_interval: this_enemy_properties.attack_interval,
                    attack_damage: this_enemy_properties.attack_damage,
                    is_dying: false
                }
                enemy.name = enemy_data.type;
                enemy.setPushable(false);
                enemy.setBodySize(this_enemy_properties.body_size.x, this_enemy_properties.body_size.y);
                enemy.setOffset(this_enemy_properties.offset.x, this_enemy_properties.offset.y);

                enemy.game_data.health_bar = this.createEnemyHealthBar();
                this.positionEnemyHealthBar(enemy, enemy.game_data.health_bar);

                this.physics.add.collider(enemy, layer);
            }
        }

        this.physics.add.collider(this.player, layer);

        this.physics.add.collider(this.player, this.enemies, this.enemyContactsPlayer, null, this);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        /*this.input.on('pointermove', pointer => {
            this.cameras.main.centerOnX(pointer.position.x);
            this.cameras.main.centerOnY(pointer.position.y);
        })*/

        this.cursors = this.input.keyboard.createCursorKeys();

        uiScene.events.on("game_start", () => {

            if (this.game_has_started) {
                return;
            }
            this.game_has_started = true;
            
            if (this.level_data.time_allowed !== null) {

                this.seconds_remaining = this.level_data.time_allowed;
    
                this.timer_event = this.time.addEvent({
                    delay: 1000,
                    callback: this.updateTimer,
                    callbackScope: this,
                    loop: true
                });
            }

            this.player_teleport_sprite.setVisible(true);
            this.player_teleport_sprite.anims.play("player_teleport");
            this.player.setActive(true).setVisible(true);

            this.input.keyboard.on('keydown-A', (event) => {
                if (this.player.game_data.is_attacking
                || this.player.game_data.current_magic === 0) {
                    return;
                }
    
                this.startPlayerAttack("light");
    
            });
    
            this.input.keyboard.on('keydown-S', (event) => {
                if (this.player.game_data.is_attacking
                || this.player.game_data.current_magic === 0) {
                    return;
                }
    
                this.startPlayerAttack("heavy");
    
            });

        });
    }

    startPlayerAttack(type) {

        const attack_properties = PLAYER_ATTACK_PROPERTIES[type];

        this.attack_sprite = this.physics.add.sprite(
            this.player.body.x + 16 + attack_properties.offset.x, 
            this.player.body.y + attack_properties.offset.y, 
            'player_attack_' + type, 
            1
        ).setImmovable();

        this.attack_sprite.name = type;
        this.attack_sprite.anims.play('player_attack_' + type, true);
        this.attack_sprite.setBodySize(
            attack_properties.range, 
            attack_properties.range, 
            true
        );

        if (this.player.game_data.last_horizontal_direction === "left") {
            this.attack_sprite.flipX = true;
        }

        this.physics.add.overlap(this.attack_sprite, this.enemies, this.enemyGetsAttacked, null, this);
        
        if (this.target !== null) {
            this.physics.add.overlap(this.attack_sprite, this.target, this.targetGetsAttacked, null, this);
        }

        let attack_length = 500;
        this.player.anims.play('player_attack', true);
        this.cameras.main.shake(attack_length, attack_properties.shake);
        this.player.game_data.attack_time_remaining = attack_length;
        this.player.game_data.is_attacking = true;

        this.player.decrease_magic(attack_properties.cost);

        this.events.emit('update_player_magic', this.player.get_magic_percentage());
    }

    update(time, delta) {

        if (this.game_is_over || !this.game_has_started) {
            return;
        }

        this.player.body.setVelocity(0);
        this.positionPlayerPowerEffectSprite(this.player, this.player_gain_magic_sprite);
        this.positionPlayerPowerEffectSprite(this.player, this.player_lose_health_sprite);

        if (this.player.game_data.attack_time_remaining > 0) {
            this.player.game_data.attack_time_remaining -= delta;
            if (this.player.game_data.attack_time_remaining <= 0) {
                this.player.game_data.attack_time_remaining = 0;
                this.player.game_data.is_attacking = false;
                this.attack_sprite.destroy();
                this.enemies.children.each((enemy) => {
                    enemy.game_data.damaged_by_current_attack = false;
                });

                if (!this.target_is_hit && this.player.game_data.current_magic === 0) {
                    let remaining_potion_count = this.potions.countActive();
                    if (remaining_potion_count === 0) {
                        this.loseGame("out_of_magic");
                    }
                }

            }
        }

        if (!this.player.game_data.is_attacking && !this.game_is_over) {

            let horizontalCursorDown = this.cursors.left.isDown || this.cursors.right.isDown;
            let verticalCursorDown = this.cursors.up.isDown || this.cursors.down.isDown;

            if (horizontalCursorDown || verticalCursorDown) {
                this.player.anims.play('player_run', true);
            } else {
                this.player.anims.play('player_idle', true);
            }

            if (this.cursors.left.isDown) {
                this.player.flipX = true;
                this.player.body.setVelocityX(-100);
                this.player.game_data.last_horizontal_direction = 'left';
            }
            else if (this.cursors.right.isDown) {
                this.player.flipX = false;
                this.player.body.setVelocityX(100);
                this.player.game_data.last_horizontal_direction = 'right';
            }

            if (this.cursors.up.isDown) {
                this.player.body.setVelocityY(-100);
            }
            else if (this.cursors.down.isDown) {
                this.player.body.setVelocityY(100);
            }
        }
        
        this.enemies.children.each((enemy) => {

            this.positionEnemyHealthBar(enemy, enemy.game_data.health_bar);

            if (enemy.game_data.damaged_by_current_attack) {
                return;
            }

            if (enemy.body.velocity.x < 0) {
                enemy.flipX = true;
            } else if (enemy.body.velocity.x > 0) {
                enemy.flipX = false;
            }

            if (enemy.body.touching.none && !enemy.body.embedded) {
                enemy.game_data.is_touching_player = false;
            }

            if (enemy.game_data.current_health === 0) {

                if (!enemy.game_data.is_dying) {
                    enemy.game_data.is_dying = true;
                    enemy.anims.play(enemy.name + '_death', true);
                    enemy.body.setVelocity(0);
                    setTimeout(() => {
                        this.enemyDies(enemy);
                    }, 1000);
                }
                
            } else if (!enemy.game_data.is_touching_player) {

                let distance_from_player_x = this.player.body.x - enemy.body.x;
                let distance_from_player_y = this.player.body.y - enemy.body.y;

                let absolute_distance_from_player = Math.sqrt(
                    distance_from_player_x ** 2 + distance_from_player_y ** 2
                );

                if (absolute_distance_from_player < 300 && !this.game_is_over) {

                    if (!enemy.game_data.is_within_range_of_player) {
                        enemy.game_data.is_within_range_of_player = true;
                        enemy.anims.play(enemy.name + '_run', true);
                    }

                    this.physics.moveTo(
                        enemy, 
                        this.player.body.x, 
                        this.player.body.y, 
                        enemy.game_data.movement_speed
                    );

                } else {

                    if (enemy.game_data.is_within_range_of_player) {
                        enemy.game_data.is_within_range_of_player = false;
                        enemy.anims.play(enemy.name + '_idle', true);
                        enemy.body.setVelocity(0);
                    }

                }
            }

        });
    }

    updateTimer() {
        this.seconds_remaining -= 1;
        this.events.emit("update_seconds_remaining", this.seconds_remaining);
        if (this.seconds_remaining == 0) {
            this.events.emit("update_player_health", 0);
            this.loseGame("out_of_time");
        }   
    }

    endGame() {
        if (this.timer_event !== null) {
            this.timer_event.remove(); 
        }
        this.game_is_over = true;
    }

    winGame() {

        this.endGame();

        this.enemies.children.each((enemy) => {
            enemy.body.setVelocity(0);
            enemy.game_data.current_health = 0;
            enemy.game_data.is_dying = true;
            this.enemyDies(enemy);
        });

        this.player.anims.play("player_idle", true);
        this.player.body.setVelocity(0);

        setTimeout(() => {
            this.events.emit("win_game");
        }, 1000);

    }

    loseGame(reason) {

        this.endGame();

        this.enemies.children.each((enemy) => {
            enemy.body.setVelocity(0);
            enemy.anims.play(enemy.name + "_idle");
        });

        this.player_teleport_sprite.body.x = this.player.body.x - 16;
        this.player_teleport_sprite.body.y = this.player.body.y - 16;
        this.player_teleport_sprite.setVisible(true);
        this.player_teleport_sprite.anims.play('player_teleport', true);

        this.player.setVisible(false);

        setTimeout(() => {
            this.events.emit("lose_game", reason);
        }, 1000);

    }

    createEnemyHealthBar() {
        let bar = this.add.graphics();
        this.setEnemyHealthBarValue(bar, 1);
        return bar;
    }

    setEnemyHealthBarValue(bar, health_percentage) {

        this.utilities.setBarValue(
            bar, 
            health_percentage, 
            ENEMY_HEALTH_BAR_WIDTH, 
            ENEMY_HEALTH_BAR_HEIGHT, 
            ENEMY_HEALTH_BAR_FILL_COLOR, 
            ENEMY_HEALTH_BAR_VOID_COLOR
        );

    }

    positionEnemyHealthBar(enemy, bar) {
        bar.x = enemy.x - ENEMY_HEALTH_BAR_WIDTH/2;
        bar.y = enemy.y - enemy.body.height/2 - 10;
    }

    positionPlayerPowerEffectSprite(player, sprite) {
        sprite.body.x = player.body.x - 16;
        sprite.body.y = player.body.y - 16;
    }

    enemyContactsPlayer(player, enemy) {

        if (this.game_is_over || enemy.game_data.current_health === 0) {
            return;
        }

        const now = new Date().getTime();
        let enemy_can_attack_now = false;

        if (!enemy.game_data.is_touching_player) {
            enemy.game_data.is_touching_player = true;
        }

        if (enemy.game_data.last_attack_time === null) {
            enemy_can_attack_now = true;
        }

        let time_since_last_enemy_attack = now - enemy.game_data.last_attack_time;
        if (time_since_last_enemy_attack >= enemy.game_data.attack_interval) {
            enemy_can_attack_now = true;
        }

        if (this.player.game_data.current_magic > 0
        && !enemy.game_data.damaged_by_current_attack
        && enemy_can_attack_now) {
            enemy.game_data.last_attack_time = now;
            this.player.game_data.current_health = Math.max(
                this.player.game_data.current_health - enemy.game_data.attack_damage,
                0
            );

            this.player_lose_health_sprite.setVisible(true);
            this.player_lose_health_sprite.anims.play("player_lose_health");

            if (this.player.game_data.current_health > 0) {
                let new_health_percentage = this.player.game_data.current_health/this.player.game_data.max_health;
                this.events.emit("update_player_health", new_health_percentage);
            } else {
                this.events.emit("update_player_health", 0);
                this.loseGame("out_of_health");
            }
        }
        
        /*if (typeof game_callbacks.enemy_contacts_player !== "undefined") {
            game_callbacks.enemy_contacts_player(player, enemy);
        }*/
        
    }

    enemyGetsAttacked(attack, enemy) {

        if (enemy.game_data.damaged_by_current_attack || this.game_is_over) {
            return;
        }

        const this_enemy_properties = ENEMY_PROPERTIES[enemy.name];

        let damage = PLAYER_ATTACK_PROPERTIES[attack.name].damage;
        let pushback = PLAYER_ATTACK_PROPERTIES[attack.name].pushback;

        enemy.game_data.damaged_by_current_attack = true;
        enemy.game_data.current_health = Math.max(
            enemy.game_data.current_health - damage, 0
        );

        this.setEnemyHealthBarValue(
            enemy.game_data.health_bar,
            enemy.game_data.current_health/enemy.game_data.max_health
        );

        let enemy_x_distance = enemy.body.x - this.player.body.x;
        let enemy_y_distance = enemy.body.y - this.player.body.y;

        let distance_absolute_sum = 
            Math.abs(enemy_x_distance) + Math.abs(enemy_y_distance);

        enemy.body.setVelocity(
            (enemy_x_distance/distance_absolute_sum) * pushback/this_enemy_properties.mass, 
            (enemy_y_distance/distance_absolute_sum) * pushback/this_enemy_properties.mass
        );

    }

    targetGetsAttacked(attack, target) {

        this.target_is_hit = true;

        let destruction_effect = this.physics.add.sprite(
            target.x + 10,
            target.y,
            'target_destruction', 
            0
        );

        destruction_effect.anims.play('target_destruction', true);

        destruction_effect.on('animationcomplete', () => {
            destruction_effect.destroy();
        });

        target.destroy();
        this.target_aura.destroy();

        this.winGame();

    }

    enemyDies(enemy) {

        let death_effect = this.physics.add.sprite(
            enemy.x,
            enemy.y,
            'enemy_death_effect', 
            0
        ).setImmovable();

        death_effect.anims.play('enemy_death_effect', true);

        enemy.game_data.health_bar.destroy();
        enemy.destroy();

        death_effect.on('animationcomplete', () => {
            death_effect.destroy();
        });

    }

    playerCollectsPotion(player, potion) {

        if (this.game_is_over || player.game_data.current_magic === player.game_data.max_magic) {
            return;
        }

        player.increase_magic(potion.game_data.value);

        this.events.emit("update_player_magic", player.get_magic_percentage());
        potion.destroy();

        this.player_gain_magic_sprite.setVisible(true);
        this.player_gain_magic_sprite.anims.play("player_gain_magic");

    }
}