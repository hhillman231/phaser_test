function button_show(scene, testmode, ms, button) {
  if (testmode == true) { // any truthy value works
    console.log("testmode = true")
    button.visible = true;
  } else {
    console.log("testmode = false")
    console.log("ms = " + ms)
    scene.time.delayedCall(ms, function() { button.visible = true; });
  }
}
