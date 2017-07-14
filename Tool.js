class FrameAction {
    constructor(dt, _clocking, callback1, frameCount) {
        this.dt = 16;
        this._clocking = true;
        this.callback1 = null;
        this.frameCount = 0;
    }

    execFrame() {
        if (!this._clocking) { this._clocking = !this._clocking; }
        this.frameCount++;
       console.log(this.frameCount);
        var arr = [new Date().getTime()];
        var self = this;
        (function step() {
            var date = new Date().getTime();
            arr.push(date);
            if (arr.length > 2) { arr.shift(); }
            self.dt = arr[1] - arr[0];
            self.updateCallback(self.callback1);
            var id = requestAnimationFrame(step);
            if (!self._clocking) cancelAnimationFrame(id);
        })();
        return this;
    }

    updateCallback(callback) {
        if (arguments.length > 0 && typeof arguments[0] == 'function') {
            this.callback1 = callback || this.callback1;
            this.callback1();
        }
        return this;
    }

    stopFrame() {
        this._clocking = false;
        this.frameCount = 0;
        console.log('frame stopped');
        return this;
    }

    resumeFrame() {
        if (!this._clocking) { this._clocking = true; }
        console.log('frame resumed');
        return this;
    }
}

class Shape extends FrameAction {
    constructor(paper, arr, unit, pos, shapeElement, shapeAttr, nextId, shapeElementNext, dt, _clocking, callback1, frameCount) {
        super(dt, _clocking, callback1, frameCount);
        this.arr = [];
        this.paper = paper;
        this.unit = { width: Enum.TILE, height: Enum.TILE };
        this.pos = { x: 0, y: 0 };
        this.shapeElement = [];
        this.shapeAttr = {};
        this.nextId = {};
        this.shapeElementNext = {};
        this.speed = 1000;
        this.eventRoundEnd = new Event('roundEnd');
        this.eventPosChanged = new Event('posChanged');
    }

    setShapeSpeed(speed) {
        this.speed = speed;
    }

    setNextId(id) {
        this.nextId = id;
        return this;
    }

    getNextId() {
        return this.nextId;
    }

    setShapeArr(arr) {
        this.arr = arr;
        return this;
    }

    getShapeArr() {
        return this.arr;
    }

    setShapeAttr(shapeAttr) {
        this.shapeAttr = shapAttr;
        return this;
    }

    getShapeAttr() {
        return this.shapeAttr;
    }

    setShapeElements(shapeElement) {
        this.shapeElement = shapeElement;
        return this;
    }

    setNextShape(shapeElement) {
        this.shapeElementNext = shapeElement;
        return this;
    }
    getNextShape() {
        return this.shapeElementNext;
    }

    getShapeElements() {
        return this.shapeElement;
    }

    clearShapeElements(shapeElement) {
        for (let i = 0; i < shapeElement.length; i++) {
            shapeElement.remove();
        }
        shapeElement = [];
        return this;
    }

    setShapePos(pos) {
        this.pos = pos;
        return this;
    }

    getShapePos() {
        return this.pos;
    }

    spawnShapeArrAndAttr() {
        var shapeArrs = [], shapeColors = [];
        var shapeArr0 = [[0, 1, 0], [1, 1, 1], [0, 0, 0]];
        var shapeArr1 = [[1, 1, 0], [0, 1, 1], [0, 0, 0]];
        var shapeArr2 = [[0, 1, 1], [1, 1, 0], [0, 0, 0]];
        var shapeArr3 = [[0, 1, 0], [0, 1, 0], [1, 1, 0]];
        var shapeArr4 = [[0, 1, 0], [0, 1, 0], [0, 1, 1]];
        var shapeArr5 = [[1, 1], [1, 1]];
        var shapeArr6 = [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]];
        var shapeColor0 = { stroke: 'darkSlateGray', 'stroke-width': 2, fill: 'blue' };
        var shapeColor1 = { stroke: 'darkSlateGray', 'stroke-width': 2, fill: 'green' };
        var shapeColor2 = { stroke: 'darkSlateGray', 'stroke-width': 2, fill: 'pink' };
        var shapeColor3 = { stroke: 'darkSlateGray', 'stroke-width': 2, fill: 'yellow' };
        var shapeColor4 = { stroke: 'darkSlateGray', 'stroke-width': 2, fill: 'purple' };
        var shapeColor5 = { stroke: 'darkSlateGray', 'stroke-width': 2, fill: 'lightCoral' };
        var shapeColor6 = { stroke: 'darkSlateGray', 'stroke-width': 2, fill: 'orange' };
        shapeArrs.push(shapeArr0, shapeArr1, shapeArr2, shapeArr3, shapeArr4, shapeArr5, shapeArr6);
        shapeColors.push(shapeColor0, shapeColor1, shapeColor2, shapeColor3, shapeColor4, shapeColor5, shapeColor6);
        var shapeRandomId = Math.floor(Math.random() * shapeArrs.length);
        var arr = shapeArrs[shapeRandomId];
        var attr = shapeColors[shapeRandomId];

