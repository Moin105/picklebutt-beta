const db = window.db;
const set = window.set;
const dataRef = window.dataRef;
const fetchDataAndDraw = window.fetchDataAndDraw;
const update = window.update;
const Top10 = window.fetchData;
var handle = sessionStorage.getItem('name');
// const fetchDataAndAssignTop10 = window.fetchDataAndAssignTop10;
const updateDatas = window.updateDatas;
// const updateData = window.updateData;
const basePath = './picklebutt-lander/';
let picklebutt;
let moon;
let water;
let picklebuttImage; let moonImage; let targetImage; let
  skyImage;
let picklebuttThrustAnimation; let picklebuttThrustOutAnimation; let
  cloudAnimation;
let cloudGroup;
let score = 0;
let lastScore = 0;
let lastCrashMessage = '';
let lastLandMessage = '';
let paused = true;
let gameOver = false;
let tooFastToLand = true;
let tooTiltedToLand = true;
let splashDown = false;
let picklebuttRotation = 270;


/*
  TODO:
  - Textures for explosion, sky, and water
*/

const crashMessages = [
  'Must be the $FREYA team...',
  'You\'re not very good at this...',
  'Wen moon?',
  'I thought number was supposed to go up?',
  'Blame the terrible physics',
  'Shoulda hired @ShillMoBaggins with the marketing budget',
  'Seriously, just pay some influencers to do it',
  'Wait till @TheCardanoTimes hears about this one',
  'Ahh the $HOSKY method - straight to zero.',
  'Maybe it\'s time to make a sacrifice to the $SNEK burn wallet?',
  'This is why we can\'t have nice things.',
  'We\'re gonna end up on an @ESCOxbt twitter space',
  'You do know how to fly this thing, right?',
  'Shoulda bought more $PICKLE',
  'Change the ticker before launch next time!',
  'I\'m sure those CocoLoco NFTs you\'re hodling will be worth something soon',
  'Time to open a support-ticket',
  'That wasn\'t a soft landing, Jerome Powell',
  'No one\'s gonna be your fren',
  'That was jarring...',
  'We\'re in a bit of a pickle',

];

const landMessages = [
  ['Valhalla at last!!!'],
  ['Picklebutt thanks u soljer!!'],
  ['Best pilot in the $PICKLE armada.'],
  ['This $PICKLE can\'t miss!'],
  ['Charles would be proud'],
  ['your did it @spacecoins_ADA'],
  ['I never doubted you, my pickle'],
  ['LFP!'],
  ['You pilot like a Dillionaire!'],
  ['Gigachad pickle soljerr'],
  ['All hail King Picklebutt III'],
  ['First memecoin on the moon!'],
  ['Big $SNEK energy'],
  ['@stockjupiterr would promote you for free!'],
  ['Is this what jenny welf feels like?'],
  ['You\'re a pretty big dill'],
  ['What a dill-light'],
  ['Don\'t forget to relish the moment!'],
  ['69'],
  ['Too easy for a pickle'],
  ['That one tickled my pickle'],
  ['OG Picklebutt on da moon'],
  ['Starting to run out of pickle puns, good job tho'],
  ['Where would Picklebutt go to buy a car? The dillership'],
  ['What do you call a genius pickle? A brine-iac'],
  ['Where\'s Picklebutt\'s favorite place to go in London? Pickle-dilly Square'],
  ['What do you say to Picklebutt in the morning? Rise and brine'],
  ['What does Picklebutt call it when he gets something at a cheap price? A sweet dill'],
  ['What does Picklebutt say when he walks into a casino? Dill me in'],
  ['What\'s Picklebutt\'s favorite musical instrument? A pickle-o'],
  ['Why is the pickle container always open? Because it\'s ajar'],
  ['Why does Picklebutt wear glasses? They\'re legally brined'],
  ['Who\'s Picklebutt\'s favorite artist? Salvador Dilli'],
  ['What does Picklebutt drive? A motorpickle'],
  ['If you\'re feeling generous, tip $dill-veloper'],

];

function getAssetList(assetName, count) {
  return Array(count).fill(undefined).map(
    (value, index) => `${basePath}assets/${assetName}_${(index + 1).toString().padStart(2, '0')}.png`,
  );
}

