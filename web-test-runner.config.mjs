export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  concurrency: 1,
  testRunnerHtml: (testFramework) =>
  `<html>
    <body>
      <script src="node_modules/@advanced-rest-client/arc-models/variables-model.js" type="module"></script>
      <variables-model></variables-model>
      <script type="module" src="${testFramework}"></script>
    </body>
  </html>`,
};