        return {
            arr: arr,
            attr: attr,
        };
    }

    createStartShape(arr, pos, attr) {
        this.arr = arr;
        this.shapeAttr = attr;
        this.pos = pos;
        this.pos = this.getOffSetInitPos(arr, this.pos);
        this.shapeElement = this.drawFromArr(arr, this.pos, attr);
        return this;
    }

    getOffSetInitPos(arr, pos) {
        var arrTemp = arr.slice(0);
        var offSetPosX = 0;
        var offSetPosY = 0;
        OutX:
        for (let j = 0; j < arrTemp[0].length; j++) {
            var sum = 0;
            for (let i = 0; i < arrTemp.length; i++) { sum += arrTemp[i][j]; }
            if (!sum) { offSetPosX++; } else { break OutX; }
        }
        arrTemp.reverse();
        OutY:
        for (let i = 0; i < arrTemp.length; i++) {
            var sum = arrTemp[i].reduce(function (pre, cur) { return pre + cur; });
            if (!sum) { offSetPosY++; } else { break OutY; }
        }
        var posAfterOffSet = { x: pos.x - offSetPosX * Enum.TILE, y: pos.y - offSetPosY * Enum.TILE };
        return posAfterOffSet;
    }


    init() {
        this.roundEnd = false;
        this.leftKey = true;
        this.rightKey = true;
        this.downKey = true;
        this.upKey = true;
        this.keyBoardActionEnabled = true;
        this.loop = 0;
        this.preMaxY = 0;
        this.bottomCounter = 0;
        this.keyDownPressed = 0;
        this.collisonRun = false;
        return this;
    }

    getScreenBoundary() {
        var self = this;
        this.boxBounding = this.shapeElement.getBBox();
        var boundaryY = this.boxBounding.y2 >= Enum.SCREENHEIGHT ? 'bottom' : 'notBottom';
        var boundaryX = this.boxBounding.x <= 0 ? 'left' : this.boxBounding.x2 >= Enum.SCREENWIDTH ? 'right' : 'notEdge';
        var boundary = { xEdge: boundaryX, yEdge: boundaryY };
        if (boundary.xEdge == 'left') {
            this.adjustShapeAttrXY(self.shapeElement, Enum.TILE, 'left');
        }
        if (boundary.xEdge == 'right') {
            this.adjustShapeAttrXY(self.shapeElement, Enum.TILE, 'right');
        }
        if (boundary.yEdge == 'bottom') {
            this.adjustShapeAttrXY(self.shapeElement, Enum.TILE, 'down');
        }
        return boundary;
    }

    updateCallback() {
        this.loop++;
        if (!this.keyBoardActionEnabled) return;

        if (this.roundEnd) {
            document.dispatchEvent(this.eventRoundEnd);
            return;
        }

        if (this.loop * this.dt >= this.speed) {
            if (!this.downKey) {
                if (this.preMaxY == this.shapeElement.getBBox().y2) {
                    this.bottomCounter++;
                    this.roundEnd = this.bottomCounter == 2 ? true : false;
                } else {
                    this.preMaxY = this.shapeElement.getBBox().y2;
                    this.bottomCounter = 0;
                }

            } else {
                this.keyBoardActionEnabled = false;
                this.bottomCounter = 0;
                this.moveDown();
            }
            this.loop = 0;
        }
    }

    setLeftKey(bool) {
        this.leftKey = bool;
        return this;
    }

    setRightKey(bool) {
        this.rightKey = bool
        return this;
    }

    setDownKey(bool) {
        this.downKey = bool;
        return this;
    }

    setUpKey(bool) {
        this.upKey = bool;
        return this;
    }

    keyControl() {
        var self = this;
        $(document).keydown(function (event) {

            if (!self.keyBoardActionEnabled) return false;
            if (self.collisonRun) return false;
            if (self.keyBoardActionEnabled) { self.keyBoardActionEnabled = false; }

            //  document.dispatchEvent(self.eventPosChanged);
            var key = event.originalEvent.key;
            key = (key == 'a' || key == 'ArrowLeft') ? 'ArrowLeft'
                : (key == 'd' || key == 'ArrowRight') ? 'ArrowRight'
                    : (key == 's' || key == 'ArrowDown') ? 'ArrowDown'
                        : (key == 'w' || key == 'ArrowUp') ? 'ArrowUp'
                            : 'Others';

            if (!self.downKey && key == 'ArrowDown') {
                self.keyDownPressed++;
                if (self.keyDownPressed == 2) {
                    self.keyDownPressed = 0;
                    self.roundEnd = true;
                    self.keyBoardActionEnabled = true;
                    return;
                }
            }

            function collisionKeyOff(leftKey, rightKey, downKey, upKey) {
                console.log(`left: ${self.leftKey}, right: ${self.rightKey}, down: ${self.downKey}, up: ${self.upKey}`);

                if (key == 'ArrowLeft' && !leftKey) {
                    console.log('collisionleft');
                    key = 'Others';
                }
                if (key == 'ArrowRight' && !rightKey) {
                    console.log('collisionright');
                    key = 'Others';
                }
                if (key == 'ArrowDown' && !downKey) {
                    console.log('collisiondown');
                    key = 'Others';
                }

                if (key == 'ArrowUp' && !upKey) {
                    console.log('collisionRotate');
                    key = 'Others';
                }
            }
            collisionKeyOff(self.leftKey, self.rightKey, self.downKey, self.upKey);

            function keyBoardAction(keyStr) {
                var keyAction = {
                    'ArrowLeft': function () {
                        self.moveLeft();
                    },

                    'ArrowRight': function () {
                        self.moveRight();
                    },

                    'ArrowDown': function () {
                        self.moveDown();
                    },

                    'ArrowUp': function () {
                        self.rotateShape90(true);
                    },

                    'Others': function () {
                        self.keyBoardActionEnabled = true;
                    },
                }
                return keyAction[keyStr]();
            }
            keyBoardAction(key);
        });

        $(document).scroll(function () {
            $(this).scrollTop(0);
            $(this).scrollLeft(0);
        });
        return this;
    }

    // expendBigArr() {
    //     let bigArr = (function create2DArr(row, col) {
    //         let arr2D = new Array(); //定义一维数组 
    //         for (let i = 0; i < row; i++) {
    //             arr2D[i] = new Array(); //将元素定义为数组 
    //             for (let j = 0; j < col; j++) {
    //                 arr2D[i][j] = 0;
    //             }
    //         }
    //         return arr2D;
    //     })(yTileNum, xTileNum);
    //     let ii = (bigArr.length - 1) - this.pos.y / this.unit.height;
    //     let jj = this.pos.x / this.unit.width;
    //     let iizero = ii - (this.arr.length - 1);
    //     let jjzero = jj;
    //     for (let i = 0; i < this.arr.length; i++) {
    //         for (let j = 0; j < this.arr[0].length; j++) {
    //             if (this.arr[i][j]) {
    //                 bigArr[iizero + i][jjzero + j] = this.arr[i][j];
    //             }
    //         }
    //     }
    //     this.expendedBigArr = bigArr;
    // if (this.st != undefined) {
    //     this.st.remove();
    // }
    // this.st = this.paper.set();
    // for (let i = 0; i < this.expendedBigArr.length; i++) {
    //     for (let j = 0; j < this.expendedBigArr[0].length; j++) {
    //         let textUnit = this.paper.text(j * this.unit.width + this.unit.width / 2, i * this.unit.height + this.unit.height / 2, this.expendedBigArr[this.expendedBigArr.length - 1 - i][j]).toFront();
    //         this.st.push(textUnit);
    //     }
    // }
    //     return this;
    // }

    rotationAtBoundaryAdaption(pos) {
        var posXMax = pos.x + this.arr.length * this.unit.width;
        var posYMax = pos.y + this.arr.length * this.unit.height;
        if (posYMax > Enum.SCREENHEIGHT + this.unit.height / 2) {
            pos.y -= Math.floor((posYMax - Enum.SCREENHEIGHT) / this.unit.height) * this.unit.height;
        }
        if (pos.x < - this.unit.width / 2) {
            pos.x += Math.floor(-pos.x / this.unit.width) * this.unit.width;
        } else if (posXMax > Enum.SCREENWIDTH + this.unit.width / 2) {
            pos.x -= Math.floor((posXMax - Enum.SCREENWIDTH) / this.unit.width) * this.unit.width;

        }
        return pos;
    }

    getShapeRotatedElements() {
        var copiedPos = Object.create(this.pos);
        copiedPos = this.rotationAtBoundaryAdaption(copiedPos);
        var copiedArr = this.arr.slice(0);
        var arrRot = this.arrRotation90(true, copiedArr);
        var shapeElementRotated = this.drawFromArr(arrRot, copiedPos);
        shapeElementRotated.hide();
        return shapeElementRotated;
    }

    drawFromArr(arr, pos, attr) {
        var shapePaint = this.paper.set();
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (!arr[i][j]) {
                    continue;
                }
                var newPosX = pos.x + j * this.unit.width; //j 为行
                var newPosY = pos.y + (arr.length - 1 - i) * this.unit.height; //浏览器Y轴和数组Y轴相反，所以用-号，i为列
                var newRect = this.paper.rect(newPosX, newPosY, this.unit.width, this.unit.height, 5).data('ID', [i, j]);
                shapePaint.push(newRect);
            }
        }
        if (!arguments[2]) return shapePaint;
        shapePaint.attr(attr);
        return shapePaint;
    }

    arrRotation90(clockwise, arr) {
        var arr_rotated = [];
        for (var i = 0; i < arr[0].length; i++) {
            arr_rotated[i] = [];
        }
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (clockwise) {
                    arr_rotated[arr[i].length - 1 - j][i] = arr[i][j];
                } else {
                    arr_rotated[j][arr.length - 1 - i] = arr[i][j];
                }
            }
        }
        return arr_rotated;
    }

    rotateMotion(clockwise) {
        this.shapeElement.show();
        var xRotation = (this.arr[0].length - 1) / 2 * this.unit.width * 1.5 + this.pos.x;
        var yRotation = (this.arr.length - 1) / 2 * this.unit.height * 1.5 + this.pos.y;
        var rotateAxis = { cx: xRotation, cy: yRotation };
        var deg = 90;
        deg = clockwise == true ? deg : -deg;
        var degUnit = 15;
        var timeUnit = 10;
        var loopCount = 0;
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            if (self.arr.toString() == self.arrRotation90(clockwise, self.arr).toString()) {
                resolve();
            } else {
                var interval = setInterval(function () {
                    loopCount++;
                    self.shapeElement.rotate(degUnit, rotateAxis.cx, rotateAxis.cy);
                    if (degUnit * loopCount == Math.abs(deg)) {
                        for (var i = 0; i < self.shapeElement.length; i++) {
                            self.shapeElement[i].transform('');// 将旋转的坐标系回到原始状态
                        }
                        resolve('rotateMotion done');
                        clearInterval(interval);
                    }
                }, timeUnit);
            }

        });
        return promise;
    }

    rotateShape90(clockwise) {
        var self = this;
        var rotateDirection = clockwise;
        rotateDirection = (rotateDirection == undefined) ? true : rotateDirection;
        this.shapeElement.hide();
        this.pos = this.rotationAtBoundaryAdaption(this.pos);
        this.rotateMotion(rotateDirection).then(function (value) {
            self.shapeElement.remove();
            self.arr = self.arrRotation90(rotateDirection, self.arr);
            self.shapeElement = self.drawFromArr(self.arr, self.pos, self.shapeAttr);
            // self.expendBigArr();
            self.keyBoardActionEnabled = true;
            document.dispatchEvent(self.eventPosChanged);
        });
        return this;
    }


    mathCeilByUnit(value, unit) {
        var times = value / unit;
        times = Math.ceil(times);
        return times * unit;
    }

    mathFloorByUnit(value, unit) {
        var times = value / unit;
        times = Math.floor(times);
        return times * unit;
    }

    mathRoundByUnit(value, unit) {
        var times = value / unit;
        times = Math.round(times);
        return times * unit;
    }

    adjustShapeAttrXY(shapeElement, unit, touchDirection) {
        for (let i = 0; i < shapeElement.length; i++) {
            switch (touchDirection) {
                case 'down':
                    var xAfter = this.mathRoundByUnit(shapeElement[i].attr('x'), unit);
                    var yAfter = this.mathFloorByUnit(shapeElement[i].attr('y'), unit);
                    shapeElement[i].attr({ x: xAfter, y: yAfter });
                    break;
                case 'left':
                    var xAfter = this.mathCeilByUnit(shapeElement[i].attr('x'), unit);
                    var yAfter = this.mathRoundByUnit(shapeElement[i].attr('y'), unit);
                    shapeElement[i].attr({ x: xAfter, y: yAfter });
                    break;
                case 'right':
                    var xAfter = this.mathFloorByUnit(shapeElement[i].attr('x'), unit);
                    var yAfter = this.mathRoundByUnit(shapeElement[i].attr('y'), unit);
                    shapeElement[i].attr({ x: xAfter, y: yAfter });
                    break;
                default:
                    var xAfter = this.mathRoundByUnit(shapeElement[i].attr('x'), unit);
                    var yAfter = this.mathRoundByUnit(shapeElement[i].attr('y'), unit);
                    shapeElement[i].attr({ x: xAfter, y: yAfter });
            }
        }
        return this;
    }

    moveAnim(direction) {
        var self = this;
        // this.expendBigArr();
        for (var i = 0; i < this.shapeElement.length; i++) {
            var posObj = {
                'right': { x: self.shapeElement[i].attr('x') + self.unit.width },
                'left': { x: self.shapeElement[i].attr('x') - self.unit.width },
                'down': { y: self.shapeElement[i].attr('y') + self.unit.height }
            }
            self.shapeElement[i].animate(posObj[direction], 25, 'linear', function () {
                if (this == self.shapeElement[self.shapeElement.length - 1]) {
                    self.adjustShapeAttrXY(self.shapeElement, Enum.TILE, '');
                    document.dispatchEvent(self.eventPosChanged);
                    self.keyBoardActionEnabled = true;
                }

            });
        }
    }

    moveRight() {
        this.pos.x += this.unit.width;
        this.moveAnim('right');
        return this;
    }

    moveLeft() {
        this.pos.x -= this.unit.width;
        this.moveAnim('left');
        return this;
    }

    moveDown() {
        this.pos.y += this.unit.height;
        this.moveAnim('down');
        return this;
    }

    offSetAdaption() {
        if (this.boxBounding.x < 0) {
            this.pos.x += this.unit.width;
        } else if (this.boxBounding.x2 > Enum.SCREENWIDTH) {
            this.pos.x -= this.unit.width;
        }
    }
}

