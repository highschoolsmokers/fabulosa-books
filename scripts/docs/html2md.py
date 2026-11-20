# Convert html/ (the tutorial's source of truth) into tutorial.md.
# Used by scripts/build-docs.sh; run that rather than this directly.
import glob, sys, re, html
from html.parser import HTMLParser

class Conv(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out=[]; self.buf=''; self.stack=[]; self.list=[]; self.pre=None
        self.table=None; self.row=None; self.cell=None; self.cls=None; self.href=None
    def flush(self, prefix='', suffix=''):
        t=re.sub(r'\s+',' ',self.buf).strip()
        if t: self.out.append(prefix+t+suffix)
        self.buf=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if self.pre is not None:
            if tag=='code':
                self.pre['lang']=(a.get('class') or '').replace('language-','')
                self.pre['src']=a.get('data-source')
            return
        if tag=='pre': self.flush(); self.pre={'text':''}; return
        if tag in ('h2','h3','p'): self.flush()
        if tag=='div' and a.get('class')=='step': self.flush(); self.cls='step'
        if tag in ('ul','ol'): self.flush(); self.list.append([tag,0])
        if tag=='li':
            self.flush()
            kind=self.list[-1]
            kind[1]+=1
            self.buf = ('1. ' if kind[0]=='ol' else '- ') if kind[0]=='ul' else f'{kind[1]}. '
            if kind[0]=='ul': self.buf='- '
        if tag=='table': self.flush(); self.table=[]
        if tag=='tr': self.row=[]
        if tag in ('td','th'): self.cell=''
        if tag=='img':
            self.flush(); self.out.append(f"![{a.get('alt','')}](../html/{a['src']})")
        if tag=='strong': self.emit('**')
        if tag=='em': self.emit('*')
        if tag=='code': self.emit('`')
        if tag=='a': self.href=a.get('href'); self.emit('[')
        if tag=='br': self.emit(' ')
    def emit(self, s):
        if self.cell is not None: self.cell+=s
        else: self.buf+=s
    def handle_endtag(self, tag):
        if self.pre is not None:
            if tag=='pre':
                p=self.pre; self.pre=None
                code=p['text'].rstrip('\n')
                block=[]
                if p.get('src'): block.append(f"<!-- source: {p['src']} -->")
                block.append(f"```{p.get('lang') or ''}\n{code}\n```")
                self.out.append('\n'.join(block))
            return
        if tag=='h2': self.flush('### ')
        elif tag=='p': self.flush()
        elif tag=='div' and self.cls=='step' and self.buf.strip(): self.flush('**','**'); self.cls=None
        elif tag=='li':
            t=re.sub(r'\s+',' ',self.buf).strip()
            self.out.append(('LI:'+t)); self.buf=''
        elif tag in ('ul','ol'): self.list.pop(); self.out.append('ENDLIST')
        elif tag=='strong': self.emit('**')
        elif tag=='em': self.emit('*')
        elif tag=='code': self.emit('`')
        elif tag=='a': self.emit(f']({self.href})')
        elif tag in ('td','th'): self.row.append(re.sub(r'\s+',' ',self.cell).strip() or ' '); self.cell=None
        elif tag=='tr': self.table.append(self.row); self.row=None
        elif tag=='table':
            t=self.table; self.table=None
            lines=['| '+' | '.join(t[0])+' |','| '+' | '.join('---' for _ in t[0])+' |']+['| '+' | '.join(r)+' |' for r in t[1:]]
            self.out.append('\n'.join(lines))
    def handle_data(self, d):
        if self.pre is not None: self.pre['text']+=d; return
        if self.cell is not None: self.cell+=d; return
        self.buf+=d

def convert(page):
    s=open(page).read()
    main=re.search(r'<main id="main">(.*)</main>',s,re.S).group(1)
    c=Conv(); c.feed(main); c.flush()
    # join list items into blocks
    blocks=[]; li=[]
    for o in c.out:
        if o.startswith('LI:'): li.append(o[3:]); continue
        if o=='ENDLIST':
            if li: blocks.append('\n'.join(li)); li=[]
            continue
        blocks.append(o)
    return blocks

root=sys.argv[1]
N=len(glob.glob(f'{root}/part*.html'))
titles=[re.search(r'<h1>(.*?)</h1>',open(f'{root}/part{n}.html').read()).group(1) for n in range(1,N+1)]
idx=open(f'{root}/index.html').read()
out=['# '+html.unescape(re.search(r'<h1>(.*?)</h1>',idx).group(1)),
     '### '+html.unescape(re.search(r'<p class="subtitle">(.*?)</p>',idx).group(1)),
     '*Built with Next.js, the AI SDK, Neon, and Vercel. Fabulosa Books is an independent bookstore in San Francisco\'s Castro. The same tutorial is in [`html/`](../html/index.html), and the app it builds is in [`scheduling-agent/`](scheduling-agent/).*']
for n in range(1,N+1):
    out.append('---')
    out.append(f'## Part {n}: {html.unescape(titles[n-1])}')
    out.extend(convert(f'{root}/part{n}.html'))
print('\n\n'.join(out).rstrip()+'\n', end='')
