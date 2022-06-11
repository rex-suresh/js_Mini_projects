const { stdout }  = process;
/* screen operations */
const showCursor = ()=>{
    stdout.cursorTo(0,0);
    stdout.clearScreenDown();
    stdout.write('\x1B[?25h');
};
const hideCursor = ()=>{
    stdout.cursorTo(0,0);
    stdout.clearScreenDown();
    stdout.write('\x1B[?25l');    
};

/* randomizers */
const random = (max)=> Math.floor(Math.random()*max);
const pickOne = (items)=> items[random(items.length)];
const takeChance = (totalOutcomes) => random(totalOutcomes) == 0;

/* insect methods */
const move = function(delta){
    if(delta){
        [this.dx,this.dy] = delta;
    }
    stdout.cursorTo(this.x,this.y);
    stdout.write(' '.repeat(this.shape.length));
    this.x += this.dx;
    this.y += this.dy;
    stdout.cursorTo(this.x,this.y);
    stdout.write(this.shape);
}
const getNextLocation = function(delta){
    const [dx,dy] = delta || [this.dx,this.dy];
    return [this.x+dx, this.y+dy];
}

/* insectarium methods */
const movements = '1,0 -1,0 1,0 -1,0 0,0 0,0 0,0 0,1 0,-1 1,0 1,1 1,-1 -1,0 -1,1 -1,-1'.split(' ').map(xy=>xy.split(',').map(Number));
const introduceInsect = function(){    
    const shape = pickOne(this.shapes);
    const [x,y] = this.size.map(random);
    const insect = { x, y, dx: 0, dy: 0, shape }
    this.insects.push(insect);
    move.call(insect);
    if(this.insects.length == this.insectsLimit) return;
    setTimeout(introduceInsect.bind(this),3000);
};
const moveInsects = function(){
    const isInMoodToChangeDirection = takeChance(3);
    const delta = isInMoodToChangeDirection && pickOne(movements);
    const insect = pickOne(this.insects);
    const [x,y] = getNextLocation.call(insect,delta);
    const [maxX,maxY] = this.size;
    const willInsectGoOutOfInsectarium = (x < 1) || (y < 1) || (x >= maxX) || (y >= maxY);
    if(willInsectGoOutOfInsectarium) return;
    move.call(insect,delta);
};

/* exit handler*/
const onClose = function(){
    showCursor();    
    process.exit(0);
}
/* main */
const main = ()=>{
    const shapes = '🦋 🧚‍♂️ 🧚‍♀️ 🐞 🕷 🦠'.split(' ');
    const insectsLimit = +process.argv[2] || 10;
    const size = stdout.getWindowSize();            
    const insectarium = { size, insects:[],shapes, insectsLimit};
    hideCursor();
    introduceInsect.call(insectarium);    
    setInterval(moveInsects.bind(insectarium),50);
    process.on('SIGINT',onClose);
};
main();