class AccumRects {
    constructor(paper, shapeElementCollection, heightY) {
        this.paper = paper;
        this.shapeElementCollection = [];
        this.deletedArr = [];
        this.heightY = Enum.SCREENHEIGHT - Enum.TILE;
    }

    clearAccumElements() {
        for (let i = 0; i < this.shapeElementCollection.length; i++) {
            this.shapeElementCollection[i].remove();
        }

        this.shapeElementCollection = [];

        return this;
    }
    mathCeilByUnit(value, unit) {
        var times = value / unit;
        times = Math.ceil(times);
        return times * unit;
    }

    mathFloorByUnit(value, unit) {
        var times = value / unit;
        times = Math.floor(times);
        return times * unit;
    }

    mathRoundByUnit(value, unit) {
        var times = value / unit;
        times = Math.round(times);
        return times * unit;
    }

    adjustShapeAttrXY(shapeElement, unit, touchDirection) {
        for (let i = 0; i < shapeElement.length; i++) {
            switch (touchDirection) {
                case 'down':
                    var xAfter = this.mathRoundByUnit(shapeElement[i].attr('x'), unit);
                    var yAfter = this.mathFloorByUnit(shapeElement[i].attr('y'), unit);
                    shapeElement[i].attr({ x: xAfter, y: yAfter });
                    break;
                case 'left':
                    var xAfter = this.mathCeilByUnit(shapeElement[i].attr('x'), unit);
                    var yAfter = this.mathRoundByUnit(shapeElement[i].attr('y'), unit);
                    shapeElement[i].attr({ x: xAfter, y: yAfter });
                    break;
                case 'right':
                    var xAfter = this.mathFloorByUnit(shapeElement[i].attr('x'), unit);
                    var yAfter = this.mathRoundByUnit(shapeElement[i].attr('y'), unit);
                    shapeElement[i].attr({ x: xAfter, y: yAfter });
                    break;
                default:
                    var xAfter = this.mathRoundByUnit(shapeElement[i].attr('x'), unit);
                    var yAfter = this.mathRoundByUnit(shapeElement[i].attr('y'), unit);
                    shapeElement[i].attr({ x: xAfter, y: yAfter });
            }
        }
        return this;
    }


