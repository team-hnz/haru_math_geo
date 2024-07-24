"use client";

import Logo from "../components/atoms/Logo";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [problem, setProblem] = useState<any>();

  const handleProblemChange = (e: any) => {
    setProblem(e.target.value);
  };

  const handleSend = () => {
    console.log(problem);
    fetch("http://harugeo_api.zevoers.dev/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: problem,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.id) {
          router.push(`/status/${result.id}`);
        }
      });
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24`}
    >
      <Logo />
      <p className="font-medium text-4xl">하루와 함께 수학 문제를 풀어보세요</p>
      <div className=" m-6 rounded-3xl border-[#000000] border-opacity-50 flex  items-center justify-center">
        {/* <input type="problem" onChange={handleChange} /> */}
        <input
          type="text"
          value={problem}
          onChange={handleProblemChange}
          className="w-[30rem] h-[3rem] border-[3px] rounded-l-3xl px-6 text-xl"
        />
        <button
          type="button"
          onClick={handleSend}
          className="w-[5rem] h-[3rem] border-r-[3px] border-t-[3px] border-b-[3px] rounded-r-3xl text-xl text-gray-600"
        >
          시작
        </button>
      </div>
    </main>
  );
}
