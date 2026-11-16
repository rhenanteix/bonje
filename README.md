# MeuBonjee

**MeuBonjee** — "bonjee" é uma expressão iguapense de alegria. É uma plataforma **open source** para centralizar as vagas de emprego do Vale do Ribeira (Registro, Iguape, Cajati, Pariquera-Açu e toda a região), com candidatura ultra-simples: nome, WhatsApp e currículo. Quanto menos campo, mais gente se candidata.

## Licença

Código aberto sob a [licença MIT](LICENSE). Contribuições são bem-vindas!

## Build with Lovable

This project was built with [Lovable](https://lovable.dev). Continue developing in the [Lovable editor](https://lovable.dev/projects/44c5a5dc-88c1-4866-959a-ec124198a833).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Hospedagem na Vercel

Em **Settings → Environment Variables**, configure `VITE_SUPABASE_URL` e
`VITE_SUPABASE_PUBLISHABLE_KEY` com a URL pública do Lovable Cloud e a chave
publicável do mesmo ambiente, utilizadas pelo projeto no Lovable. Ative-as para
Production e Preview antes de gerar uma nova implantação. Não use endereços
locais do ambiente de desenvolvimento nem chaves privadas.

Na Vercel, a leitura pública de vagas prioriza essas duas variáveis. Se elas não
existirem, usa `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`, que precisam apontar
para o mesmo ambiente e ser acessíveis pela Vercel. Variáveis `VITE_*` também são
usadas pelo formulário de empresas e precisam estar presentes durante o build.

Depois de atualizar o código ou as variáveis, faça **Redeploy** na Vercel. Uma
falha temporária na consulta de vagas não deve derrubar a página: a seção exibe
um aviso e permite tentar novamente. Os logs identificam falhas de configuração
ou de consulta sem expor credenciais.
