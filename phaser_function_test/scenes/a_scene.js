// test function variables
let test_testmode = true
let test_ms = 2000

// function button_show(scene, testmode, ms, button) {
//   if (testmode == true) { // any truthy value works
//     console.log("testmode = true")
//     button.visible = true;
//   } else {
//     console.log("testmode = false")
//     console.log("ms = " + ms)
//     scene.time.delayedCall(ms, function() { button.visible = true; });
//   }
// }


//// visual variables:
var canvas_width = 1800; //window.innerWidth;
var canvas_height = 1000; //window.innerHeight;

//////////////////////////////////////////////////////
////////////////////// fullscreen ///////////////////////
//////////////////////////////////////////////////////
// var A_scene = new Phaser.Class({
    // Extends: Phaser.Scene,

export default class Ascene extends Phaser.Scene {
    initialize:
    function a_scene ()
    constructor() {
      super({ key: 'TitleScene' })
    }
    preload: function() {

      this.load.image('continue', 'images/continue_arrow.png');

    },
    create: function ()
    {
      //// formatting:
      this.cameras.main.setBounds(
        -config.scale.width / 2,
        -config.scale.height / 2,
        config.scale.width,
        config.scale.height);

      config.import { button_show } from test_functions.js;

      this.cameras.main.setBackgroundColor(0x000000);
      var edge_pad = 120;

      //// title:
      title_text = "Archery\nChallenge "
      var style = { fontFamily: 'title', fontSize: 60, color: "#ffcf00", align: 'center',
                    wordWrap: { width: canvas_width - edge_pad, useAdvancedWrap: true }, padding:20, lineSpacing: 28};
      title_location_y = -(canvas_height/2) + edge_pad
      text_title = this.add.text(0, title_location_y, title_text, style).setOrigin(0.5,0.5);
      text_title.setShadow(8, 8, "#d1431d", 2, true, true);

      //// body text:
      var page_text = "In a few moments an arrow will appear below. \n \n \n When you click the arrow, the browser will adjust to full screen. \n \n \n Please stay in full screen mode throughout the task! \n \n \n If you do not, the game will not be formatted correctly.";
      var style = { fontFamily: 'gameboy', fontSize: 30, fill: 'white', align: 'center',
                    wordWrap: { width: canvas_width - edge_pad, useAdvancedWrap: true }, padding:20, lineSpacing:9 };
      var textbox = this.add.text(0, 0, page_text, style).setOrigin(0.5,0.5);


      ////continue arrow:
      button_location_y = (canvas_height/2) - 100
      var button = this.add.image(0, button_location_y, 'continue', 0).setOrigin(0.5, 0.5).setInteractive();
      button.visible = false;

      console.log(test_testmode)
      // button_show(this, test_testmode, test_ms, button)

    }, // end of create
  update() {
  }
}); //end of


///////

import { median } from '../utils/medians'

// Do note that this ignores valid fractional refresh rates
// (e.g. my lab monitor reports 74.89 Hz, not 75), so we shouldn't rely on this
// for actual timing, only estimates (is it even worth guessing, then?)
const common_refresh_rates = [30, 60, 72, 75, 85, 90, 100, 120, 144, 240]

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' })
  }
  preload() {
    // load feedback images (check? x? sparks?)
    this.load.image('cursor', 'assets/cursor.png')
    this.load.image('mouse', 'assets/mouse.jpg')
    this.load.image('touchscreen', 'assets/touchscreen.jpg')
    this.load.image('trackball', 'assets/trackball.jpg')
    this.load.image('trackpad', 'assets/trackpad.jpg')
  }
  create() {
    let height = this.game.config.height
    let center = height / 2
    this.frame_times = Array(200).fill(0) // let's guess the frame rate

    this.i = 0

    let cb = (side) => {
      left.disableInteractive()
      right.disableInteractive()
      this.scale.startFullscreen()
      this.tweens.addCounter({
        from: 255,
        to: 0,
        duration: 2000,
        onUpdate: (t) => {
          let v = Math.floor(t.getValue())
          this.cameras.main.setAlpha(v / 255)
        },
        onComplete: () => {
          // grab frame times now, so we'll have at least ~2.5 sec of data
          let dts = this.frame_times.map((ele, idx, arr) => ele - arr[idx - 1]).slice(1)
          let est_rate = 1000 / median(dts)
          let nearest_rate = common_refresh_rates.sort((a, b) => Math.abs(est_rate - a) - Math.abs(est_rate - b))[0]
          if (!isFinite(est_rate)) {
            console.warn('Not enough time to guess a refresh rate, defaulting to 60 Hz.')
            est_rate = 60
            nearest_rate = 60
          }
          console.log(`median: ${est_rate}, nearest: ${nearest_rate}`)
          this.game.user_config['hand'] = side
          this.game.user_config['refresh_rate_est'] = est_rate
          this.game.user_config['refresh_rate_guess'] = nearest_rate
          // TODO: https://docs.google.com/document/d/17pvFMFqtAIx0ZA6zMZRU_A2-VnjhNX9QlN1Cgy-3Wdg/edit
          this.input.mouse.requestPointerLock()
          this.scene.start('MainScene')
        }
      })
    }

    this.add.rectangle(center - 6, center, 6, 500, 0xffffff)

    let left = this.add.
      text(center - 250, center, 'Click this side\nif using the mouse\nwith your left hand.', {
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 35,
        color: '#dddddd',
        stroke: '#444444',
        strokeThickness: 6,
        align: 'center'
      }).
      setOrigin(0.5, 0.5).
      setInteractive().
      once('pointerdown', () => {
        cb('left')
      })
    let right = this.add.
      text(center + 250, center, 'Click this side\nif using the mouse\nwith your right hand.', {
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 35,
        color: '#dddddd',
        stroke: '#444444',
        strokeThickness: 6,
        align: 'center'
      }).
      setOrigin(0.5, 0.5).
      setInteractive().
      once('pointerdown', () => {
        cb('right')
      })
  }
  update() {
    // this.game.loop.now should be rAF timestamp, if using my fork
    // otherwise it's a timestamp taken immediately after entering
    // the rAF callback, which introduces delay and jitter (sometimes up several ms in both cases),
    // and is lower resolution depending on the Spectre/Meltdown mitigations
    // in place on the particular browser
    this.frame_times[this.i] = this.game.loop.now
    this.i++
    this.i %= 200
  }
}
