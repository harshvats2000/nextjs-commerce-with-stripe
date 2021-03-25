import { useRouter } from "next/router";
import useSWR from "swr";

export default function Result() {
  const router = useRouter();
  const { session_id } = router.query;

  const { data, errors } = useSWR(session_id ? `/api/checkout/${router.query.session_id}` : null, (url) => fetch(url).then((res) => res.json()));
  return (
    <>
      <h1>Payment Result</h1>
      <div>{session_id}</div>
      <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
    </>
  );
}
