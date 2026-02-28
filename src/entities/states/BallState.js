class BallState {
    getColor() { throw new Error('must implement getColor'); }
    enter(ball)  { throw new Error('must implement enter');  }
    exit(ball)   { throw new Error('must implement exit');   }
    update(ball) { throw new Error('must implement update'); }
}
