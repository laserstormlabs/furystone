import { Scene } from './Scene';

const DIALOG = {
    intro: [
        "Within this dungeon is a Fury Stone: an ancient, cursed relic that gives life to monsters. You must destroy it.",
        "The monsters will descend upon you when they sense your presence. Fend them off with your attacks, but do not let your Magic run too low, or you will be helpless.",
        "Potions will restore your Magic, so collect any you can find.",
        "Find the Fury Stone, and use your Magic to shatter it!"
    ],
    instructions: [
        "[ Move with arrow keys ]",
        "[ Press 'A' for light attack, 'S' for heavy attack ]",
        "[ Press 'Enter' to begin ]"
    ],
    win: "You have done well.",
    lose: {
        reasons: {
            out_of_magic: "Your magic is spent, and there are no potions left in the dungeon.",
            out_of_health: "The monsters have bested you.",
            out_of_time: "You can no longer withstand the Fury Stone's poisonous aura."
        },
        try_again: "You must rest, and try again when you are ready.",
        retry_instructions: "[ Press 'Enter' to retry ]"
    }
};

const PLAYER_HEALTH_BAR_WIDTH = 200;
const PLAYER_HEALTH_BAR_HEIGHT = 18;
const PLAYER_HEALTH_BAR_FILL_COLOR = 0xCC0000;
const PLAYER_HEALTH_BAR_VOID_COLOR = 0x000000;

const PLAYER_HEALTH_BAR_POSITION_X = 10;
const PLAYER_HEALTH_BAR_POSITION_Y = 10;

const PLAYER_MAGIC_BAR_WIDTH = 200;
const PLAYER_MAGIC_BAR_HEIGHT = 18;
const PLAYER_MAGIC_BAR_FILL_COLOR = 0x073ded;
const PLAYER_MAGIC_BAR_VOID_COLOR = 0x000000;

const PLAYER_MAGIC_BAR_POSITION_X = PLAYER_HEALTH_BAR_POSITION_X + 212;
const PLAYER_MAGIC_BAR_POSITION_Y = 10;

export class UIScene extends Scene {

    health_text;
    magic_text;
    seconds_remaining_text;
    health_bar;
    magic_bar;
    guidance_text_background;
    guidance_text;
    guidance_sprite;
    target_sprite;
    target_aura_sprite;
    target_chest_sprite;
    level_data;

    constructor() {
        super({ key: 'UIScene', active: true });
    }

    init() {
        this.level_data = this.game.registry.get("level_data");
    }

