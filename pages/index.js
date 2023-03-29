import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { formatFileOutput } from "../utils/formatFileOutput";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDonwloadUrl] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setDonwloadUrl();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setLoading(false)
      setResults(oldResults => [...oldResults, data.result]);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const onDownload = () => {
    const formattedResults = formatFileOutput(results)
    const blob = new Blob([formattedResults], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    setDonwloadUrl(url)
  };

  return (
    <div>
      <Head>
        <title>OpenAI Wrapper</title>
      </Head>

      <main className={styles.main}>
        <h3>Enter a prompt</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="prompt"
            placeholder="Enter a prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <input type="submit" value="Generate result" />
        </form>
        {results.map((result) =>
          <div className={styles.result}>{result}</div>
        )}
        {loading && <span className={styles.loading}>Loading.......</span>}
        <button className={styles.generate} onClick={onDownload}>Generate download</button>
        {downloadUrl && <a className={styles.download} href={downloadUrl} download>Download results</a>}
      </main>
    </div>
  );
}