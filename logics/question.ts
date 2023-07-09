import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { saveHistory } from "../services/supabase/history";
import { createSupabaseClient } from "@/services/supabase";
import { AiUserId, ClientUserId } from "@/utils/constants";

type Props = {
    url: string,
    question: string,
    histories: string[]
}
export const analyzeGithub = async ({
    url,
    question,
    histories = []
}: Props) => {
    const model = new ChatOpenAI({ temperature: 0.9 });
    const embeddings = new OpenAIEmbeddings()
    const client = createSupabaseClient();
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
        client,
        tableName: "documents",
        queryName: "match_documents",
        filter: {
            url
        }
    })
    //'please provide "Issue Title" and "Issue Url", and summarize "Issue Description" that seems to be related to the following {question}'
    const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever()
    );

    // 質問 + contextの形のstringが形成され、AIに飛ぶ
    const res = await chain.call({ question, chat_history: histories });
    await saveHistory(url, [{
        userId: ClientUserId,
        message: question
    }, {
        userId: AiUserId,
        message: res.text
    }], client);
    // save hostory to vectorstore
    return res
}