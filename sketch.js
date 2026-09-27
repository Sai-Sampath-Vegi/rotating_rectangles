const r = require("raylib");
const g = require("./geometry");

const windowWidth = 800;
const windowHeight = 800;
const windowTitle = "Rotating Rectangles";

const FPS = 60;

function getHalf(x) { return x / 2; }

function getInt(x) { return x - (x % 1); }

function running() { return !r.WindowShouldClose(); }

function setup() {
	r.InitWindow(windowWidth, windowHeight, windowTitle);
	r.SetTargetFPS(FPS);
}

const pathRelativeWidth = 0.6;
const pathRelativeHeight = 0.6;

const rotatingShapeRelativeWidth = 0.2;
const rotatingShapeRelativeHeight = 0.2;

const pathWidth = getInt(pathRelativeWidth * windowWidth);
const pathHeight = getInt(pathRelativeHeight * windowHeight);

const pathX = getInt(g.calcOffSet(windowWidth, pathWidth));
const pathY = getInt(g.calcOffSet(windowHeight, pathHeight));

const rotatingShapeWidth = getInt(rotatingShapeRelativeWidth * pathWidth);
const rotatingShapeHeight = getInt(rotatingShapeRelativeHeight * pathHeight);

const rotatingShapeCenterX = getInt(getHalf(rotatingShapeWidth));
const rotatingShapeCenterY = getInt(getHalf(rotatingShapeHeight))

const ABOVE_SIDE = 1;
const RIGHT_SIDE = 2;
const BELOW_SIDE = 3;
const LEFT_SIDE = 4;

const pathLeft = 0;
const pathTop = 0;

const rotatingShapeSpeed = 2;

let rotatingShapeOnePosX = 0;
let rotatingShapeOnePosY = 0;

let rotatingShapeTwoPosX = pathWidth;
let rotatingShapeTwoPosY = 0;

let rotatingShapeOneSide = ABOVE_SIDE;
let rotatingShapeTwoSide = RIGHT_SIDE;

function getShapeNextX(rotatingShapeCurrentPosX, pathLeft, pathWidth, rotatingShapeSide, rotatingShapeSpeed) {
	let rotatingShapePosX = rotatingShapeCurrentPosX;

	if (rotatingShapeSide === ABOVE_SIDE && rotatingShapePosX < pathWidth) rotatingShapePosX += rotatingShapeSpeed;
	if (rotatingShapeSide === BELOW_SIDE && rotatingShapePosX > pathLeft) rotatingShapePosX -= rotatingShapeSpeed;

	return rotatingShapePosX;
}

function getShapeNextY(rotatingShapeCurrentPosY, pathTop, pathHeight, rotatingShapeSide, rotatingShapeSpeed) {
	let rotatingShapePosY = rotatingShapeCurrentPosY;

	if (rotatingShapeSide === RIGHT_SIDE && rotatingShapePosY < pathHeight) rotatingShapePosY += rotatingShapeSpeed;
	if (rotatingShapeSide === LEFT_SIDE && rotatingShapePosY > pathTop) rotatingShapePosY -= rotatingShapeSpeed;

	return rotatingShapePosY;
}

function getShapeNextSide(rotatingShapePosX, rotatingShapePosY, pathLeft, pathTop, pathWidth, pathHeight, rotatingShapeCurrentSide) {
	let rotatingShapeSide = rotatingShapeCurrentSide;

	if (rotatingShapePosX === pathWidth && rotatingShapeSide === ABOVE_SIDE) rotatingShapeSide = RIGHT_SIDE;
	if (rotatingShapePosY === pathHeight && rotatingShapeSide === RIGHT_SIDE) rotatingShapeSide = BELOW_SIDE;
	if (rotatingShapePosX === pathLeft && rotatingShapeSide === BELOW_SIDE) rotatingShapeSide = LEFT_SIDE;
	if (rotatingShapePosY === pathTop && rotatingShapeSide === LEFT_SIDE) rotatingShapeSide = ABOVE_SIDE;

	return rotatingShapeSide;
}

function update() {
	rotatingShapeOnePosX = getShapeNextX(rotatingShapeOnePosX, pathLeft, pathWidth, rotatingShapeOneSide, rotatingShapeSpeed);
	rotatingShapeOnePosY = getShapeNextY(rotatingShapeOnePosY, pathTop, pathHeight, rotatingShapeOneSide, rotatingShapeSpeed);

	rotatingShapeTwoPosX = getShapeNextX(rotatingShapeTwoPosX, pathLeft, pathWidth, rotatingShapeTwoSide, rotatingShapeSpeed);
	rotatingShapeTwoPosY = getShapeNextY(rotatingShapeTwoPosY, pathTop, pathHeight, rotatingShapeTwoSide, rotatingShapeSpeed);

	rotatingShapeOneSide = getShapeNextSide(rotatingShapeOnePosX, rotatingShapeOnePosY, pathLeft, pathTop, pathWidth, pathHeight, rotatingShapeOneSide);

	rotatingShapeTwoSide = getShapeNextSide(rotatingShapeTwoPosX, rotatingShapeTwoPosY, pathLeft, pathTop, pathWidth, pathHeight, rotatingShapeTwoSide);
}

function drawPath() {
	const pathThickness = 4;
	const pathInnerWidth = pathWidth - pathThickness;
	const pathInnerHeight = pathHeight - pathThickness;
	const pathInnerX = g.calcOffSet(pathWidth, pathInnerWidth) + pathX;
	const pathInnerY = g.calcOffSet(pathHeight, pathInnerHeight) + pathY;

	r.DrawRectangle(pathX, pathY, pathWidth, pathHeight, r.WHITE);
	r.DrawRectangle(pathInnerX, pathInnerY, pathInnerWidth, pathInnerHeight, r.BLACK);
}

function drawRotatingShapes() {
	const rotatingShapeOneX = pathX - rotatingShapeCenterX + rotatingShapeOnePosX;
	const rotatingShapeOneY = pathY - rotatingShapeCenterY + rotatingShapeOnePosY;

	const rotatingShapeTwoX = pathX - rotatingShapeCenterX + rotatingShapeTwoPosX;
	const rotatingShapeTwoY = pathY - rotatingShapeCenterY + rotatingShapeTwoPosY;

	r.DrawRectangle(rotatingShapeOneX, rotatingShapeOneY, rotatingShapeWidth, rotatingShapeHeight, r.RED);
	r.DrawCircle(rotatingShapeOneX + rotatingShapeCenterX, rotatingShapeOneY + rotatingShapeCenterY, rotatingShapeWidth / 2, r.ORANGE);

	r.DrawRectangle(rotatingShapeTwoX, rotatingShapeTwoY, rotatingShapeWidth, rotatingShapeHeight, r.ORANGE);
	r.DrawCircle(rotatingShapeTwoX + rotatingShapeCenterX, rotatingShapeTwoY + rotatingShapeCenterY, rotatingShapeWidth / 2, r.YELLOW);
}

function draw() {
	r.BeginDrawing();

	r.ClearBackground(r.BLACK);

	drawPath();

	drawRotatingShapes();

	r.EndDrawing();
}

function teardown() { r.CloseWindow(); }

module.exports = {
	running,
	setup,
	update,
	draw,
	teardown,
}