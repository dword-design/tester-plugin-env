export default () => ({
  afterEach() {
    process.env = this.previousEnv
  },
  beforeEach() {
    this.previousEnv = { ...process.env }
  },
})
