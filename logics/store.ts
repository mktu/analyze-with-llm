import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { Octokit } from '@octokit/rest';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { parseOwnerAndRepo } from "@/utils/github";
import { createSupabaseClient, getUrlInfoInternal } from "@/services/supabase";

const octokit = new Octokit();

export const storeIssues = async (url: string) => {
    const client = createSupabaseClient();
    const apiRes = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: 'octokit',
        repo: 'octokit.js',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    const { repository, owner } = parseOwnerAndRepo(url);

    const texts = apiRes.data.map((v) => `
    Issue ID: ${v.id}
    Issue Title: ${v.title}
    Issue Description: ${v.body_text}
    Issue Url: https://github.com/${owner}/${repository}/issues/${v.number}
    `);
    const metadatas = apiRes.data.map((v) => ({
        url,
    }));
    const embeddings = new OpenAIEmbeddings();
    const splitter = new RecursiveCharacterTextSplitter();
    const pages = await splitter.createDocuments(texts, metadatas);
    await SupabaseVectorStore.fromDocuments(pages, embeddings, {
        client,
        tableName: "documents",
        queryName: "match_documents",
    })
    const supabaseRes = await client.from('urls').update({
        url,
        status: 'done'
    }).eq('url', url);
    if (supabaseRes.error) {
        throw Error(supabaseRes.error.message);
    }
}

export const storeReadme = async (url: string) => {
    const regex = /^(?!.*\.md$).*$/;
    const client = createSupabaseClient();
    const info = await getUrlInfoInternal(url, client);
    if (info && info.status === 'done') {
        return
    }
    let res = await client.from('urls').insert({
        url,
        status: 'inprogress'
    })
    if (res.error) {
        throw Error(res.error.message)
    }

    const { repository, owner } = parseOwnerAndRepo(url);

    // Issue info
    const apiRes = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: owner,
        repo: repository,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    const issueTexts = apiRes.data.map((v) => `
    Issue ID: ${v.id}
    Issue Title: ${v.title}
    Issue Description: ${v.body}
    Issue Url: https://github.com/${owner}/${repository}/issues/${v.number}
    `);
    const issueMetaData = apiRes.data.map((v) => ({
        url,
    }));

    /// 

    const embeddings = new OpenAIEmbeddings()
    const splitter = new RecursiveCharacterTextSplitter()
    const loader = new GithubRepoLoader(url, {
        branch: 'master',
        ignoreFiles: [regex]
    });
    const docs = await loader.load()
    const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined);
    const texts = selectedDocuments.map((doc) => doc.pageContent);
    const metadatas = selectedDocuments.map((doc) => ({
        ...doc.metadata,
        url
    }));
    const pages = await splitter.createDocuments([...texts, ...issueTexts], [...metadatas, ...issueMetaData]);
    await SupabaseVectorStore.fromDocuments(pages, embeddings, {
        client,
        tableName: "documents",
        queryName: "match_documents",
    })
    res = await client.from('urls').update({
        url,
        status: 'done'
    }).eq('url', url);
    if (res.error) {
        throw Error(res.error.message);
    }
}