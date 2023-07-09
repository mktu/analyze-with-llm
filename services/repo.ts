import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

export const fetchIssues = async () => {
    const res = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: 'octokit',
        repo: 'octokit.js',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    return res.data
}
