import { Game as PhaserGame } from "phaser";

export class Game extends PhaserGame {

    get player() {
        const gameScene = this.scene.getScene("GameScene");
        return gameScene.player;
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