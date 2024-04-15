import { Game as PhaserGame } from "phaser";

export class Game extends PhaserGame {

    text_objects = {};
    user_supplied_data = {};

    get player() {
        const gameScene = this.scene.getScene("GameScene");
        return gameScene.player;
    }

    get stone_destroyed() {
        const gameScene = this.scene.getScene("GameScene");
        return gameScene.target_is_hit;
    }

    get enemies() {
        const gameScene = this.scene.getScene("GameScene");
        return gameScene.enemies.children.entries;
    }

    get width() {
        return this.config.width;
    }

    get height() {
        return this.config.height;
    }

    set_data(key, value) {
        this.user_supplied_data[key] = value;
    }

    get_data(key) {
        return this.user_supplied_data[key];
    }

    add_text(key, x, y, content, size) {
        const uiScene = this.scene.getScene("UIScene");
        this.text_objects[key] = uiScene.add.text(x, y, content, { 
            fontSize: size + 'px',
            fontFamily: 'Monogram',
            fill: '#FFF'
        });
    }

    update_text(key, new_content) {
        this.text_objects[key].setText(new_content);
    }

    update_text_color(key, color) {
        this.text_objects[key].setColor(color);
    }

    update_magic_bar(new_value) {
        const uiScene = this.scene.getScene("UIScene");
        uiScene.setPlayerMagicBarValue(new_value/this.player.game_data.max_magic);
    }

    update_health_bar(new_value) {
        const uiScene = this.scene.getScene("UIScene");
        uiScene.setPlayerHealthBarValue(new_value/this.player.game_data.max_health);
    }

    win() {
        const gameScene = this.scene.getScene("GameScene");
        gameScene.winGame();
    }

    lose(reason) {
        const gameScene = this.scene.getScene("GameScene");
        gameScene.loseGame(reason);
    }

}