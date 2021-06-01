import { Config } from '../../Config/type'
import { Json } from '../../Json'

export default (config: Config): Json => ({
  name: 'Test',
  on: {
    push: {
      branches: ['main', '$default-branch'],
    },
    pull_request: {
      branches: ['main', '$default-branch'],
    },
  },
  jobs: {
    build: {
      'runs-on': 'ubuntu-latest',
      strategy: {
        matrix: {
          'node-version': ['12.x', '14.x', '15.x'],
        },
      },
      steps: [
        {
          uses: 'actions/checkout@v2',
        },
        {
          name: 'Use Node.js ${{ matrix.node-version }}',
          uses: 'actions/setup-node@v1',
          with: {
            'node-version': '${{ matrix.node-version }}',
          },
        },
        { run: `${config.packageManager} install` },
        { run: `${config.packageManager} run build` },
        ...(config.jest ? [{ run: `${config.packageManager} run test` }] : []),
        ...(config.eslint
          ? [{ run: `${config.packageManager} run lint` }]
          : []),
      ],
    },
    'deploy-docs': {
      needs: ['build'],
      'runs-on': 'ubuntu-latest',
      steps: [
        {
          name: 'Checkout',
          uses: 'actions/checkout@v2.3.1',
        },
        {
          name: 'Install',
          run: `${config.packageManager} install`,
        },
        {
          name: 'Generate docs',
          run: `${config.packageManager} run docs`,
        },
        {
          name: 'Deploy',
          uses: 'JamesIves/github-pages-deploy-action@4.0.0',
          with: {
            branch: 'gh-pages',
            folder: 'docs',
          },
        },
      ],
    },
  },
})
