"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Status({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<any>();

  useEffect(() => {
    fetch(`http://harugeo_api.zevoers.dev/status/${params.id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setStatus(result);
      });
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24`}
    >
      <>
        {status ? (
          status.processed ? (
            <p>
              작업이 완료되었습니다
              <Link
                href={`/solution/${params.id}`}
                className="text-[dodgerblue]"
              >
                {" "}
                결과 확인하기
              </Link>
            </p>
          ) : status.current ? (
            <p>하루가 문제를 풀이중입니다</p>
          ) : status.queue ? (
            <p>하루에게 문제가 전달되었습니다</p>
          ) : (
            <p>문제를 찾을 수 없습니다</p>
          )
        ) : (
          <p>Loading</p>
        )}
      </>
    </main>
  );
}
