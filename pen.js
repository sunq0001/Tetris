
const Enum = {
  TILE: 25,
  SCREENWIDTH: 400,
  SCREENHEIGHT: 500,
  BIGSCREENWIDTH: 600,
  BIGSCREENHEIGHT: 600
};

const xTileNum = Enum.SCREENWIDTH / Enum.TILE;
const yTileNum = Enum.SCREENHEIGHT / Enum.TILE;
const levelScore = 10;

window.onload = function () {
  var paper = new Raphael(document.getElementById('div1'), Enum.BIGSCREENWIDTH, Enum.BIGSCREENHEIGHT);
  for (let i = 0; i < yTileNum; i++) {
    for (let j = 0; j < xTileNum; j++) {
      paper.rect(j * Enum.TILE, i * Enum.TILE, Enum.TILE, Enum.TILE, 5).attr({ fill: 'gray', stroke: 'white', 'stroke-width': 2, 'fill-opacity': 0.8 }).toBack();
      //paper.text(j * Enum.TILE + Enum.TILE / 2, i * Enum.TILE + Enum.TILE / 2, 0).attr({'font-size':'15px',stroke:'white'}).toFront();
    }
  }

  var fontAttr = {
    'font-size': 20,
    'font-family': 'Broadway',
    'font-weight': 'bold',
    'fill': 'darkBlue',
  }

  var fontAttrLevel = {
    'font-size': 36,
    'font-family': 'Elephant',
    'font-weight': 500,
    'fill': 'DarkMagenta',
  }

  var fontAttrBegin = {
    'font-size': 28,
    'font-family': 'Aharoni',
    'font-weight': 200,
    'fill': 'white',
  }

  var animScale = Raphael.animation({
    '25%': { transform: 'r-30s0.8t8,0' },
    '50%': { transform: 'r30s1.2t-8,0' },
    '75%': { transform: '' }
  }, 1000);

  var totalDelLayers = paper.text(485, 180, 'Layers: 0').attr(fontAttr);
  var totalScore = paper.text(485, 230, 'Score: 0').attr(fontAttr);
  var layersDel = paper.text(Enum.SCREENWIDTH / 2, Enum.SCREENHEIGHT / 2, '').attr(fontAttr);
  var scoreAdded = paper.text(Enum.SCREENWIDTH / 2, Enum.SCREENHEIGHT / 2 - 2 * Enum.TILE, '').attr(fontAttr);
  var levelStr = paper.text(485, 100, '').attr(fontAttrLevel).toFront();
  var beginStr = paper.text(485, 450, 'Begin').attr(fontAttrBegin).toBack();
  var beginBtn = paper.rect(425, 425, 120, 50, 10).attr({ fill: 'Olive', stroke: 'Olive', 'fill-opacity': 0.68 });
  var begin = paper.set();
  begin.push(beginStr, beginBtn);
  paper.image('./shapeBackground.jpg', 0, 0, 600, 500).toBack();
  var shape1 = new Shape(paper);
  var frame1 = new FrameAction();
  var accumRects1 = new AccumRects(paper);
  var grade1 = new Grade();
  var eventStateTransition = new Event('newState');
  var eventLevelTransition = new Event('nextLevel');
  var eventStartCollision = new Event('startCollision');

  var fsmL = new StateMachine({
    init: 'start',
    transitions: [
      { name: 'nextLevel', from: 'start', to: 'Level 1' },
      { name: 'nextLevel', from: 'Level 1', to: 'Level 2' },
      { name: 'nextLevel', from: 'Level 2', to: 'Level 3' },
      { name: 'nextLevel', from: 'Level 3', to: 'Level 4' },
      { name: 'nextLevel', from: 'Level 4', to: 'Level 5' },
      { name: 'nextLevel', from: 'Level 5', to: 'Level 6' },
      { name: 'nextLevel', from: 'Level 6', to: 'Level 7' },
      { name: 'nextLevel', from: 'Level 7', to: 'Level 8' },
      { name: 'leveltostart', from: '*', to: 'start' }
    ],
    methods: {
      onNextLevel: function () {
        var self = this;
        var levelObj = {
          'Level 1': function () {
            console.log(`i am in ${self.state} state`);
            shape1.setShapeSpeed(1000);
            levelStr.attr({ 'text': self.state.toString() });
            levelStr.animate(animScale);
          },

          'Level 2': function () {
            console.log(`i am in ${self.state} state`);
            shape1.setShapeSpeed(800);
            levelStr.attr({ 'text': self.state.toString() });
            levelStr.animate(animScale);
          },

          'Level 3': function () {
            console.log(`i am in ${self.state} state`);
            shape1.setShapeSpeed(600);
            levelStr.attr({ 'text': self.state.toString() });
            levelStr.animate(animScale);
          },

          'Level 4': function () {
            console.log(`i am in ${self.state} state`);
            shape1.setShapeSpeed(400);
            levelStr.attr({ 'text': self.state.toString() });
            levelStr.animate(animScale);
          },

          'Level 5': function () {
            console.log(`i am in ${self.state} state`);
            shape1.setShapeSpeed(300);
            levelStr.attr({ 'text': self.state.toString() });
            levelStr.animate(animScale);
          },

          'Level 6': function () {
            console.log(`i am in ${self.state} state`);
            shape1.setShapeSpeed(200);
            levelStr.attr({ 'text': self.state.toString() });
            levelStr.animate(animScale);
          },

          'Level 7': function () {
            console.log(`i am in ${self.state} state`);
            shape1.setShapeSpeed(150);
            levelStr.attr({ 'text': self.state.toString() });
            levelStr.animate(animScale);
          },

          'Level 8': function () {
            console.log(`i am in ${self.state} state`);
            shape1.setShapeSpeed(100);
            levelStr.attr({ 'text': self.state.toString() });
            levelStr.animate(animScale);
          },
        }
        levelObj[self.state]();
      }
    }
  });


  var fsm = new StateMachine({
    init: 'start',
    transitions: [
      { name: 'starttorun', from: 'start', to: 'run' },
      { name: 'runtoend', from: 'run', to: 'end' },
      { name: 'endtorun', from: 'end', to: 'run' },
      { name: 'runtogameover', from: 'run', to: 'gameover' },
      { name: 'gameovertostart', from: 'gameover', to: 'start' },

    ],

    methods: {
      onStarttorun: function () {
        console.log('start to run');
        shape1.execFrame().keyControl();
        var id = shape1.spawnShapeArrAndAttr();
        shape1.setNextId(id);
        document.dispatchEvent(eventStateTransition);
      },

      onRuntoend: function () {
        console.log('run to end');
        document.dispatchEvent(eventStateTransition);
      },

      onEndtorun: function () {
        console.log('end to run');
        document.dispatchEvent(eventStateTransition);
      },

      onRuntogameover: function () {
        document.dispatchEvent(eventStateTransition);
      }
    }
  });

  $(document).on('newState', function (e) {
    function stateBehavior(state) {
      var stateObj = {
        'start': function () {
          console.log('it is in start state');
        },

        'run': function () {
          console.log('it is in run state');
          shape1.init();
          var id2 = shape1.getNextId();
          shape1.createStartShape(id2.arr, { x: 150, y: 0 }, id2.attr);
          if (!$.isEmptyObject(shape1.getNextShape())) {
            shape1.clearShapeElements(shape1.getNextShape());
          }
          var idNext = shape1.spawnShapeArrAndAttr();
          var shapeNext = shape1.drawFromArr(idNext.arr, { x: 450, y: 300 }, idNext.attr);
          shape1.setNextShape(shapeNext);
          shape1.setNextId(idNext);
          document.dispatchEvent(shape1.eventPosChanged);
        },

        'end': function () {
          console.log('it is in end state');
          var shapeCollection = accumRects1.collectElements(shape1.getShapeElements());
          shape1.clearShapeElements(shape1.getShapeElements());
          var isRemoved = accumRects1.isFullElementsRemoved(shapeCollection);
          if (isRemoved) {
            accumRects1.moveDownElements(shapeCollection);
            grade1.getCurDelArr(accumRects1.getDeletedArr());
            accumRects1.clearDeletedArr();
            var delLayers = grade1.makeCurDelLayers();
            var score = grade1.makeCurScore();
            var delLayersAccum = grade1.makeAccumDelLayers();
            var scoreAccum = grade1.makeAccumScore();
            layersDel.attr({ 'fill-opacity': 1, 'text': '+' + delLayers.toString() + ' layers', transform: '' });
            scoreAdded.attr({ 'fill-opacity': 1, 'text': '+' + score.toString() + ' points', transform: '' });
            layersDel.animate({ transform: 't0,-50', 'fill-opacity': 0 }, 1000);
            scoreAdded.animate({ transform: 't0,-50', 'fill-opacity': 0 }, 1000);
            totalDelLayers.attr({ 'text': 'Layers: ' + delLayersAccum.toString() });
            totalScore.attr({ 'text': 'Score: ' + scoreAccum.toString() });
            totalDelLayers.animate(animScale);
            totalScore.animate(animScale);
            var level = grade1.getLevel();
            if (scoreAccum >= levelScore * level) {
              level++;
              grade1.setLevel(level);
              document.dispatchEvent(eventLevelTransition);
            }
          }
          setTimeout(function () {
            fsm.endtorun();
          }, 0);
        },

        'gameover': function () {
          console.log('it is in gameover state');
          levelStr.attr({ 'text': 'Game Over', fill: '90-#88f:30-#f00', transform: 't-300,100s0.5' }).toFront();
          levelStr.animate({ transform: '...s2' }, 500);
          beginStr.attr({ 'text': 'Restart' });
          beginBtn.attr({ fill: 'Olive', stroke: 'Olive' })
          shape1.stopFrame();
        }
      }
      stateObj[state]();
    }
    stateBehavior(fsm.state);

  });

  $(document).on('roundEnd', function (e) {
    fsm.runtoend();
  });

  $(document).on('posChanged', function (e) {
    accumRects1.receiveShapeArr(shape1.getShapeArr());
    var isTouched = accumRects1.collisionCheck(shape1.getShapeElements(), shape1.getShapeRotatedElements());
    shape1.setLeftKey(!isTouched.leftTouched);
    shape1.setRightKey(!isTouched.rightTouched);
    shape1.setDownKey(!isTouched.downTouched);
    shape1.setUpKey(!isTouched.rotateTouched);
    var boundary = shape1.getScreenBoundary();
    if (boundary.xEdge == 'left') { shape1.setLeftKey(false); }
    if (boundary.xEdge == 'right') { shape1.setRightKey(false); }
    if (boundary.yEdge == 'bottom') { shape1.setDownKey(false); }
    var minY = shape1.getShapeElements().getBBox().y;
    if (minY < Enum.TILE && isTouched.downTouched) {
      setTimeout(function () { fsm.runtogameover(); }, 0);
    };
  });

  $(document).on('nextLevel', function (e) {
    fsmL.nextLevel();
  });

  begin.click(function () {
    if (beginStr.attr('text') == 'Restart') {
      fsm.gameovertostart();
      fsmL.leveltostart();
      accumRects1.clearAccumElements();
      shape1.clearShapeElements(shape1.getShapeElements());
      totalDelLayers.attr({ 'text': 'Layers: 0' });
      totalScore.attr({ 'text': 'Score: 0' });
      levelStr.attr({ 'text': '' });
      beginStr.attr({ 'text': 'Begin' });
      grade1.clearAccumDelLayers();
      grade1.clearAccumScore();
      grade1.clearLevel();
      levelStr.attr({ fill: 'DarkMagenta' });
    }
    if (fsm.state == 'start' && fsmL.state == 'start') {
      beginStr.animate({ '0%': { transform: 's0.5' }, '50%': { transform: '' } }, 100);
      beginBtn.animate({ '0%': { transform: 's0.5' }, '50%': { transform: '' } }, 100);
      beginBtn.attr({ fill: 'gray', stroke: 'gray' });

      setTimeout(function () {
        fsm.starttorun();
        fsmL.nextLevel();
      }, 0);

    }

  })


};






