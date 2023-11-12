import type { NextPage } from "next";
import { useContractRead } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/assets/Spinner";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { getContractNames } from "~~/utils/scaffold-eth/contractNames";

const contractNames = getContractNames();

const Pixel = ({ x, y, state }: { x: number; y: number; state: boolean }) => {
  return (
    <div
      className={`group relative h-1 w-1 lg:box-border lg:border lg:h-1.5 lg:w-1.5 2xl:h-2 2xl:w-2 ${
        state ? "bg-black hover:bg-blue-700 select:bg-blue-700" : "bg-white hover:bg-blue-300 select:bg-blue-300"
      }`}
    >
      <span className="z-50 absolute invisible group-hover:visible bg-blue-700 p-1 text-sm text-gray-100 rounded-md -top-10 -left-12 w-24 text-center cursor-default">
        {`x: ${x}, y: ${y}`}
      </span>
    </div>
  );
};

const Row = ({ row, rowIndex }: { row: boolean[]; rowIndex: number }) => {
  return row
    .map((cell, columnIndex) => <Pixel key={rowIndex + " " + columnIndex} x={rowIndex} y={columnIndex} state={cell} />)
    .reverse();
};

const Canvas = ({ rawStatesData }: { rawStatesData: boolean[][] }) => {
  return (
    <div className="flex flex-row">
      {rawStatesData.map((row, rowIndex) => (
        <div className="flex flex-col" key={rowIndex}>
          <Row row={row} rowIndex={rowIndex} />
        </div>
      ))}
    </div>
  );
};

const KilimState = () => {
  const contractName = "Kilim";
  const { data: deployedContractData } = useDeployedContractInfo(contractName);

  const { data, error, status } = useContractRead({
    address: deployedContractData?.address,
    abi: deployedContractData?.abi,
    functionName: "getStates",
    watch: true,
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });

  return (
    <>
      {data !== null && data !== undefined && <Canvas rawStatesData={data as boolean[][]} />}
      {(status === "idle" || status === "loading") && <Spinner width="50px" height="50px" />}
      {error && (
        <>
          <p className="mt-8 font-bold">{error.name}</p>
          <p className="max-w-2xl text-gray-300">{error.message}</p>
        </>
      )}
    </>
  );
};

const Kilim: NextPage = () => {
  return (
    <>
      <MetaHeader title="Kilim | Scaffold-ETH 2" description="Interact with your kilim" />
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {contractNames.filter(name => name === "Kilim").length === 0 ? (
          <p className="text-3xl mt-14">Cannot found a Kilim contract!</p>
        ) : (
          <div className="bg-base-300 rounded-3xl shadow-lg shadow-base-300 p-6 2xl:p-8">
            <KilimState />
          </div>
        )}
      </div>
    </>
  );
};

export default Kilim;