    collectElements(shapeElement) {
        this.adjustShapeAttrXY(shapeElement, Enum.TILE);
        let length = shapeElement.length;
        for (let i = 0; i < length; i++) {
            var element = shapeElement.pop();
            var elementY = element.attr('y');
            this.heightY = elementY < this.heightY ? elementY : this.heightY;
            this.shapeElementCollection.push(element);
        }

        this.shapeElementCollection.sort(function (o1, o2) {
            return o1.attr('y') - o2.attr('y');
        }); //按照y轴从小到大的顺序排列，这样方便以后判断该层是否满员，然后消除
        return this.shapeElementCollection;
    };

    isFullElementsRemoved(shapeElement) {
        if (shapeElement.length < xTileNum) return false;
        Out:
        for (let i = 0; i < shapeElement.length; i++) {
            if (!shapeElement[i + xTileNum - 1]) break Out;
            if (Math.abs(shapeElement[i].attr('y') - shapeElement[i + xTileNum - 1].attr('y')) < Enum.TILE / 3) {
                this.deletedArr.push(shapeElement[i].attr('y'));
                var shapeOut = shapeElement.splice(i, xTileNum);
                for (let j = 0; j < shapeOut.length; j++) {
                    shapeOut[j].remove();
                }
                --i;
            }
        }
        return this.deletedArr.length < 1 ? false : true;
    }

