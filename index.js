const core = require('@actions/core');
const httpClient = require('@actions/http-client');

(async () => {
  try {
    // Passed in variables
    const sha = core.getInput('sha');
    const context = core.getInput('context');
    const repository = core.getInput('repository');
    const token = core.getInput('token');
    const repeat = Number(core.getInput('repeat'));
    const sleep = Number(core.getInput('sleep'));

    async function getStatus() {
      try {
        const url = `https://api.github.com/repos/${repository}/commits/${sha}/status`;
        console.log(`Hitting url ${url}\n`);

        const client = new httpClient.HttpClient('thoughtindustries');
        const response = await client.getJson(url, {
          [httpClient.Headers.Accept]: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`
        });

        return response.result;
      } catch (e) {
        return { error: e.message };
      }
    }

    function findStateForContext(response) {
      if (!response) {
        return '';
      }

      for (const status of response.statuses) {
        if (context === status.context) {
          return status.state;
        }
      }

      return '';
    }

    for (let i = 0; i < repeat; i++) {
      const data = await getStatus();

      if (data.error) {
        console.error('Failed to get status. Error: ', data.error, '\n');
      }

      const state = findStateForContext(data);

      switch (state) {
        case '':
        case 'pending':
          console.log(`The deployment is in progress. State: ${state}\n`);
          await new Promise(r => setTimeout(r, sleep * 1000));
          break;
        case 'success':
          console.log('The deployment succeeded');
          process.exit(0);
          break;
        default:
          console.error(`The deployment failed. State: ${state}\n`);
          process.exit(2);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
