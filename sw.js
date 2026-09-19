/* ==========================================================================
   Samseg Gestão de Eventos — Service Worker (camada PWA, aditiva)
   ==========================================================================
   REGRA CRÍTICA deste arquivo: o usuário NUNCA deve ficar preso numa
   versão antiga do sistema depois de uma atualização publicada no
   GitHub Pages. Por isso:

   1) Estratégia "network-first" para a navegação (o próprio
      index.html): sempre que houver conexão, busca a versão mais
      recente na rede. O cache só é usado como reserva, para o app
      continuar abrindo quando o dispositivo estiver OFFLINE.
   2) Nenhum "pre-cache" agressivo no install — não guardamos uma
      cópia do sistema de antemão que possa ficar desatualizada.
   3) skipWaiting()+clients.claim(): assim que uma nova versão deste
      arquivo é publicada, ela assume o controle imediatamente, sem
      esperar todas as abas antigas fecharem.
   4) O "activate" apaga qualquer cache de uma versão anterior.

   IMPORTANTE PARA QUEM FOR PUBLICAR UMA NOVA VERSÃO:
   Troque o valor de CACHE_VERSION abaixo (por exemplo, para o mesmo
   valor do APP_VERSION do index.html) sempre que publicar. Trocar
   esse valor é o que faz o navegador perceber que o Service Worker
   mudou e disparar a atualização/limpeza de cache automaticamente.
   ========================================================================== */

const CACHE_VERSION = 'samseg-pwa-v1'; // <- atualizar a cada publicação

self.addEventListener('install', (event) => {
  // Ativa a nova versão do Service Worker assim que instalada, sem
  // esperar o usuário fechar todas as abas abertas do sistema.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Apaga qualquer cache de uma versão anterior deste app —
      // nunca deixa uma cópia antiga do HTML/CSS/JS acessível.
      const nomesCache = await caches.keys();
      await Promise.all(
        nomesCache
          .filter((nome) => nome.startsWith('samseg-pwa-') && nome !== CACHE_VERSION)
          .map((nome) => caches.delete(nome))
      );
      // Assume o controle das abas já abertas imediatamente.
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const requisicao = event.request;

  // Só intercepta requisições GET, próprias origem/CDN de fontes já
  // usadas pelo sistema — nunca intercepta chamadas ao Supabase (elas
  // sempre precisam ir direto para a rede, nunca para o cache, para
  // não servir dados desatualizados).
  if (requisicao.method !== 'GET') return;
  if (requisicao.url.includes('supabase.co')) return;

  // Navegação (abrir/recarregar o app): network-first. Se a rede
  // responder, usa e atualiza o cache de reserva; se falhar (sem
  // internet), cai para o que estiver em cache.
  if (requisicao.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const respostaRede = await fetch(requisicao);
          const cache = await caches.open(CACHE_VERSION);
          cache.put(requisicao, respostaRede.clone());
          return respostaRede;
        } catch (erro) {
          const respostaCache = await caches.match(requisicao);
          return respostaCache || Response.error();
        }
      })()
    );
    return;
  }

  // Demais recursos (fontes, ícones, manifest): também network-first,
  // com cache só como reserva para uso offline.
  event.respondWith(
    (async () => {
      try {
        const respostaRede = await fetch(requisicao);
        const cache = await caches.open(CACHE_VERSION);
        cache.put(requisicao, respostaRede.clone());
        return respostaRede;
      } catch (erro) {
        const respostaCache = await caches.match(requisicao);
        return respostaCache || Response.error();
      }
    })()
  );
});