    moveDownElements(shapeElement) {
        var self = this;
        for (let i = 0; i < shapeElement.length; i++) {
            var moveDownCounter = 0;
            for (let v of this.deletedArr) {
                if (shapeElement[i].attr('y') < v) { moveDownCounter++; }
            }
            shapeElement[i].animate({ y: shapeElement[i].attr('y') + moveDownCounter * Enum.TILE }, 50, 'easeIn');
        }
        return this;
    }

    clearDeletedArr() {
        this.deletedArr = [];
    }

    getDeletedArr() {
        var delArr = this.deletedArr.slice(0);
        return delArr;
    }

    receiveShapeArr(array) {
        this.arr = array;
        return this.arr;
    }

    getSurroundShape(shape) {
        var shapeSurround = [];
        var shapeBBox = shape.getBBox();
        var surMargin = this.mathRoundByUnit(Math.abs((shapeBBox.x2 - shapeBBox.x) - (shapeBBox.y2 - shapeBBox.y) / Enum.TILE), Enum.TILE);
        var shapeAccum = this.shapeElementCollection;
        for (let i = 0; i < shapeAccum.length; i++) {
            if (shapeAccum[i].attr('x') >= (shapeBBox.x - surMargin * Enum.TILE) && shapeAccum[i].attr('x') <= shapeBBox.x2 + (surMargin - 1) * Enum.TILE
                && shapeAccum[i].attr('y') >= shapeBBox.y - surMargin * Enum.TILE && shapeAccum[i].attr('y') <= shapeBBox.y2 + (surMargin - 1) * Enum.TILE) {
                shapeSurround.push(shapeAccum[i]);
            }
        }
        return shapeSurround;
    }

