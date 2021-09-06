import IAppTableColumns from "./interfaces/IAppTableColumns";


import AppForm from "./components/AppForm";
import AppTable from "./components/AppTable";
import {useEffect, useRef, useState} from "react";
import AppStateProvider from "./AppStateProvider";
import GlobalModal from "./components/global/GlobalModal";

const columns : IAppTableColumns = [
    {
        name: 'day',
        title: 'Дата'
    },
    {
        name: 'totalMileage',
        title: 'Общий пробег'
    },
    {
        name: 'mileagePerDay',
        title: 'Пробег за день'
    },
    {
        name: 'tankRemaining',
        title: 'Остаток в баке'
    },
    {
        name: 'date',
        title: 'Дата',
        show: false
    }
]

function App() {
  const [showTable, setShowTable] = useState(false)
  const [updateTable, setUpdateTable] = useState(false)
  const tableWrapperRef = useRef<null | HTMLDivElement>(null)

  const handleFormSubmit : () => void = () => {
      setShowTable(true)
      setUpdateTable(true)
  }

  const scrollToTable : () => void = () => {
      let tableNode  = tableWrapperRef.current
      if (!!tableNode) {
          tableNode.scrollIntoView({behavior: 'smooth'})
      }
  }

  const tableRendered : () => void = () => {
      scrollToTable()
  }

  const print : () => void = () => {
      window.print()
  }

  useEffect(() => {
      setUpdateTable(false)
  }, [updateTable])

  return (
      <AppStateProvider>
          <div className="mb-16">
              <div className="px-4 container mx-auto">
                <h1>ПУТЬ.М</h1>
                <hr/>
                <div className="py-8 grid grid-gap-6">
                  <AppForm onSubmit={handleFormSubmit}/>
                </div>
                <div ref={tableWrapperRef}>
                    {showTable && (<AppTable columns={columns}
                                             updated={updateTable}
                                             rendered={tableRendered}
                        />
                    )}
                </div>
                  {showTable && (
                      <div className="mt-4 print:hidden">
                          <button className="button-green w-full lg:w-auto" onClick={print}>Печать</button>
                      </div>
                  )}
              </div>
              <GlobalModal/>
          </div>
      </AppStateProvider>
  )
}

export default App;
