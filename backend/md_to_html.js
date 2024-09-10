import remarkHtml from 'remark-html'
import remarkParse from 'remark-parse'
import {unified} from 'unified'

export default async function marktoHTML(data){
const file = await unified()
  .use(remarkParse)
  .use(remarkHtml)
  .process(data)

  return file.toString();
}


