import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <StatusInfo />
    </>
  );
}

function StatusInfo() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading && !data) return <p>Carregando...</p>;

  const updatedAt = new Date(data.updated_at).toLocaleString("pt-BR");

  return (
    <div>
      <p>Última atualização: {updatedAt}</p>
      <div>
        <h2>Dependências</h2>
        <details>
          <summary>Banco de dados:</summary>
          <p>
            Conexões abertas: {data.dependencies.database.opened_connections}
          </p>
          <p>
            Máximo de conexões: {data.dependencies.database.max_connections}
          </p>
          <p>Versão do banco de dados: {data.dependencies.database.version}</p>
        </details>
      </div>
    </div>
  );
}
