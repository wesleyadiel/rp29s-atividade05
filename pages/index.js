import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { Configuration, OpenAIApi, OpenAI } from "openai";



export default function Home() {
  const [gpt, setGpt] = useState({});
  const [search, setSearch] = useState("");
  const [paletaLista, setPaletaLista] = useState([]);
  const [paletaSelecionado, setPaletaSelecionada] = useState({});

  useEffect(() => {
    startOpenAI();
  }, []);


  const showLoading = () => {
    document.getElementById("loading").style.display = "inline-block";
    document.getElementById("inputSearch").style.display = "none";
  }

  const hideLoading = () => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("inputSearch").style.display = "block";
  }

  const startOpenAI = () => {
    setGpt(new OpenAI({
      organization: process.env.NEXT_PUBLIC_OPENAI_ORG,
      apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
      dangerouslyAllowBrowser: true
    }));
  }

  const searchPs = async (e) => {
    if (e.key != 'Enter')
      return;

    showLoading();
    try {
      const response = await gpt.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        response_format: { "type": "json_object" },
        messages: [
          { "role": "system", "content": "You are a helpful assistant designed to output JSON." },
          { "role": "user", "content": `Me de 4 paleta de cores em hexadecimal para ${search} em formato json com name paletas e com os atributos: CorPrimaria, CorSecundaria, CorTexto` }
        ]
      });

      var bodyStyles = document.body.style;
      JSON.parse(response.choices[0].message.content).paletas.forEach((e, index) => {
        const pId = index + 1;
        bodyStyles.setProperty(`--bg-p-p${pId}`, `${e.CorPrimaria}`);
        bodyStyles.setProperty(`--bg-s-p${pId}`, `${e.CorSecundaria}`);
        bodyStyles.setProperty(`--c-t-p${pId}`, `${e.CorTexto}`);
      });

    } catch (ex) {
      console.log(ex)
    }
    hideLoading();
  }

  const applyPToPage = (index) => {
    var bodyStyles = document.body.style;
    var CorPrimaria = bodyStyles.getPropertyValue(`--bg-p-p${index}`);
    var CorSegundaria = bodyStyles.getPropertyValue(`--bg-s-p${index}`);
    var CorTexto = bodyStyles.getPropertyValue(`--c-t-p${index}`);

    navigator.clipboard.writeText(JSON.stringify({CorPrimaria, CorSegundaria, CorTexto}));
    bodyStyles.setProperty(`--bg-p-selected`, CorPrimaria);
    bodyStyles.setProperty(`--bg-s-selected`,CorSegundaria);
    bodyStyles.setProperty(`--c-t-selected`, CorTexto);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Paleta de cores</title>
        <meta name="description" content="Geração de paleta de cores utilizando IA" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
      </Head>

      <div className="lds-ellipsis" id="loading"><div><div></div><div></div><div></div><div></div></div></div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a>Bem vindo!</a>
        </h1>
        <h2 className={styles.title}>Digite a baixo o assunto relacionado a paleta de cores desejada.</h2>

        <div className={styles.description}>
          <div className="row mt-12">
            <div className="col-md-12">
              <div className="input-group">
                <input className="form-control border rounded-pill" id="inputSearch" type="text" placeholder="digite aqui..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => searchPs(e)} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.cardPaleta1} onClick={() => applyPToPage(1)} title="Clique para visualizar cores na página e copiar código de cores.">
            <div className={styles.corPrimariaP1}>
              <a>Seu titulo</a>
            </div>
            <div className={styles.corSegundariaP1}>
              <a>Sua descrição</a>
            </div>
          </div>

          <div className={styles.cardPaleta2} onClick={() => applyPToPage(2)} title="Clique para visualizar cores na página e copiar código de cores.">
            <div className={styles.corPrimariaP2}>
              <a>Seu titulo</a>
            </div>
            <div className={styles.corSegundariaP2}>
              <a>Sua descrição</a>
            </div>
          </div>


          <div className={styles.cardPaleta3} onClick={() => applyPToPage(3)} title="Clique para visualizar cores na página e copiar código de cores.">
            <div className={styles.corPrimariaP3}>
              <a>Seu titulo</a>
            </div>
            <div className={styles.corSegundariaP3}>
              <a>Sua descrição</a>
            </div>
          </div>

          <div className={styles.cardPaleta4} onClick={() => applyPToPage(4)} title="Clique para visualizar cores na página e copiar código de cores.">
            <div className={styles.corPrimariaP4}>
              <a>Seu titulo</a>
            </div>
            <div className={styles.corSegundariaP4}>
              <a>Sua descrição</a>
            </div>
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>

  )
}