    isHeightTouched(shape, shapeRotated) {
        var isTouched = false;
        let shapeBBox = shape.getBBox();
        let shapeRotateBBox = shapeRotated.getBBox();
        let shapeHeightY = shapeBBox.y2 > shapeRotateBBox.y2 ? shapeBBox.y2 : shapeRotateBBox.y2;
        return shapeHeightY <= this.heightY - Enum.TILE ? false : true;
    }

    isNeighborTouched(shape) {
        var shapeSurr = this.getSurroundShape(shape);
        return shapeSurr.length >= 1 ? true : false;
    }

    isRightCollision(shape, shapeSurr) {
        var rightTouched = false;
        var offSetX = 0;
        checkRightDone:
        for (let i = 0; i < shapeSurr.length; i++) {
            for (let j = 0; j < shape.length; j++) {
                if (shape[j].attr('x') >= shapeSurr[i].attr('x') - Enum.TILE
                    && shape[j].attr('x') < shapeSurr[i].attr('x')
                    && Math.abs(shape[j].attr('y') - shapeSurr[i].attr('y')) < 1 / 2 * Enum.TILE) {
                    //  offSetX = shape[j].attr('x') + Enum.TILE - shapeSurr[i].attr('x');
                    rightTouched = true;
                    break checkRightDone;
                }
            }
        }
        if (rightTouched) {
            // for (let i = 0; i < shape.length; i++) {
            //     shape[i].attr({ x: shape[i].attr('x') - offSetX });
            // }
            this.adjustShapeAttrXY(shape, Enum.TILE, 'right');
        }
        return rightTouched;
    }

