import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import packageName from 'depcheck-package-name'
import { execa } from 'execa'
import fs from 'fs-extra'

export default tester(
  {
    works: async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
        import tester from '${packageName`@dword-design/tester`}'
        import P from 'path'
        import self from '../src'
        export default tester({
          test1: () => {
            expect(process.env.FOO).toEqual('bar')
            process.env.BAR = 'baz'
          },
          test2: () => {
            expect(process.env.FOO).toEqual('bar')
            expect(process.env.BAR).toBeUndefined()
          },
        }, [self()])
      `
      )
      await execa(
        'mocha',
        ['--ui', packageName`mocha-ui-exports-auto-describe`, 'index.spec.js'],
        { env: { FOO: 'bar' } }
      )
    },
  },
  [testerPluginTmpDir()]
)
