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
   3) skipWaiting(): assim que uma nova versão deste arquivo é
      instalada, ela fica pronta e ativa imediatamente, sem esperar
      todas as abas antigas fecharem. NÃO chamamos mais
      self.clients.claim() — abas já abertas continuam com o Service
      Worker que já as controlava até a PRÓXIMA navegação/recarga
      (nunca no meio de uma em andamento); só uma aba aberta depois
      desta instalação é que já nasce controlada pela nova versão.
   4) O "activate" apaga qualquer cache de uma versão anterior.
   5) Na navegação, uma falha ao salvar em cache (CacheStorage) nunca
      derruba a página: a resposta de rede é devolvida ao navegador
      assim que chega, e a gravação em cache acontece à parte, depois,
      sem poder interferir nela.

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
      /* NÃO chamamos mais self.clients.claim() aqui. Motivo: claim()
         força o Service Worker a assumir controle imediato de abas
         que JÁ ESTÃO abertas/carregando — inclusive a própria aba no
         meio de uma navegação em andamento. Sem essa chamada, o SW
         continua assumindo controle normalmente, só que da forma
         padrão do navegador: na PRÓXIMA navegação/recarregamento,
         nunca no meio de uma que já está em curso. */
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
          // A rede é a fonte da verdade: se ela responder, a página é
          // devolvida IMEDIATAMENTE — o CacheStorage nunca entra no
          // caminho crítico da resposta. Regra: falha de cache != falha
          // de navegação.
          const respostaRede = await fetch(requisicao);
          const cloneParaCache = respostaRede.clone(); // clonar já, antes de qualquer outra coisa

          // Salvar no cache é só uma otimização para uso offline futuro.
          // event.waitUntil() mantém o Service Worker vivo tempo
          // suficiente para essa tarefa terminar, mas SEM atrasar nem
          // condicionar a resposta já devolvida na linha abaixo. Se
          // caches.open()/cache.put() falharem (como no erro real
          // encontrado: "UnknownError: Failed to execute 'open' on
          // 'CacheStorage'"), isso vira só um aviso no console — nunca
          // um ERR_FAILED para quem está navegando.
          event.waitUntil(
            (async () => {
              try {
                const cache = await caches.open(CACHE_VERSION);
                await cache.put(requisicao, cloneParaCache);
              } catch (erroCache) {
                console.warn('[SW] Não foi possível salvar a navegação em cache (a página foi entregue normalmente mesmo assim):', erroCache && erroCache.message);
              }
            })()
          );

          return respostaRede;
        } catch (erroRede) {
          // A rede falhou de verdade (ex.: offline) — só agora faz
          // sentido tentar o cache como reserva.
          try {
            const respostaCache = await caches.match(requisicao);
            if (respostaCache) return respostaCache;
          } catch (erroCacheMatch) {
            console.warn('[SW] Falha também ao consultar o cache como reserva:', erroCacheMatch && erroCacheMatch.message);
          }
          // Sem rede E sem cache disponível: não há mais nenhuma
          // resposta possível — aqui sim Response.error() é o
          // resultado correto (não um bug, é o cenário real "offline
          // e sem nada salvo").
          return Response.error();
        }
      })()
    );
    return;
  }

  // Demais recursos (fontes, ícones, manifest): também network-first,
  // com cache só como reserva para uso offline. Mesmo padrão já
  // validado no branch de navegação acima: a rede decide a resposta;
  // o CacheStorage nunca entra no caminho crítico dela.
  event.respondWith(
    (async () => {
      try {
        const respostaRede = await fetch(requisicao);
        const cloneParaCache = respostaRede.clone(); // clonar já, antes de qualquer outra coisa

        // Salvar em cache é só otimização para uso offline futuro —
        // acontece à parte, sem poder atrasar nem substituir a
        // resposta de rede já devolvida logo abaixo.
        event.waitUntil(
          (async () => {
            try {
              const cache = await caches.open(CACHE_VERSION);
              await cache.put(requisicao, cloneParaCache);
            } catch (erroCache) {
              console.warn('[SW] Não foi possível salvar recurso em cache; recurso entregue normalmente:', erroCache && erroCache.message);
            }
          })()
        );

        return respostaRede;
      } catch (erroRede) {
        // A rede falhou de verdade (ex.: offline) — só agora faz
        // sentido tentar o cache como reserva.
        try {
          const respostaCache = await caches.match(requisicao);
          if (respostaCache) return respostaCache;
        } catch (erroCacheMatch) {
          console.warn('[SW] Falha ao consultar cache como reserva:', erroCacheMatch && erroCacheMatch.message);
        }
        // Sem rede E sem cache disponível: não há mais nenhuma
        // resposta possível — Response.error() é o resultado correto
        // aqui (cenário real "offline e sem nada salvo").
        return Response.error();
      }
    })()
  );
});
