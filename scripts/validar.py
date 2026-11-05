#!/usr/bin/env python3
"""Pruebas de estructura sin dependencias externas."""
from pathlib import Path
import json,re,html,sys
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'data/caballos.json').read_text(encoding='utf-8'))
class Inspect(HTMLParser):
 def __init__(self):
  super().__init__();self.links=[];self.images=[];self.ids=set();self.duplicate_ids=[];self.walinks=[]
 def handle_starttag(self, tag,attrs):
  a=dict(attrs)
  if a.get('id'):
   if a['id'] in self.ids: self.duplicate_ids.append(a['id'])
   self.ids.add(a['id'])
  if tag=='a':
   self.links.append(a.get('href',''))
   if a.get('data-wa-horse'): self.walinks.append(a['data-wa-horse'])
  if tag=='img': self.images.append(a)
errors=[]
assert len(DATA)==8, 'Deben existir 8 caballos demo'
assert len({x['slug'] for x in DATA})==len(DATA)
for h in DATA:
 for key in ('name','code','slug','age','level','photos','sex'):
  if not h.get(key):errors.append(f'{h.get("slug")}: no existe {key}')
for fp in ROOT.rglob('*.html'):
 p=Inspect();p.feed(fp.read_text(encoding='utf-8'))
 if p.duplicate_ids:errors.append(f'{fp}: IDs repetidos: {p.duplicate_ids}')
 for a in p.links:
  if a.startswith(('https://','mailto:','tel:','#')) or not a:continue
  target=(fp.parent / a.partition('#')[0]).resolve()
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{fp}: link roto: {a}')
 for i in p.images:
  if i.get('src') and i.get('data-fallback'):
   fallback=(fp.parent / i['data-fallback']).resolve()
   if not fallback.exists():errors.append(f'{fp}: fallback faltante: {fallback}')
  if i.get('src') and not i.get('alt'):errors.append(f'{fp}: imagen sin alt')
 for nm in p.walinks:
  if not (nm in [x['name'] for x in DATA]): errors.append(f'{fp}: caballo WA desconocido: {nm}')
for h in DATA:
 fp=ROOT/'caballos'/h['slug']/'index.html'
 if not fp.exists():errors.append(f'Falta ficha: {h["slug"]}')
 if 'data-wa-code="'+h['code']+'"' not in fp.read_text(encoding='utf-8'):errors.append(f'Falta código de WhatsApp: {h["slug"]}')
for filename in ('assets/js/site.js','assets/js/catalog.js','assets/css/styles.css','assets/images/horse-placeholder.svg','index.html'):
 if not (ROOT/filename).exists():errors.append('Falta '+filename)
if errors:
 print('\n'.join('ERROR '+e for e in errors));sys.exit(1)
print('OK: 8 caballos, 9 páginas, enlaces internos, imágenes fallback y botones de consulta.')
