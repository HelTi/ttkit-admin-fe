import * as Marked from 'marked';
import * as hljs from 'highlight.js';

const renderer = new Marked.Renderer();

renderer.heading = (text, level) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return `
<h${level}>
  <a name="${escapedText}" class="anchor" href="#${escapedText}">
    <span class="header-link"></span>
  </a>
  ${text}
</h${level}>`;
};

Marked.setOptions({
  highlight(code) {
    return hljs.highlightAuto(code).value;
  },
  renderer,
});

export default content => {
  const toc = [];

  renderer.heading = (text, level) => {
    const anchor = `heading-${toc.length}`;

    toc.push([level, anchor, text]);
    return `<h${level} id="${anchor}">${text}</h${level}>`;
  };

  const markedRender = text => {
    const tok = Marked.lexer(text);
    const Ptext = Marked.parser(tok).replace(/<pre>/gi, '<pre class="hljs">');
    return Ptext;
  };

  const html = markedRender(content);
  return { html, toc: JSON.stringify(toc, null, 2) };
};