    isLeftCollision(shape, shapeSurr) {
        var leftTouched = false;
        var offSetX = 0;
        checkLeftDone:
        for (let i = 0; i < shapeSurr.length; i++) {
            for (let j = 0; j < shape.length; j++) {
                if (shape[j].attr('x') <= shapeSurr[i].attr('x') + Enum.TILE
                    && shape[j].attr('x') > shapeSurr[i].attr('x')
                    && Math.abs(shape[j].attr('y') - shapeSurr[i].attr('y')) < 1 / 2 * Enum.TILE) {
                    //  offSetX = shapeSurr[i].attr('x') + Enum.TILE - shape[j].attr('x');
                    leftTouched = true;
                    break checkLeftDone;
                }
            }
        }
        if (leftTouched) {
            // for (let i = 0; i < shape.length; i++) {
            //     shape[i].attr({ x: shape[i].attr('x') + offSetX });
            // }
            this.adjustShapeAttrXY(shape, Enum.TILE, 'left');
        }
        return leftTouched;
    }

    isDownCollision(shape, shapeSurr) {
        var downTouched = false;
        var offSetY = 0;
        checkDownDone:
        for (let i = 0; i < shapeSurr.length; i++) {
            for (let j = 0; j < shape.length; j++) {
                if (shape[j].attr('y') + Enum.TILE >= shapeSurr[i].attr('y')
                    && shape[j].attr('y') < shapeSurr[i].attr('y')
                    && Math.abs(shape[j].attr('x') - shapeSurr[i].attr('x')) < 1 / 2 * Enum.TILE) {
                    // offSetY = shape[j].attr('y') - (shapeSurr[i].attr('y') - Enum.TILE);
                    downTouched = true;
                    break checkDownDone;
                }
            }
        }
        if (downTouched) {
            // for (let i = 0; i < shape.length; i++) {
            //     shape[i].attr({ y: shape[i].attr('y') - offSetY });
            // }
            this.adjustShapeAttrXY(shape, Enum.TILE, 'down');
        }
        return downTouched;
    }

