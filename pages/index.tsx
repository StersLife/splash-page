// pages/index.tsx
import dynamic from "next/dynamic";
import Head from "next/head";

const MerakiLoginForm = dynamic(() => import("../app/MerakiLoginForm"), {
  ssr: false, // This will disable server-side rendering for the component
});

export default function HomePage() {
  const makeUrl =
    process.env.MAKE_URL ||
    "https://hook.us1.make.com/ytgjc3373u413as7bfmeru9scdjmfxap"; // Use environment variables

  return (
    <>
      <Head>
        <title>Welcome to Connect.Cohosting</title>
        <meta name="description" content="Login to access WiFi services" />
      </Head>

      <div className="container">
        <h1>Welcome to Connect.Cohosting</h1>
        <p>Please log in to continue:</p>
        <MerakiLoginForm makeUrl={makeUrl} />
      </div>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #0070f3;
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}
