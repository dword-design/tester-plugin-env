import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import packageName from 'depcheck-package-name'
import { execaCommand } from 'execa'
import outputFiles from 'output-files'

export default tester(
  {
    works: async () => {
      await outputFiles({
        'index.spec.js': endent`
          import tester from '${packageName`@dword-design/tester`}'
          import P from 'path'
          import { expect } from 'expect'

          import self from '../src/index.js'

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
        `,
        'package.json': JSON.stringify({ type: 'module' }),
      })
      await execaCommand('mocha --ui exports index.spec.js', {
        env: { FOO: 'bar' },
      })
    },
  },
  [testerPluginTmpDir()],
)
