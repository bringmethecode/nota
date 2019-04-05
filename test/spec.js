const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { Application } = require('spectron')
const path = require('path')
const electronPath = require('electron')

chai.should()
chai.use(chaiAsPromised)

describe('nota app', () => {
  beforeEach(() => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')],
    })

    return this.app.start()
  })

  beforeEach(() => {
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness
  })

  afterEach(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
    return false
  })

  it('doesn\'t open up devtools', () => this.app.client.waitUntilWindowLoaded()
    .getWindowCount().should.eventually.equal(1)
    .browserWindow.isDevToolsOpened().should.eventually.be.false)

  it('is visible to the user', () => this.app.client.waitUntilWindowLoaded()
    .browserWindow.isMinimized().should.eventually.be.false
    .browserWindow.isVisible().should.eventually.be.true
    .browserWindow.isFocused().should.eventually.be.true
    .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
    .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0))
})