    preload() {
        this.load.spritesheet('guide_idle', 'game-assets/sprites/guide_idle.png', { frameWidth: 30, frameHeight: 40 });
        
        this.load.spritesheet('target_idle_guidance', 'game-assets/sprites/stone.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('target_aura_guidance', 'game-assets/sprites/effects/target_aura.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('target_chest_guidance', 'game-assets/sprites/chest_empty.png', { frameWidth: 48, frameHeight: 32 });
    }

    createMessageBackground() {
        let background = this.add.graphics();
        background.x = 0;
        background.y = 0;
        background.fillStyle(0x000000, .75);
        background.fillRect(0, 0, this.game.config.width, this.game.config.height);
        return background;
    }

    createPlayerHealthBar() {
        let background_bar = this.add.graphics();
        background_bar.x = PLAYER_HEALTH_BAR_POSITION_X - 2;
        background_bar.y = PLAYER_HEALTH_BAR_POSITION_Y - 2;
        background_bar.fillStyle(0xFFFFFF, 1);
        background_bar.fillRect(0, 0, PLAYER_HEALTH_BAR_WIDTH + 4, PLAYER_HEALTH_BAR_HEIGHT + 4);

        let bar = this.add.graphics();
        bar.x = PLAYER_HEALTH_BAR_POSITION_X;
        bar.y = PLAYER_HEALTH_BAR_POSITION_Y;

        this.add.text(
            PLAYER_HEALTH_BAR_POSITION_X + 10,
            PLAYER_HEALTH_BAR_POSITION_Y + 6,
            "HEALTH",
            {
                fontSize: '24px',
                fontFamily: 'Monogram',
                fill: '#FFF',
                align: 'center'
            }
        ).setOrigin(0, 0.5);

        return bar;
    }

    createPlayerMagicBar() {

        let background_bar = this.add.graphics();
        background_bar.x = PLAYER_MAGIC_BAR_POSITION_X - 2;
        background_bar.y = PLAYER_MAGIC_BAR_POSITION_Y - 2;
        background_bar.fillStyle(0xFFFFFF, 1);
        background_bar.fillRect(0, 0, PLAYER_MAGIC_BAR_WIDTH + 4, PLAYER_MAGIC_BAR_HEIGHT + 4);

        let bar = this.add.graphics();
        bar.x = PLAYER_MAGIC_BAR_POSITION_X;
        bar.y = PLAYER_MAGIC_BAR_POSITION_Y;

        this.add.text(
            PLAYER_MAGIC_BAR_POSITION_X + 10,
            PLAYER_MAGIC_BAR_POSITION_Y + 6,
            "MAGIC",
            {
                fontSize: '24px',
                fontFamily: 'Monogram',
                fill: '#FFF',
                align: 'center'
            }
        ).setOrigin(0, 0.5);

        return bar;
    }

    setPlayerMagicBarValue(magic_percentage) {

        this.setBarValue(
            this.magic_bar, 
            magic_percentage, 
            PLAYER_MAGIC_BAR_WIDTH, 
            PLAYER_MAGIC_BAR_HEIGHT, 
            PLAYER_MAGIC_BAR_FILL_COLOR, 
            PLAYER_MAGIC_BAR_VOID_COLOR
        );

    }

    setPlayerHealthBarValue(health_percentage) {

        this.setBarValue(
            this.health_bar, 
            health_percentage, 
            PLAYER_HEALTH_BAR_WIDTH, 
            PLAYER_HEALTH_BAR_HEIGHT, 
            PLAYER_HEALTH_BAR_FILL_COLOR, 
            PLAYER_HEALTH_BAR_VOID_COLOR
        );

    }

    create() {

        const gameScene = this.scene.get('GameScene');

        const GUIDANCE_SPRITE_POSITIONS = {
            intro: this.game.config.height/2 - 250,
            win: this.game.config.height/2 - 100,
            lose: this.game.config.height/2 - 150
        };

        this.anims.create({
            key: 'guide_idle',
            frames: this.anims.generateFrameNumbers('guide_idle', { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'target_idle_guidance',
            frames: this.anims.generateFrameNumbers('target_idle_guidance', { frames: [0, 1, 2, 3] }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'target_aura_guidance',
            frames: this.anims.generateFrameNumbers('target_aura_guidance', { start: 0, end: 18 }),
            frameRate: 19,
            repeat: -1
        });

        this.health_bar = this.createPlayerHealthBar();
        this.setPlayerHealthBarValue(1);

        this.magic_bar = this.createPlayerMagicBar();
        this.setPlayerMagicBarValue(1);

        if (this.level_data.time_allowed !== null) {
            this.seconds_remaining_text = this.add.text(
                this.game.config.width - 40, -3,
                this.level_data.time_allowed,
                { 
                    fontSize: '32px',
                    fontFamily: 'Monogram',
                    fill: '#FFF',
                    align: 'right'
                }
            );
        }

        this.guidance_text_background = this.createMessageBackground();
        this.guidance_text = this.add.text(
            this.game.config.width/2, 
            this.game.config.height/2,
            DIALOG.intro.join("\n\n") + "\n\n" + DIALOG.instructions.join("\n"),
            {
                fontSize: '24px',
                fontFamily: 'Monogram',
                fill: '#FFF',
                align: 'left',
                wordWrap: { width: this.game.config.width - 30, useAdvancedWrap: true }
            }
        ).setOrigin(0.5);

        this.guidance_sprite = this.physics.add.sprite(
            this.game.config.width/2, 
            GUIDANCE_SPRITE_POSITIONS.intro, 
            'guide_idle', 
            0
        ).setOrigin(.5)
        this.guidance_sprite.anims.play('guide_idle');

        this.target_chest_sprite = this.physics.add.sprite(
            this.game.config.width/2, 
            this.game.config.height - 100, 
            'target_chest_guidance', 
            0
        );

        this.target_aura_sprite = this.physics.add.sprite(
            this.game.config.width/2, 
            this.game.config.height - 125,
            'target_aura', 
            0
        );
        this.target_aura_sprite.anims.play("target_aura_guidance");

        this.target_sprite = this.physics.add.sprite(
            this.game.config.width/2, 
            this.game.config.height - 120,
            'target_idle_guidance', 
            1
        );
        this.target_sprite.anims.play("target_idle_guidance");

        gameScene.events.on("update_player_health", (new_value) => {
            this.setPlayerHealthBarValue(new_value);
        });

        gameScene.events.on("update_player_magic", (new_value) => {
            this.setPlayerMagicBarValue(new_value);
        });

        gameScene.events.on("update_seconds_remaining", (new_value) => {
            this.seconds_remaining_text.setText(new_value);
            if (new_value < 10) {
                this.seconds_remaining_text.setColor('#DD0000')
            }
        });

        gameScene.events.on("win_game", () => {
            this.guidance_sprite.setY(GUIDANCE_SPRITE_POSITIONS.win);
            this.showGuidance();
            this.guidance_text.setText(DIALOG.win);
        });

        gameScene.events.on("lose_game", (reason) => {
            let reason_message;

            if (typeof DIALOG.lose.reasons[reason] !== "undefined") {
                reason_message = DIALOG.lose.reasons[reason];
            } else {
                reason_message = "You lost for some reason??";
            }

            this.guidance_sprite.setY(GUIDANCE_SPRITE_POSITIONS.lose);
            this.showGuidance();
            this.guidance_text.setText(
                reason_message + "\n\n" + 
                DIALOG.lose.try_again + "\n\n" +
                DIALOG.lose.retry_instructions
            );
        });

        this.input.keyboard.on('keydown-ENTER', (event) => {
            const gameScene = this.scene.get('GameScene');

            if (!gameScene.game_has_started) {

                this.hideGuidance();
                this.target_sprite.destroy();
                this.target_aura_sprite.destroy();
                this.target_chest_sprite.destroy();
                this.events.emit('game_start');

            } else if (gameScene.game_is_over) {

                location.reload();

            }
        });

    }

    showGuidance() {
        this.guidance_text_background.setVisible(true);
        this.guidance_text.setVisible(true);
        this.guidance_sprite.setVisible(true);
    }

    hideGuidance() {
        this.guidance_text_background.setVisible(false);
        this.guidance_text.setVisible(false);
        this.guidance_sprite.setVisible(false);
    }

}