function preload() {
  picklebuttThrustAnimation = loadAnimation(...getAssetList('picklebutt_thrust', 10));
  picklebuttThrustAnimation.frameDelay = 3;
  picklebuttThrustOutAnimation = loadAnimation(...getAssetList('picklebutt_thrustout', 4));
  picklebuttThrustOutAnimation.looping = false;
  cloudAnimation = loadAnimation(...getAssetList('stars', 19));
  picklebuttImage = loadImage(`${basePath}assets/picklebutt_normal.png`);
  moonImage = loadImage(`${basePath}assets/moon_normal.png`);
  targetImage = loadImage(`${basePath}assets/target.png`);
  backgroundImage = loadImage(`${basePath}assets/background.png`)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  picklebutt = createSprite();
  picklebutt.maxSpeed = 10;
  picklebutt.friction = 0.01;
  picklebutt.mass = 10000;
  picklebutt.restitution = 0.5;
  picklebutt.setCollider('rectangle', 0, -36, 123, 44);
  picklebutt.addImage('normal', picklebuttImage);
  picklebutt.addAnimation('thrust', picklebuttThrustAnimation);

  moon = createSprite();
  moon.maxSpeed = 0;
  moon.setCollider('circle', 0, 0, 222);
  moon.addImage('normal', moonImage);
  moon.position.y = -height / 2.5;
  moon.position.x = 0;

  water = createSprite(0, 0, width * 2, height);
  water.setDefaultCollider();
  water.shapeColor = color(0, 0, 0);
  water.maxSpeed = 0;

  cloudGroup = new Group();
  while (cloudGroup.length < 100) {
    createCloud();
  }

  target = createSprite();
  target.addImage('normal', targetImage);
  target.visible = false;

  angleMode(DEGREES);

  goToSpace();
}

function createCloud() {
  const cloud = createSprite(random(width * 4) - width * 2, random(-height * 3) - height);
  cloud.addImage('normal', random(cloudAnimation.images));
  cloud.setSpeed(random(0.5), random([360, 180]));
  cloudGroup.add(cloud);
}

function goToSpace() {
  picklebutt.rotation = 270;
  picklebutt.position.y = -max(random(height * 3), height * 2);
  picklebutt.position.x = random(width * 2) - width;
}

function getpicklebuttRotation() {
  picklebuttRotation = (picklebutt.rotation % 360 + 360) % 360;
  picklebutt.collider.offset.x = cos(picklebuttRotation) * 36;
  picklebutt.collider.offset.y = sin(picklebuttRotation) * 36;
}

function drawGame() {

  background(backgroundImage);

  water.position.x = picklebutt.position.x;
  camera.position = picklebutt.position;

  drawSprites();


}

function drawHUD() {
  const isMoonCenterInView = (
    abs(camera.position.x) - width / 2 < moon.position.x
    && camera.position.y + height / 2 > moon.position.y
  );
  if (paused || isMoonCenterInView) {
    target.visible = false;
  } else {
    const indicatorY = camera.position.y + (height / 2) - 64;
    camera.position.x + width / 2;
    const indicatorX = constrain(
      camera.position.x + (moon.position.x - camera.position.x) * (indicatorY - camera.position.y)
      / (moon.position.y - camera.position.y),
      camera.position.x - width / 2 + 64,
      camera.position.x + width / 2 - 64,
    );
    target.position.y = indicatorY;
    target.position.x = indicatorX;
    target.visible = true;
  }
}




async function drawMessages() {
  if (paused) {
    // Message backdrop
    fill(color(7, 7, 7, 200));
    circle(camera.position.x, camera.position.y, pow(width, 10));
    textAlign(CENTER, CENTER);
    fill(255);
    textFont('Barlow');
    textSize(24);
    text(
      gameOver
        ? `Landing Streak: ${lastScore}`
        : score
          ? `Landing Streak: ${score}`
          : 'gm...',
      camera.position.x,
      camera.position.y - 48,
    );
    // Jumbo middle text
    textSize(48);
    textFont('Origin Gothic');
    text(
      gameOver
        ? 'GAME OVER'
        : score
          ? 'SUCCESS'
          : 'LAND PICKLEBUTT ON THE MOON',
      camera.position.x,
      camera.position.y,
    );
    // Bottom text message
    textFont('Barlow');
    textSize(24);
    text(
      gameOver
        ? lastCrashMessage
        : score
          ? lastLandMessage[0]
          : 'Controls: Arrow Keys / WASD',
      camera.position.x,
      camera.position.y + 48,
    );
    textSize(16);
    // Bottom text hint
    text(
      gameOver
        ? `Your picklebutt ${splashDown ? 'missed the moon lmao' : `${tooFastToLand ? 'hit the moon too fast' : ''
          }${tooFastToLand && tooTiltedToLand ? ' and ' : ''
          }${tooTiltedToLand ? 'fell over' : ''
          }`
        }`
        : score
          ? lastLandMessage[1]
          : '',
      camera.position.x,
      camera.position.y + 80,
    );

    if (gameOver) {
      
      for (let i = 0; i < fetchData?.length; i++) {
        text((i+1) + '. ' + fetchData[i].Name, camera.position.x - 100, camera.position.y + height / 2 - 280 + i * 20);
      }
      for (let i = 0; i < fetchData.length; i++) {
        text(fetchData[i].Score, camera.position.x + 100, camera.position.y + height / 2 - 280 + i * 20);
      }
    } 
    // Instruction text
    textAlign(LEFT, BOTTOM);
    
    text(
      `Press enter or space to ${gameOver ? 'try again' : score ? 'continue' : 'start'}`,
      camera.position.x,
      camera.position.y + height / 2 - 8,
    );
  }
}



