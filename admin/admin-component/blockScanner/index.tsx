import { BlobOptions } from "buffer";
import { useState, Fragment, useEffect } from "react";
import JsonViewer from "../json-viewer";

// npm i json-tree-viewer

interface scanner {
  networks: any;
}


const objects : any[] = [
  
  {hello : 'hello'}
]


const Blocksetting = (props: scanner) => {
  const [active, setactive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reloadSoket, setReloadSoket] = useState<number>(0)
  const [blockRecord, setBlockrecords] = useState<any>([])

  const [initBlock,setinitBlock]= useState(objects)

  const [chainId, setChainID] = useState<number>(97)

  useEffect(() => {
    try {
      startWebsocket()
    } catch (error) {
      console.log("error === ", error);
    }
  }, [reloadSoket]);


  function startWebsocket() {
    const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

    websocket.onopen = () => {

      setInterval(function () {
           if(chainId === 0) return
           websocket.send(JSON.stringify({ type: "subscribe", chainid : chainId }));

      }, 1000);
    };

    websocket.onmessage = (event) => {
      let receipt = JSON.parse(event.data)
      setinitBlock(receipt?.data)
      // setBlockrecords(JSON.parse(event.data))     
    };

    websocket.onerror = (error) => {
      console.log(error,' ----- console.error')
    };

    websocket.close = () => {
      startWebsocket()
      console.log("connection disconnect");
    };
  }

  const startBlockScannerSocket = async (network: {id : string}) => {
    
    await fetch(`${process.env.NEXT_PUBLIC_CHAIN_SCANNER_ACTIVATION_URL}active/${network.id}`).then(res => res.json())

  };





  return (
    <>
      <section
        className={` lg:p-40 px-[15px] h-[100vh] dark:bg-omega bg-white rounded-16`}
      >
        <div className="max-[1023px] dark:bg-omega bg-white rounded-[10px]">
          <p className="sec-title lg:p-0 pl-20 pt-20">
            BlockChain Block Scanning 
          </p>

          <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
            <div className="flex items-center justify-between  mb-[26px]">
              <div className="flex items-center gap-[15px]">
                {props.networks &&
                  props.networks.map((network: any, index: number) => (
                    <Fragment key={network.id}>
                      <button
                        className={`${
                          active === true
                            ? "admin-solid-button"
                            : "admin-outline-button"
                        }`}
                        onClick={(e) => {
                          if(network?.status === true) return false
                          setActiveTab(index);
                        }}
                      >
                        
                        {network.fullname}  {blockRecord?.block?.map((item : any,index : number) =>{
                         return (<Fragment key={item.chainId+`texting`+index}>
                            {(item.chainId == network.chainId) ? item?.blockNumber : 0 }
                          </Fragment>)
                        })}
                      </button>
                    </Fragment>
                  ))}
              </div>
            </div>

            <div className="w-full"> 
              {props.networks &&
                props.networks.map((network: any, index: number) => (
                  <Fragment key={network.id}>
                    <div
                      key={network.id + network.id}
                      className={`${activeTab === index ? "" : "hidden"}`}
                    >
                      
                      
                      {
                      (network.status === true) ? (<>

                        <JsonViewer array={initBlock} />

                      <button
                        className="admin-solid-button bg-red-dark"
                        onClick={() => {
                          startBlockScannerSocket(network);
                        }}
                      >
                        Stop Scanner
                      </button>

                      </>) : (<><button
                        className="admin-solid-button"
                        onClick={() => {
                          startBlockScannerSocket(network);
                        }}
                      >
                        Active Scanner
                      </button></>)  }
                      
                    </div>
                  </Fragment>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blocksetting;
