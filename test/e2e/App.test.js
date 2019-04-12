import { Selector } from 'testcafe'
import { ReactSelector, waitForReact } from 'testcafe-react-selectors'

const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages()
  await t.expect(error).eql([])
}

fixture`Nota App`
  .page`../../dist/index.html`
  .beforeEach(async () => waitForReact())
  .afterEach(assertNoConsoleErrors)

test('should open an Electron window', async (t) => {
  console.log('firing test here')
  await t.expect(Selector('title').innerText).eql('nota')
})

test('it should have an empty state at start', async (t) => {
  const appComponent = ReactSelector('App')
  const { state: appState } = await appComponent.getReact()
  await t.expect(appState.value).eql('')
})
