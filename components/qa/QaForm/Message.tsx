import ReactMarkdown from "react-markdown";
import { HistoryInfo } from "@/types/analyze"
import { ClientUserId } from "@/utils/constants"
import { FC } from "react"

type Props = {
    history: HistoryInfo
}


const convertLinksToHtml = (text: string): string => {
    // URLを検出する正規表現パターン
    const urlPattern = /(https?:\/\/\S+)/g;

    // URLを<a>タグで囲む関数
    const replaceUrl = (url: string): string => {
        return `[${url}](${url})`;
    };

    // テキスト内のURLを<a>タグに変換する
    const convertedText = text.replace(urlPattern, replaceUrl);

    return convertedText;
}

const Message: FC<Props> = ({
    history
}) => (
    <div className='border border-gray-400 rounded bg-white'>
        <div className='border-b border-gray-400 p-2'>{history.userId === ClientUserId ? 'Question' : 'Answer'}</div>
        <div className='p-2'>
            <ReactMarkdown>
                {convertLinksToHtml(history.message)}
            </ReactMarkdown>
        </div>
    </div>
)

export default Message