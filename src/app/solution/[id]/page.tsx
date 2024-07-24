"use client";

import { lrstrip, rtrim, ltrim } from "../../../utils/types/StringUtil";
import { useState, useEffect } from "react";

import { Tooltip } from "react-tooltip";
import "../../../styles/Solution.css";

import Toggle from "react-toggle";
import ReactModal from "react-modal";
import {
  Item,
  ItemParams,
  Menu,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";
import { useSnackbar } from "notistack";
import { COORD } from "../../../utils/types/DataUtil";
import { JSXGraphCanvas, JSXGraph } from "../../../shared/components/JsxGraph";
import { getRandomIntInclusive } from "../../../utils/types/MathUtil";

const test_file = `
==========================
 * From theorem premises:
A B C H G1 G2 G O : Points
BH ⟂ AC [00]
AH ⟂ BC [01]
G_1,C,B are collinear [02]
G_1B = G_1C [03]
C,A,G_2 are collinear [04]
G_2C = G_2A [05]
G_1,A,G are collinear [06]
G_2,B,G are collinear [07]
OB = OC [08]
OA = OB [09]

 * Auxiliary Constructions:
H2 G3 : Points
CA ⟂ H_2B [10]
C,A,H_2 are collinear [11]
A,B,G_3 are collinear [12]
G_3A = G_3B [13]

 * Proof steps:
001. G_1,C,B are collinear [02] & G_1B = G_1C [03] ⇒  G_1 is midpoint of CB [14]
002. C,A,G_2 are collinear [04] & G_2C = G_2A [05] ⇒  G_2 is midpoint of CA [15]
003. G_1 is midpoint of CB [14] & G_2 is midpoint of CA [15] ⇒  G_1G_2 ∥ BA [16]
004. G_1G_2 ∥ AB [16] & G_1,A,G are collinear [06] & G_2,B,G are collinear [07] ⇒  G_1G_2:G_1G = AB:AG [17]
005. A,B,G_3 are collinear [12] & G_3A = G_3B [13] ⇒  G_3 is midpoint of BA [18]
006. G_2 is midpoint of CA [15] & G_3 is midpoint of BA [18] ⇒  G_2G_3 ∥ CB [19]
007. A,B,G_3 are collinear [12] & BC ∥ G_2G_3 [19] & AB ∥ G_1G_2 [16] ⇒  ∠G_3G_2G_1 = ∠G_2G_3A [20]
008. G_1 is midpoint of CB [14] & G_3 is midpoint of BA [18] ⇒  G_1G_3 ∥ CA [21]
009. G_2,A,C are collinear [04] & A,B,G_3 are collinear [12] & AC ∥ G_1G_3 [21] & AB ∥ G_1G_2 [16] ⇒  ∠G_3G_1G_2 = ∠G_2AG_3 [22]
010. ∠G_3G_2G_1 = ∠G_2G_3A [20] & ∠G_3G_1G_2 = ∠G_2AG_3 [22] (Similar Triangles)⇒  G_2G_1 = G_3A [23]
011. CA ⟂ H_2B [10] & BH ⟂ AC [00] & C,A,H_2 are collinear [11] ⇒  BH_2 ⟂ H_2A [24]
012. BH_2 ⟂ H_2A [24] & G_3 is midpoint of BA [18] ⇒  BG_3 = H_2G_3 [25]
013. G_1G_2:G_1G = AB:AG [17] & G_2G_1 = G_3A [23] & G_3A = G_3B [13] & BG_3 = H_2G_3 [25] ⇒  H_2G_3:G_1G = AB:AG [26]
014. G_1B = G_1C [03] & OB = OC [08] ⇒  CB ⟂ G_1O [27]
015. CB ⟂ G_1O [27] & AH ⟂ BC [01] & AB ∥ G_1G_2 [16] ⇒  ∠HAB = ∠OG_1G_2 [28]
016. OA = OB [09] & OB = OC [08] ⇒  OC = OA [29]
017. G_2C = G_2A [05] & OC = OA [29] ⇒  CA ⟂ G_2O [30]
018. CA ⟂ G_2O [30] & BH ⟂ AC [00] & AB ∥ G_1G_2 [16] ⇒  ∠HBA = ∠OG_2G_1 [31]
019. ∠HAB = ∠OG_1G_2 [28] & ∠HBA = ∠OG_2G_1 [31] (Similar Triangles)⇒  AB:HA = G_1G_2:G_1O [32]
020. G_1G_2:G_1O = AB:HA [32] & G_2G_1 = G_3A [23] & G_3A = G_3B [13] & BG_3 = H_2G_3 [25] ⇒  H_2G_3:G_1O = AB:HA [33]
021. H_2G_3:G_1G = AB:AG [26] & H_2G_3:G_1O = AB:HA [33] ⇒  AG:HA = G_1G:G_1O [34]
022. G_1,A,G are collinear [06] & CB ⟂ G_1O [27] & AH ⟂ BC [01] ⇒  ∠GAH = ∠GG_1O [35]
023. AG:HA = G_1G:G_1O [34] & ∠GAH = ∠GG_1O [35] (Similar Triangles)⇒  ∠AGH = ∠G_1GO [36]
024. ∠AGH = ∠G_1GO [36] & G_1,A,G are collinear [06] ⇒  GH ∥ GO [37]
025. GH ∥ GO [37] ⇒  O,H,G are collinear
==========================
`;

class proposition {
  readonly premises: number[];
  readonly conclusion: number;
  readonly by_similar_triangles: boolean;

  constructor(
    premises: number[],
    conclusion: number,
    by_similar_triangles: boolean = false
  ) {
    this.premises = premises;
    this.conclusion = conclusion;
    this.by_similar_triangles = by_similar_triangles;
  }

  toString = () =>
    `${this.premises.join(", ")} ${
      this.by_similar_triangles ? "(Similar Triangles)" : ""
    } ⇒ ${this.conclusion}`;
}

class solution {
  readonly source: string;
  info: { [key: number]: string };
  tpinfo: number[];
  acinfo: number[];
  tppoints: string[];
  acpoints: string[];
  steps: proposition[];

  constructor(source: string) {
    this.source = source;
    this.info = {};
    this.tpinfo = [];
    this.acinfo = [];
    this.tppoints = [];
    this.acpoints = [];
    this.steps = [];
  }
}

function parse_solution(source: string): solution {
  var sol = new solution(source);

  source = source
    .replace("==========================", "")
    .replace("==========================", "");
  source = rtrim(ltrim(source, "\n"), "\n");

  var [TheoremPremises, AuxiliaryConstructions, ProofSteps] =
    source.split("\n\n");

  TheoremPremises = TheoremPremises.replace(" * From theorem premises:", "");
  AuxiliaryConstructions = AuxiliaryConstructions.replace(
    " * Auxiliary Constructions:",
    ""
  );
  ProofSteps = ProofSteps.replace(" * Proof steps:", "");

  TheoremPremises = lrstrip(TheoremPremises);
  AuxiliaryConstructions = lrstrip(AuxiliaryConstructions);
  ProofSteps = lrstrip(ProofSteps);

  var line: string;
  var match: RegExpMatchArray | null;
  var n: number;

  for (line of TheoremPremises.split("\n")) {
    if (line.endsWith(": Points")) {
      sol.tppoints.push(...lrstrip(line.replace(": Points", "")).split(" "));
      continue;
    }
    match = line.match(/(.+?)\[(\d+)\]/);
    if (match) {
      n = parseInt(match[2]);
      sol.info[n] = lrstrip(match[1]);
      sol.tpinfo.push(n);
    }
  }

  for (line of AuxiliaryConstructions.split("\n")) {
    if (line.endsWith(": Points")) {
      sol.acpoints.push(...lrstrip(line.replace(": Points", "")).split(" "));
      continue;
    }
    match = line.match(/(.+?)\[(\d+)\]/);
    if (match) {
      n = parseInt(match[2]);
      sol.info[n] = lrstrip(match[1]);
      sol.acinfo.push(n);
    }
  }

  var last_line = ProofSteps.split("\n").pop();
  for (line of ProofSteps.split("\n")) {
    var explain = line.substring(line.indexOf(" ") + 1);

    var by_similar_triangles = false;

    if (explain.includes("(Similar Triangles)")) {
      explain = explain.replace("(Similar Triangles)", "");
      by_similar_triangles = true;
    }

    var [p, c] = explain.split(" ⇒ ");
    p = lrstrip(p);
    c = lrstrip(c);

    var match_c = c.match(/(.+?)\[(\d+)\]/);
    if (match_c === null && line !== last_line)
      throw new Error("Invalid Proof Step: " + line);

    if (line === last_line) {
      n = -1;
      sol.info[n] = lrstrip(c);
    } else {
      if (match_c === null) throw new Error("Invalid Proof Step: " + line);
      n = parseInt(match_c[2]);
      sol.info[n] = lrstrip(match_c[1]);
    }
    var pro = new proposition(
      p
        .split(" & ")
        .map((x) => parseInt(x.match(/(.+?)\[(\d+)\]/)?.at(2) ?? "-2")),
      n,
      by_similar_triangles
    );

    sol.steps.push(pro);
  }

  return sol;
}

export default function Solution({ params }: { params: { id: string } }) {
  const [sol, setSol] = useState("");
  const [psol, setPsol] = useState<solution>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`http://harugeo_api.zevoers.dev/solution/${params.id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.content) {
          // console.log(result.content);
          setSol(result.content);
          setPsol(parse_solution(result.content));
          // console.log(parse_solution(result.content));
          // console.log(psol);
        }
        setLoaded(true);
      });
  }, []);

  // console.log(parse_solution(test_file));
  return (
    <main className={`flex h-screen flex-col`}>
      <>
        {loaded ? (
          psol == undefined ? (
            <p>Error</p>
          ) : (
            <>
              {/* <p>{sol}</p> */}
              <ViewSol parsed_sol={psol} />
            </>
          )
        ) : (
          <p>Loading</p>
        )}
      </>
    </main>
  );
}

// Graph View

// export const Graph = ({ sol }: { sol: solution }): JSX.Element => {
//   const [tooltipDisabled, setTooltipDisabled] = useState(false);
//   const [openTextCopyModal, setOpenTextCopyModal] = useState(false);
//   const { enqueueSnackbar, closeSnackbar } = useSnackbar();
//   const { show, hideAll } = useContextMenu({ id: `CTXMenu-${sol.id}` });
//   const graph = new JSXGraph(`jsxcanvas-${sol.id}`);
//   sol.tppoints.forEach((v) =>
//     graph.createPoint(
//       v,
//       new COORD(getRandomIntInclusive(-7, 7), getRandomIntInclusive(-7, 7)),
//       { color: "blue" }
//     )
//   );
//   sol.acpoints.forEach((v) =>
//     graph.createPoint(
//       v,
//       new COORD(getRandomIntInclusive(-7, 7), getRandomIntInclusive(-7, 7)),
//       { color: "orange" }
//     )
//   );
//   graph.createPoint("p1", new COORD(1, 2));
//   graph.createPoint("p2", new COORD(2, 2));
//   graph.createPoint("p3", new COORD(2, 1));
//   graph.createLine("l1", "p1", "p2");
//   graph.createLine("l2", "p2", "p3");
//   graph.createAngle("a1", "p1", "p2", "p3");
//   function onContextMenu(event: React.MouseEvent<HTMLDivElement>): void {
//     event.preventDefault();
//     event.stopPropagation();

//     if (event.target === null) return;
//     if (!(event.target instanceof HTMLElement)) return;
//     var target = getThesisDiv(event.target);

//     hideAll();
//     target !== null &&
//       show({
//         event,
//         props: {
//           key: "value",
//         },
//       });
//   }

//   const handleItemClick = ({ id, event, props, data }: ItemParams) => {
//     switch (id) {
//       case "copy":
//         console.log(event, props);
//         break;
//       case "cut":
//         console.log(event, props);
//         break;
//       default:
//         break;
//     }
//   };

//   var toPointName: (x: string) => string = (x): string =>
//     x[0] + (x.slice(1) ? "_" : "") + x.slice(1);

//   return (
//     <>
//       <div style={{ width: "100%", display: "flex", justifyContent: "left" }}>
//         <JSXGraphCanvas
//           id={`jsxcanvas-${sol.id}`}
//           style={{ width: "800px", height: "800px" }}
//         />
//         <div className="SolutionDiv" onContextMenu={onContextMenu}>
//           <div className="title">
//             <h1>Theorem Premise</h1>
//           </div>
//           {
//             build_thesis_hint(sol.tppoints.map(toPointName).join(", ")).props
//               .children
//           }
//           {sol.tpinfo.map((n) => build_info_view(sol, n))}
//           <div className="title">
//             <h1>Auxiliary Construction</h1>
//           </div>
//           {
//             build_thesis_hint(sol.acpoints.map(toPointName).join(", ")).props
//               .children
//           }
//           {sol.acinfo.map((n) => build_info_view(sol, n))}
//           <div className="title">
//             <h1>Proof Step</h1>
//           </div>
//           {sol.steps.map((pro) => build_step_view(sol, pro))}
//           <Tooltip
//             id={`solution-tooltip-${sol.id}`}
//             place="right"
//             hidden={tooltipDisabled}
//           />
//           {/* <Tooltip id={`solution-ctxmenu-${sol.id}`} place="right" clickable /> */}
//         </div>
//       </div>

//       <button
//         className="btn-outline"
//         onClick={() => setOpenTextCopyModal(true)}
//       >
//         <span>Copy Text</span>
//       </button>
//       {/* <button className="btn-outline" onClick={() => window.navigator.clipboard.writeText(sol.source).then(() => {closeSnackbar(); enqueueSnackbar("Copied Source", {variant:"info"});} )}><span>Copy Source</span></button> */}
//       <button
//         className="btn-outline"
//         onClick={() => {
//           const blob = new Blob([sol.source], { type: "text/plain" });
//           const url = window.URL.createObjectURL(blob);

//           const a = document.createElement("a");
//           a.style.display = "none";
//           a.href = url;
//           a.download = "solution-" + sol.id + ".txt";
//           document.body.appendChild(a);

//           a.click();

//           setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//             closeSnackbar();
//             enqueueSnackbar("Copied Source", { variant: "info" });
//           }, 100);
//         }}
//       >
//         <span>Download Source</span>
//       </button>

//       <div>
//         <label style={{ display: "flex", whiteSpace: "pre" }}>
//           <Toggle
//             onChange={(event) => setTooltipDisabled(!event.target.checked)}
//             defaultChecked={true}
//           ></Toggle>{" "}
//           Enable Thesis Hint
//         </label>
//       </div>

//       <Menu id={`CTXMenu-${sol.id}`}>
//         <Item id="copy" onClick={handleItemClick}>
//           Copy
//         </Item>
//         <Item id="cut" onClick={handleItemClick}>
//           Cut
//         </Item>
//         <Separator />
//         <Item disabled>Disabled</Item>
//         <Separator />
//         <Submenu label="Foobar">
//           <Item id="reload" onClick={handleItemClick}>
//             Reload
//           </Item>
//           <Item id="something" onClick={handleItemClick}>
//             Do something else
//           </Item>
//         </Submenu>
//       </Menu>

//       <ReactModal
//         isOpen={openTextCopyModal}
//         appElement={undefined}
//         onRequestClose={() => setOpenTextCopyModal(false)}
//       >
//         <div className="title">
//           <h1>Main Text</h1>
//         </div>
//         <span style={{ whiteSpace: "pre-wrap" }}>
//           {" * From theorem premises:"}
//           <br />
//           {sol.tppoints.map(toPointName).join(", ")}
//           <br />
//           {sol.tpinfo.map((n) => `[${n + 1}] ` + sol.info[n]).join("\n")}
//           <br />
//           <br />
//           {" * Auxiliary Constructions:"}
//           <br />
//           {sol.acpoints.map(toPointName).join(", ")}
//           <br />
//           {sol.acinfo.map((n) => `[${n + 1}] ` + sol.info[n]).join("\n")}
//           <br />
//           <br />
//           {" * Proof steps:"}
//           <br />
//           {sol.steps
//             .map(
//               (pro) =>
//                 pro.premises
//                   .map((n) => `[${n + 1}] ${sol.info[n]}`)
//                   .join(" & ") +
//                 (pro.conclusion < 0 ? " ⇒" : ` ⇒ [${pro.conclusion + 1}]`) +
//                 ` ${sol.info[pro.conclusion]}`
//             )
//             .join("\n")}
//         </span>
//       </ReactModal>
//     </>
//   );
// };

// Sol Side Bar Code

export const ViewSol = ({ parsed_sol }: { parsed_sol: solution }) => {
  const [isSolBarOpened, setIsSolBarOpened] = useState(true);

  console.log(parsed_sol);
  return (
    <div
      className={
        isSolBarOpened
          ? `flex fixed h-full left-[0px] top-0 items-top`
          : `flex fixed h-full left-[-460px] top-0 items-top`
      }
    >
      <div className="w-[450px] h-full p-8  overflow-y-scroll overflow-x-visible">
        <SolInfoBlocks
          title={"Theorem Premises"}
          infodata={parsed_sol.tpinfo}
          infos={parsed_sol.info}
          pointdatas={parsed_sol.tppoints}
        />
        <div className="mt-6"></div>
        <SolInfoBlocks
          title={"Auxiliary Constructions"}
          infodata={parsed_sol.acinfo}
          infos={parsed_sol.info}
          pointdatas={parsed_sol.acpoints}
        />
        <div className="mt-6"></div>
        <SolInfoBlocks
          title={"Proof Steps"}
          infodata={[
            ...parsed_sol.steps.map((x) => {
              return x.conclusion;
            }),
          ]}
          infos={parsed_sol.info}
          steps={parsed_sol.steps}
        />
      </div>
      <button
        className="relative top-[20px] w-[60px] h-[150px] border-y-2 border-r-2 rounded-r-2xl shadow-[0_0_15px_0px_rgba(0,0,0,0.3)] border-gray-400 flex-col text-[40px] text-gray-400"
        onClick={() => {
          setIsSolBarOpened(!isSolBarOpened);
        }}
      >
        {isSolBarOpened ? "<" : ">"}
      </button>
    </div>
  );
};

export const SolInfoBlocks = ({
  title,
  infodata,
  infos,
  pointdatas = [],
  steps,
}: {
  title: string;
  infodata: number[];
  infos: { [key: number]: string };
  pointdatas?: string[];
  steps?: proposition[];
}) => {
  return (
    <div className={"w-full "}>
      <h1 className="p-1 text-xl font-bold">{title}</h1>

      {pointdatas.length >= 1 && pointdatas[0] != "" && (
        <p className="p-1 italic font-medium text-[#606060]">
          Points :&nbsp;
          {pointdatas.map((x, i) => {
            return <span key={i}>{<ApplySubChar char={x} />}&nbsp;</span>;
          })}
        </p>
      )}

      {infodata.length > 0 ? (
        <>
          {infodata.map((value: number, i: number) => {
            return (
              <div key={value} className="relative">
                <InfoBlock
                  infos={infos}
                  value={value}
                  steps={steps != undefined ? steps : undefined}
                />
              </div>
            );
          })}
        </>
      ) : (
        <p className="p-1 italic font-medium text-[#606060]">No Data</p>
      )}
    </div>
  );
};

export const InfoBlock = ({
  infos,
  value,
  steps,
}: {
  infos: { [key: number]: string };
  value: number;
  steps?: proposition[];
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <span
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
        className="p-1 inline-block"
      >
        <span className="font-bold">
          {value == -1 ? "Conclusion" : value >= 10 ? value : "0" + value}
        </span>
        &nbsp;&nbsp;
        <ApplySubString str={infos[value]} />
      </span>
      {steps != undefined && steps[value] != undefined && (
        <div
          onMouseEnter={() => {
            setHovered(true);
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
          className={
            hovered
              ? "p-1 absolute bottom-[36px] flex items-center bg-white shadow-[0_0_10px_0px_rgba(0,0,0,0.3)] rounded-md border-2 border-gray-400"
              : "p-1 absolute bottom-[36px] hidden items-center bg-white shadow-[0_0_10px_0px_rgba(0,0,0,0.3)] rounded-md border-2 border-gray-400"
          }
        >
          <p>
            {steps[value].premises.map((x) => {
              return (
                <p key={x} className="p-1">
                  <span className="font-bold ">
                    {0 <= x && x <= 9 ? `0${x}` : x}
                  </span>{" "}
                  {infos[x]}
                </p>
              );
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export const ApplySubString = ({ str }: { str: string }) => {
  let results: JSX.Element[] = [];
  let modesub = false;
  let bufstr = "";
  let keycounter = 0;
  for (var i = 0; i < str.length; i++) {
    if (modesub) {
      if ("0" <= str[i] && str[i] <= "9") bufstr = bufstr + str[i];
      else {
        results.push(<sub key={keycounter}>{bufstr}</sub>);
        bufstr = "";
        modesub = false;
        keycounter++;
        if (str[i] == " ") {
          results.push(<span key={keycounter}>{bufstr}&nbsp;</span>);
          bufstr = "";
          keycounter++;
        } else bufstr = bufstr + str[i];
      }
    } else {
      if (str[i] == "_") {
        results.push(<span key={keycounter}>{bufstr}</span>);
        bufstr = "";
        modesub = true;
        keycounter++;
      } else {
        if (str[i] == " ") {
          results.push(<span key={keycounter}>{bufstr}&nbsp;</span>);
          bufstr = "";
          keycounter++;
        } else bufstr = bufstr + str[i];
      }
    }
    if (i == str.length - 1 && bufstr != "")
      results.push(
        modesub ? (
          <sub key={keycounter}>{bufstr}</sub>
        ) : (
          <span key={keycounter}>{bufstr}</span>
        )
      );
    keycounter++;
  }
  return (
    <>
      {results.map((x) => {
        return x;
      })}
    </>
  );
};

export const ApplySubChar = ({ char }: { char: string }) => {
  let variable = "";
  let sub = "";
  for (let i = 0; i < char.length; i++) {
    if ("0" <= char[i] && char[i] <= "9") {
      sub = sub + char[i];
    } else variable = variable + char[i];
  }
  return (
    <>
      <span>{variable}</span>
      <sub>{sub}</sub>
    </>
  );
};