    isRotateCollision(shape, shapeRotated, shapeSurr) {
        var rotateTouched = false;
        checkCollisonDone1:
        for (let i = 0; i < shapeSurr.length; i++) {
            for (let j = 0; j < shapeRotated.length; j++) {
                if (Math.abs(shapeRotated[j].attr('x') - shapeSurr[i].attr('x')) < 1 / 2 * Enum.TILE
                    && Math.abs(shapeRotated[j].attr('y') - shapeSurr[i].attr('y')) < 1 / 2 * Enum.TILE) {
                    rotateTouched = true;
                    console.log('collision due to static rotation');
                    break checkCollisonDone1;
                }
            }
        }
        if (rotateTouched) return rotateTouched;

        checkCollisonDone2:
        for (let i = 0; i < shapeSurr.length; i++) {
            for (let j = 0; j < shape.length; j++) {
                let iBeforeRotate = shape[j].data('ID')[0];
                let jBeforeRotate = shape[j].data('ID')[1];
                for (let k = 0; k < shapeRotated.length; k++) {
                    let iAfterRotate = shapeRotated[k].data('ID')[0];
                    let jAfterRotate = shapeRotated[k].data('ID')[1];
                    if (jAfterRotate == iBeforeRotate && jBeforeRotate == this.arr.length - 1 - iAfterRotate) {
                        let BBoxBeforeRotate = shape[j].getBBox();
                        let BBoxAfterRotate = shapeRotated[k].getBBox();
                        let BBbox = shapeSurr[i].getBBox();
                        let xMid = (BBoxBeforeRotate.x + BBoxAfterRotate.x) / 2;
                        let x2Mid = (BBoxBeforeRotate.x2 + BBoxAfterRotate.x2) / 2;
                        let yMid = (BBoxBeforeRotate.y + BBoxAfterRotate.y) / 2;
                        let y2Mid = (BBoxBeforeRotate.y2 + BBoxAfterRotate.y2) / 2;
                        let point1 = { x: xMid, y: yMid };
                        let point2 = { x: xMid, y: y2Mid };
                        let point3 = { x: x2Mid, y: yMid };
                        let point4 = { x: x2Mid, y: y2Mid };
                        let pointArr = [point1, point2, point3, point4];
                        for (let each of pointArr) {
                            if (each.x > BBbox.x && each.x < BBbox.x2 && each.y > BBbox.y && each.y < BBbox.y2) {
                                rotateTouched = true;
                                console.log('collision due to dynamic rotation');
                                break checkCollisonDone2;
                            }
                        }
                    }
                }
            } //虚拟旋转后的方块个体不和堆积的方块个体重合，也可能发生碰撞。
            //原因是在旋转过程中会扫过堆积的方块，但是旋转之后并不予其重合。
            //解决方案就是计算出当前方块个体和虚拟旋转后方块个体每个点之间连线的中心点，看此点是否包含于堆积方块以内。
            //如果包含，说明碰撞产生；不包含，说明没有碰撞。

        }
        return rotateTouched;
    }


    collisionCheck(shape, shapeRotated) {
        var checkRes = {
            rightTouched: false,
            leftTouched: false,
            downTouched: false,
            rotateTouched: false
        };

        if (!this.isHeightTouched(shape, shapeRotated)) {
            return checkRes;
        }

        if (!this.isNeighborTouched(shape)) {
            return checkRes;
        }

        var shapeSurr = this.getSurroundShape(shape);
        checkRes.rightTouched = this.isRightCollision(shape, shapeSurr);
        checkRes.leftTouched = this.isLeftCollision(shape, shapeSurr);
        checkRes.downTouched = this.isDownCollision(shape, shapeSurr);
        checkRes.rotateTouched = this.isRotateCollision(shape, shapeRotated, shapeSurr);
        return checkRes;
    };
}

class Grade {
    constructor(curDelLayers, accumDelLayers, curScore, accumScore) {
        this.curDelLayers = 0;
        this.accumDelLayers = 0;
        this.curScore = 0;
        this.accumScore = 0;
        this.level = 1;
    }

    getLevel() {
        return this.level;
    }
    setLevel(level) {
        this.level = level;
    }

    getCurDelArr(arr) {
        this.curDelArr = arr;
        return this.curDelArr;
    }

    makeCurDelLayers() {
        this.curDelLayers = this.curDelArr.length;
        return this.curDelLayers;
    }

    makeAccumDelLayers() {
        this.accumDelLayers += this.curDelLayers;
        return this.accumDelLayers;
    }

    makeCurScore() {
        var score = this.curDelArr.length;
        this.curDelArr.sort();
        Done:
        for (let i = 0; i < this.curDelArr.length; i++) {
            if (!this.curDelArr[i + 1]) { break Done; }
            if (this.curDelArr[i + 1] - this.curDelArr[i] == Enum.TILE) {
                score++;
            }
        }
        this.curScore = score;
        return this.curScore;
    }

    makeAccumScore() {
        this.accumScore += this.curScore;
        return this.accumScore;
    }

    clearAccumScore() {
        this.accumScore = 0;
        return this.accumScore;
    }

    clearAccumDelLayers() {
        this.accumDelLayers = 0;
        return this.accumDelLayers;
    }
    clearLevel(){
        this.level = 1;
        return this.level;
    }

} 
