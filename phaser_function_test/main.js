import Phaser from 'phaser'
import A_scene from './scenes/a_scene'


const user_config = {
    // funcs: import { button_show } from test_functions.js,
    type: Phaser.AUTO,
    scale: {
      parent: 'phaser-game',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1800,
      height: 1000,
      // test_funcs: require('test_functions'),

    },
    backgroundColor: "#99ff99",
    dom: {
        createContainer: true

    },
    scene: [A_scene],
};

var game = new Phaser.Game(user_config);
/////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', () => {
  // const game = new Phaser.Game(phaser_config)
  const randomString = (length) =>
    [...Array(length)].
      map(() => (~~(Math.random() * 36)).toString(36)).
      join('')
  let id =
    randomString(8)
    fullscreen_supported: document.fullscreenEnabled, // this is pretty important for us?
    debug: url_params.get('debug') !== null,
    version: 1,
    reference_angle: reference_angle;
  game.user_config = user_config // patch in to pass into game
})
