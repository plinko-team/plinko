let leftWall = new PIXI.Graphics()
leftWall.beginFill(0xff22aa)
leftWall.drawRect(0, 100, 5, 500)
leftWall.endFill()

let rightWall = new PIXI.Graphics()
leftWall.beginFill(0xff22aa)
leftWall.drawRect(795, 100, 5, 500)
leftWall.endFill()

let ground = new PIXI.Graphics()
ground.beginFill(0xff22aa)
ground.drawRect(0, 590, 800, 10)
ground.endFill()
stage = new PIXI.Container()

stage.addChild(leftWall, rightWall, ground)
renderer.render(stage);