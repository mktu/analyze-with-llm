import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from '../types/supabase'
import { UrlInfo } from "@/types/analyze";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

type Response = {
    text: string
}

type Props = {
    url: string,
    question: string,
    history: string[]
}

const regex = /^(?!.*\.md$).*$/;

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) throw new Error(`Expected env var SUPABASE_URL`);


const getUrlInfoInternal = async (url: string, client: SupabaseClient) => {
    const result = await client.from('urls').select('url,status,id').eq('url', url)
    if (!result || !result.data || result.data.length === 0) {
        return null
    }
    return result.data[0] as UrlInfo
}

export const clearEmbeddings = async (url: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
    await client.from('urls').delete().eq('url', url);
    await client.rpc('delete_documents_by_url', { url })
    console.log('clear embeddings')
}

export const getUrlInfo = async (url: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
    return await getUrlInfoInternal(url, client)
}

export const getUrlInfoById = async (id: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
    const result = await client.from('urls').select('url,status,id').eq('id', id)
    if (!result || !result.data || result.data.length === 0) {
        return null
    }
    return result.data[0] as UrlInfo
}

export const storeEmbeddings = async (url: string) => {
    const client = createClient<Database>(supabaseUrl, privateKey);
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
    const pages = await splitter.createDocuments(texts, metadatas);
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

export const analyzeGithub = async ({
    url,
    question,
    history = []
}: Props) => {
    const model = new ChatOpenAI({ temperature: 0.9 });
    const embeddings = new OpenAIEmbeddings()
    const client = createClient(supabaseUrl, privateKey);
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
        client,
        tableName: "documents",
        queryName: "match_documents",
        filter: {
            url
        }
    })
    const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever()
    );

    const res = await chain.call({ question, chat_history: history });
    // save hostory to vectorstore
    return res
}
