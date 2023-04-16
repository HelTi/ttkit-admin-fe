import { useEffect, useState } from "react";

export default function useRequest(func) {
  const [data, setData] = useState();
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await func();
      setLoading(false);
      setData(res);
    }
    try {
      getData();
    } catch (error) {
      setErrMsg(error);
      setLoading(false);
    }
  }, [func]);

  return [loading, data, errMsg];
}