function handlePause() {
  if (paused) {
    picklebutt.setVelocity(0, 0);
    picklebutt.changeAnimation('normal');
    if (mouseWentUp() || keyWentUp('space') || keyWentUp(ENTER)) {
      gameOver = false;
      paused = false;

      goToSpace();
    }

  }
}

async function handleTouchDown() {
  if (!paused) {
    const tilt = abs(270 - picklebuttRotation);
    const verticalSpeed = picklebutt.velocity.y;
    tooFastToLand = verticalSpeed >= 3;
    tooTiltedToLand = tilt >= 10;
    const touchDown = picklebutt.collide(moon);
    const test = picklebutt.getDirection();
    const test_moon = moon.getDirection();
    splashDown = picklebutt.collide(water);
    if (touchDown || splashDown) {
      if (splashDown || tooFastToLand || tooTiltedToLand) {
        lastCrashMessage = random(crashMessages);
        lastScore = score;
        score = 0;
        gameOver = true;
        const data = {
          Name: handle,
          Score: lastScore
        }
        // try {
        //   // await updateData(handle, data);
        //   await updateDatas(handle, data);
        //   //  fetchDataAndAssignTop10
        // } catch (error) {
        //   console.error("Error updating data or fetching top 10:", error);
        // }
        // console.log("data object",data)
        updateData(handle, data);
        //  console.log("data object",fetchData)
        //  Top10;
        //  drawOnCanvas(fetchData);
        // fetchData()
          
      } else {
        lastLandMessage = random(landMessages);
        lastScore = score;
        score += 1;
      }
      paused = true;
    }
  }
}

function handlePhysics() {
  if (!paused) {
    // Pseudo gravity
    picklebutt.attractionPoint(0.1, camera.position.x, water.position.y);
    // Random rotation that is more likely to occur if going fast and stronger if tilted
    if (random(10) < picklebutt.velocity.y) {
      const ispicklebuttTiltedLeft = picklebuttRotation > 90 && picklebuttRotation < 270;
      const rotationDiff = tooFastToLand && tooTiltedToLand ? 1 : 0.5;
      picklebutt.rotation = picklebuttRotation + (ispicklebuttTiltedLeft ? -rotationDiff : rotationDiff);
    }

  }
}

function handleControls() {
  if (!paused) {
    if (keyDown(LEFT_ARROW) || keyDown('a')) picklebutt.rotation -= 1;
    if (keyDown(RIGHT_ARROW) || keyDown('d')) picklebutt.rotation += 1;
    if (keyDown(UP_ARROW) || keyDown('w')) {
      picklebutt.addSpeed(0.2, picklebutt.rotation);
      picklebutt.changeAnimation('thrust');
    } else if (keyWentUp(UP_ARROW) || keyWentUp('w')) {
      picklebutt.addAnimation('thrustout', picklebuttThrustOutAnimation);
      picklebutt.changeAnimation('thrustout');
    } else if (picklebutt.getAnimationLabel() === 'thrustout' && picklebutt.animation.getFrame() === 3) {
      picklebutt.changeAnimation('normal');
    }
  } 
}

function draw() {
  drawHUD();
  drawGame();
  drawMessages();
  getpicklebuttRotation();
  handlePause();
  handleTouchDown();
  handlePhysics();
  handleControls();
}